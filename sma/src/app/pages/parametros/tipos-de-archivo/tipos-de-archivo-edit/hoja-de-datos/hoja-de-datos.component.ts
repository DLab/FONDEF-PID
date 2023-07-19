import { MessageBox, MessageBoxType } from 'src/app/pages/message-box/message.box';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { formatDate } from '@angular/common';
import { FilterList } from 'src/app/utils/filter-list';
import { BaseEditComponent } from 'src/app/pages/util/base-edit-component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { global } from 'src/globals/global';
import { formatDateObject } from 'src/app/utils/date-format/date-format.directive';
import { TiposDeValidacionesEditComponent } from './tipos-de-validaciones-edit/tipos-de-validaciones-edit.component';


@Component({
  selector: 'app-hoja-de-datos',
  templateUrl: './hoja-de-datos.component.html',
  styleUrls: ['./hoja-de-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HojaDeDatosComponent extends BaseEditComponent implements OnInit, AfterViewInit {

  app:any = global;
  form: FormGroup;
  hsTiposValidaciones:any;
  hsTiposErrores:any;
  fields:any[];
  validationEdit:boolean;

  dataSource: MatTableDataSource<any> | null;
  columns: ListColumn[] = [
    { name: global.screen['TipoValidacion'], property: 'tipoValidacion', visible: true, isModelProperty: true }
  , { name: global.screen['TipoError'], property: 'tipoError', visible: true, isModelProperty: true }
  , { name: global.screen['DatosAdicionales'], property: 'datosAdicionales', visible: true, isModelProperty: true }
  , { name: global.screen['Accion'], property: 'accion', visible: true}
] as ListColumn[];

@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any
    , private dialogRef: MatDialogRef<HojaDeDatosComponent>
    , private dialog: MatDialog
    , private baseService: BaseService
    , private fb: FormBuilder
    , private messageBox: MessageBox) { 

      super(data);
      super.hsArray = data.hsArray;
  }

  ngOnInit() {
    this.fields = null;
    this.form = this.fb.group({
      nombre: [{value: this.item.nombre || '', disabled: !this.item.editable}], 
      encabezado: [{value: this.item.encabezado || '', disabled: !this.item.editable}],  
    });    
    if (this.item.isNew || !this.item.validaciones){
      this.item.validaciones = [];
    }
    this.dataSource = new MatTableDataSource();

    this.hsTiposValidaciones = {};
    this.hsArray['TIPOS_DE_VALIDACIONES'].forEach(e => {
      this.hsTiposValidaciones[e.codigo] = e;
    });
    this.hsTiposErrores = {};
    this.hsArray['TIPOS_DE_ERRORES'].forEach(e => {
      this.hsTiposErrores[e.codigo] = e;
    });
    this.item.validaciones.forEach(e => {
      e.tipoValidacion = this.hsTiposValidaciones[e.codigoTipoValidacion].descripcion;
      e.tipoError = this.hsTiposErrores[e.codigoTipoError].descripcion;
    });
    this.changeEncabezado();    
    if (this.item.validaciones == null){
      this.item.validaciones = [];
    }
    this.dataSource.data = this.item.validaciones;
  }
  changeEncabezado(){
    let header:string = this.form.get('encabezado').value;
    this.fields = null;
    this.validationEdit = false;
    this.dataSource.data = [];
    if (header == null || header.length == 0){
      return;
    }
    this.fields = [];
    let arr:string[] = header.split("\t");
    arr.forEach(e=>{
      this.fields.push({codigo: e, descripcion: e});
    });
    this.validationEdit = this.item.editable;
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  addItem(esNormativa:boolean){
    this.editItem({}, true, true, esNormativa);
  }
  editItem(item:any, isNew:Boolean, editable:Boolean, esNormativa:boolean){
      item.editable = editable;
      item.isNew = isNew;
      let tiposDeValidaciones:any[] = [];
      this.hsArray['TIPOS_DE_VALIDACIONES'].forEach(e => {
        if (e['esNormativa'] === esNormativa){
          tiposDeValidaciones.push(e);
        }
      });
      console.log(this.hsArray)
      this.hsArray['tiposDeValidaciones'] = tiposDeValidaciones;
      this.dialog.open(TiposDeValidacionesEditComponent, {
        data: {data: item, hsArray: this.hsArray, fields: this.fields, esNormativo: esNormativa}
      , height: '300px'
      , width: '1100px'
    }).afterClosed().subscribe(newData => {
      if(newData != undefined && newData != true){
        if (newData.isNew){
          this.item.validaciones.push(newData);
          this.dataSource.data = this.item.validaciones;
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_ingresado_con_exito']);  
        }
        else{
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_modificado_con_exito']);  
        }
      }
  });

  }
  deleteItem(row:any){
    let index:number = this.item.validaciones.indexOf(row);
    this.item.validaciones.splice(index, 1);
    this.dataSource.data = this.item.validaciones;
  }

  save(){
    let value:any = {};
    for(var e in this.item){
      value[e] = this.item[e];
    }
    for(var e in this.form.value){
      value[e] = this.form.value[e];
    }
    value.isNew = this.item.isNew;
    this.dialogRef.close(value);
  }
}
