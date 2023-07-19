import { MatTableDataSource } from '@angular/material/table';
import { Component, EventEmitter, Input, OnInit, ViewEncapsulation, Output } from '@angular/core';
import { Constantes, global } from 'src/globals/global';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { BaseService } from 'src/app/base.service';

@Component({
  selector: 'darta-tab-condiciones',
  templateUrl: './tab-condiciones.component.html',
  styleUrls: ['./tab-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabCondicionesComponent implements OnInit {

  gl:any = global;

  tablas:any  = {};
  opcionesBooleanas:any[] = Constantes.condiciones.opcionesBooleanas;

  
  @Input() editable:boolean = true;
  @Input() items:any[];
  @Input() codigosControlLimites:any[];

  @Output() removeItem:EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: ListColumn[] = [
      { name: global.screen['Concepto'], property: 'concepto', visible: true, isModelProperty: true }
    , { name: global.screen['Valor'], property: 'valor', visible: true, isModelProperty: true }
    , { name: global.screen['Accion'], property: 'accion', visible: true, isModelProperty: true }
  ] as ListColumn[];

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.dataSource.data = this.items;
    this.items.forEach((e:any) => {
      this.loadTable(e.concepto);
    });

  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  private _addItem(e:any){
    this.items.push({
      concepto: e,
      descripcionConcepto: e.descripcion,
      valor: null
    });
    this.loadTable(e);
  }
  public addItem(item:any){
    if (item.expresion){
      var arr:any[] = JSON.parse(item.expresion).conditions;
          arr.forEach(e=>this._addItem(e));
    }
    else{
      this.items.push({
        concepto: item,
        descripcionConcepto: item.descripcion,
        valor: null
      });
      this.loadTable(item);
    }

    this.dataSource.data = this.items;    
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

  deleteRow(item:any){
    var index = this.items.indexOf(item);
    this.items.splice(index, 1);
    this.dataSource.data = this.items;
    this.removeItem.emit(item);
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
