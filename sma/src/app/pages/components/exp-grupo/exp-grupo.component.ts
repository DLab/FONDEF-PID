import { clone } from 'lodash-es';
import { BaseService } from './../../../base.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Constantes, global } from 'src/globals/global';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';

@Component({
  selector: 'darta-exp-grupo',
  templateUrl: './exp-grupo.component.html',
  styleUrls: ['./exp-grupo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpGrupoComponent implements OnInit {

  gl:any = global;

  operadores:any[] = Constantes.condiciones.conectores;
  opcionesBooleanas:any[] = Constantes.condiciones.opcionesBooleanas;

  condiciones:any = {};
  tablas:any  = {};


  @Input() editable:boolean = true;
  @Input() formaDeCalculo:any[];
  @Input() tarifas:any[];
  @Input() productos:any[];
  @Input() canales:any[];
  @Input() codigosControlLimites:any[];
  @Input() tipoDato:string;

  @Output() removeItem:EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columns: ListColumn[] = [
    { name: global.screen['Operador'], property: 'operador', visible: true, isModelProperty: true }
  , { name: 'Abrir', property: 'abrir', visible: true, isModelProperty: true }
  , { name: global.screen['Concepto'], property: 'concepto', visible: true, isModelProperty: true }
  , { name: global.screen['Condicion'], property: 'condicion', visible: true, isModelProperty: true }
  , { name: global.screen['Valor'], property: 'valor', visible: true, isModelProperty: true }
  , { name: global.screen['Cumple'], property: 'cumple', visible: true, isModelProperty: true }
  , { name: global.screen['NoCumple'], property: 'nocumple', visible: true, isModelProperty: true }
  , { name: 'Cerrar', property: 'cerrar', visible: true, isModelProperty: true }
  , { name: global.screen['Accion'], property: 'accion', visible: true, isModelProperty: true }
] as ListColumn[];


  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.dataSource.data = this.formaDeCalculo;
    this.formaDeCalculo.forEach((e:any) => {
      this.loadTable(e.concepto);
    });

  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  public addItem(item:any){
    if (item.concepto){
      this.formaDeCalculo.push(clone(item));
      item = item.concepto;
    }
    else{
      this.formaDeCalculo.push({
        operador: null,
        open: [],
        concepto: item,
        condicion: null,
        cumple: 1,
        noCumple: 0,
        valor: null,
        close:[]
      });
    }
    this.dataSource.data = this.formaDeCalculo;
    this.loadTable(item);
  }
  public isValid():boolean{
    for(let i = 0; i < this.formaDeCalculo.length; i++){
      var e:any = this.formaDeCalculo[i];
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
    var index = this.formaDeCalculo.indexOf(item);
    this.formaDeCalculo.splice(index, 1);
    if (this.formaDeCalculo.length > 0){
      this.formaDeCalculo[0].conector = null;
    }
    this.dataSource.data = this.formaDeCalculo;
    this.removeItem.emit(item);
  }
  getCondicion(condicion:string){
    return {condicion: condicion};
  }
  getCondiciones(item:any):any[]{
    let codigo:string = item.concepto.codigo.startsWith('VALFIN') && item.desvalor != undefined && item.desvalor.startsWith('LIMITE') ? 'VALFIN-LIMITE' : item.concepto.codigo;
    let arr:any[]= this.condiciones[codigo];
    if (arr){
      return arr;
    }

    arr = [this.getCondicion('=')];
    let tipoDato:string = item.concepto.codigoTipoDato;
    if (tipoDato != 'C' && tipoDato != 'B' && tipoDato != 'R' && item.concepto.expresadoEnCliente !== 'CODLIMITE' && (!item.concepto.codigo.startsWith('VALFIN') || item.desvalor == undefined || !item.desvalor.startsWith('LIMITE'))){
      arr.push(this.getCondicion('>'));
      arr.push(this.getCondicion('>='));
      arr.push(this.getCondicion('<'));
      arr.push(this.getCondicion('<='));
    }
    if (tipoDato != 'B'){
      arr.push(this.getCondicion('<>'));
    }
    this.condiciones[codigo] = arr;
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
