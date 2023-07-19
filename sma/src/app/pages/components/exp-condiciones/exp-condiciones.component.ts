import { clone } from 'lodash-es';
import { BaseService } from './../../../base.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Constantes, global } from 'src/globals/global';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';

@Component({
  selector: 'darta-exp-condiciones',
  templateUrl: './exp-condiciones.component.html',
  styleUrls: ['./exp-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpCondicionesComponent implements OnInit {

  gl:any = global;

  conectoresLogicos:any[] = Constantes.condiciones.conectoresLogicos;
  opcionesBooleanas:any[] = Constantes.condiciones.opcionesBooleanas;

  operadores:any = {};
  tablas:any  = {};


  @Input() editable:boolean = true;
  @Input() items:any[];
  @Input() tarifas:any[];
  @Input() productos:any[];
  @Input() roles:any[];
  @Input() canales:any[];
  @Input() codigosControlLimites:any[];

  @Output() removeItem:EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: ListColumn[] = [
      { name: global.screen['Conector'], property: 'conector', visible: true, isModelProperty: true }
    , { name: 'Abrir', property: 'abrir', visible: true, isModelProperty: true }
    , { name: global.screen['Concepto'], property: 'concepto', visible: true, isModelProperty: true }
    , { name: global.screen['Operador'], property: 'operador', visible: true, isModelProperty: true }
    , { name: global.screen['Valor'], property: 'valor', visible: true, isModelProperty: true }
    , { name: 'Cerrar', property: 'cerrar', visible: true, isModelProperty: true }
    , { name: global.screen['Accion'], property: 'accion', visible: true, isModelProperty: true }
  ] as ListColumn[];

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.dataSource.data = this.items;
    this.items.forEach((e:any) => {
      this.loadTable(e.concepto);
    });
    console.log(global.constants)
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  public addItem(item:any){
    if (item.concepto){
      this.items.push(clone(item));
      item = item.concepto;
    }
    else{
      this.items.push({
        conector: null,
        open: [],
        concepto: item,
        operador: null,
        valor: null,
        close:[]
      });
    }
    this.dataSource.data = this.items;
    this.loadTable(item);
  }
  public isValid():boolean{
    for(let i = 0; i < this.items.length; i++){
      var e:any = this.items[i];
      if ((e.conector == null && i > 0) || e.operador == null || e.valor == null){
        return false;
      }
    }
    return true;
  }

  changeTarifa(row:any){
    var tarifa:any = this.tarifas.find((item:any)=>item.codigo == row.codigo);
    row.desvalor = tarifa == undefined ? null : tarifa.descripcion;
  }
  deleteRow(item:any){
    var index = this.items.indexOf(item);
    this.items.splice(index, 1);
    if (this.items.length > 0){
      this.items[0].conector = null;
    }
    this.dataSource.data = this.items;
    this.removeItem.emit(item);
  }
  getOperador(operador:string){
    return {operador: operador};
  }
  getOperadores(item:any):any[]{
    let codigo:string = item.concepto.codigo.startsWith('VALFIN') && item.desvalor != undefined && item.desvalor.startsWith('LIMITE') ? 'VALFIN-LIMITE' : item.concepto.codigo;
    let arr:any[]= this.operadores[codigo];
    if (arr){
      return arr;
    }

    arr = [this.getOperador('=')];
    let tipoDato:string = item.concepto.codigoTipoDato;
    if (tipoDato != 'C' && tipoDato != 'B' && tipoDato != 'R'
        && item.concepto.expresadoEnCliente !== 'CODLIMITE'
        && item.concepto.codigo !== global.constants['CODCOND-ROL']
        && (!item.concepto.codigo.startsWith('VALFIN') || item.desvalor == undefined || !item.desvalor.startsWith('LIMITE'))){
      arr.push(this.getOperador('>'));
      arr.push(this.getOperador('>='));
      arr.push(this.getOperador('<'));
      arr.push(this.getOperador('<='));
    }
    if (tipoDato != 'B'){
      arr.push(this.getOperador('<>'));
    }
    this.operadores[codigo] = arr;
    return arr;
  }

  loadTable(item:any){
    if (item.codigoTipoDato != 'C' || item.codigo === 'PRD' || item.codigo === 'CNL' || this.tablas[item.codigoTabla] != undefined){
        return;
    }
    this.tablas[item.codigoTabla] = [];
    this.baseService.consultarParametro({idPadre: item.codigoTabla}).subscribe((data:any[])=>{
        this.tablas[item.codigoTabla] = data;
    });

  }

}
