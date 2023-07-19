import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { Constantes, global } from 'src/globals/global';

@Component({
  selector: 'darta-exp-calculo',
  templateUrl: './exp-calculo.component.html',
  styleUrls: ['./exp-calculo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpCalculoComponent implements OnInit {

  gl:any = global;

  conectores:any[] = Constantes.condiciones.conectores;
  
  @Input() editable:boolean = true;
  @Input() formaDeCalculo:any[];
  @Input() tarifas:any[];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: ListColumn[] = [
      { name: global.screen['Operador'], property: 'operador', visible: true, isModelProperty: true }
    , { name: 'Abrir', property: 'abrir', visible: true, isModelProperty: true }
    , { name: global.screen['Concepto'], property: 'concepto', visible: true, isModelProperty: true }
    , { name: global.screen['Valor'], property: 'valor', visible: true, isModelProperty: true }
    , { name: 'Cerrar', property: 'cerrar', visible: true, isModelProperty: true }
    , { name: global.screen['Accion'], property: 'accion', visible: true, isModelProperty: true }
  ] as ListColumn[];

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.formaDeCalculo;
  }
  changeTarifa(row:any){
    let find:any = this.tarifas.find((item:any)=>item.codigo == row.codigo);
    row.desvalor = find ? find.descripcion : '';
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  public addItem(item:any){
    this.formaDeCalculo.push({
      conector: null,
      open: [],
      concepto: item,
      valor: null,
      close:[]
    });
    this.dataSource.data = this.formaDeCalculo;
  }
  public isValid():boolean{
    for(let i = 0; i < this.formaDeCalculo.length; i++){
      var e:any = this.formaDeCalculo[i];
      if ((e.conector == null && i > 0) || (e.valor == null && e.concepto.codigo == 'CONSTANTE') || (e.valor == null && e.concepto.codigo == 'VALFIN')){
        return false;
      }
    }
    return true;

  }
  deleteRow(item:any){
    var index = this.formaDeCalculo.indexOf(item);
    this.formaDeCalculo.splice(index, 1);
    this.dataSource.data = this.formaDeCalculo;
  }  
}
