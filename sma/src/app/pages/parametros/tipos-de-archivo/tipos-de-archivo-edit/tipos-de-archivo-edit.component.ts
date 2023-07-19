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
import { HojaDeDatosComponent } from './hoja-de-datos/hoja-de-datos.component';
import { TiposDeValidacionesEditComponent } from './hoja-de-datos/tipos-de-validaciones-edit/tipos-de-validaciones-edit.component';

@Component({
  selector: 'app-tipos-de-archivo-edit',
  templateUrl: './tipos-de-archivo-edit.component.html',
  styleUrls: ['./tipos-de-archivo-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TiposDeArchivoEditComponent extends BaseEditComponent implements OnInit, AfterViewInit {

  app:any = global;
  form: FormGroup;
  fileType:string;
  filterOpenState:boolean = false;

  filterBaseDatos:FilterList = new FilterList();

  dataSource: MatTableDataSource<any> | null;
  columns: ListColumn[] = [
    { name: global.screen['Nombre'], property: 'nombre', visible: true, isModelProperty: true }
  , { name: global.screen['Accion'], property: 'accion', visible: true}
  ] as ListColumn[];

  dsValidacionesNormativas: MatTableDataSource<any> | null;
  colsValidacionesNormativas: ListColumn[] = [
    { name: global.screen['TipoValidacion'], property: 'tipoValidacion', visible: true, isModelProperty: true }
  , { name: global.screen['DatosAdicionales'], property: 'datosAdicionales', visible: true, isModelProperty: true }
  , { name: global.screen['Accion'], property: 'accion', visible: true}
  ] as ListColumn[];

@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatPaginator, { static: true }) pagNormativas: MatPaginator;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any
    , private dialogRef: MatDialogRef<TiposDeArchivoEditComponent>
    , private dialog: MatDialog
    , private baseService: BaseService
    , private fb: FormBuilder
    , private messageBox: MessageBox) { 

      super(data);
  }

  ngOnInit() {
    this.fileType = 'xlsx';
    this.form = this.fb.group({
      codigo: [{value: this.item.codigo || '', disabled: !this.item.isNew}],
      delimitadorArchivo: [{value: this.item.delimitadorArchivo == undefined ? '|' : this.item.delimitadorArchivo == '\t' ? 'T' : this.item.delimitadorArchivo, disabled: !this.item.editable}],
      descripcion: [{value: this.item.descripcion || '', disabled: !this.item.editable}], 
      encabezadoArchivo: [{value: this.item.encabezadoArchivo || '', disabled: !this.item.editable}],  
      observaciones: [{value: this.item.observaciones || '', disabled: !this.item.editable}],  
      codigoBaseDatos: [{value: this.getItem('codigoBaseDatos', 'codigo', 'BASE_DATOS'), disabled: !this.item.editable}],
      usuario: [{value: this.item.usuario || '', disabled: true}],   
      ultModificacion: [{value: this.item.ultModificacion || '', disabled: true}],  
    });    
    if (this.item.isNew){
      this.item.details = {hojasDeDatos: []};
    }
    this.filterBaseDatos.init(this.item.hsArray['BASE_DATOS'], this.form.get('codigoBaseDatos'));    

    this.dataSource = new MatTableDataSource();
    this.dsValidacionesNormativas = new MatTableDataSource();

    if (this.item.details.hojasDeDatos == null){
      this.item.details.hojasDeDatos = [];
    }
    if (this.item.details.validacionesNormativas == null){
      this.item.details.validacionesNormativas = [];
    }

    let hsTiposValidaciones:any = {};
    this.hsArray['TIPOS_DE_VALIDACIONES'].forEach(e => {
      hsTiposValidaciones[e.codigo] = e;
    });
    this.item.details.validacionesNormativas.forEach(e => {
      e.tipoValidacion = hsTiposValidaciones[e.codigoTipoValidacion].descripcion;
    });

    this.dataSource.data = this.item.details.hojasDeDatos;
    this.dsValidacionesNormativas.data = this.item.details.validacionesNormativas;
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dsValidacionesNormativas.paginator = this.pagNormativas;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  get visibleColumnsNormativas() {
    return this.colsValidacionesNormativas.filter(column => column.visible).map(column => column.property);
  }
  
  fileUploaded(file:File):void{
    console.log(file)
    this.item.details.hojasDeDatos = file['body']['data'];
    this.dataSource.data = this.item.details.hojasDeDatos;
  }

  addItem(){
    this.editItem({}, true, true);
  }
  editItem(item:any, isNew:Boolean, editable:Boolean){
      item.editable = editable;
      item.isNew = isNew;
      this.dialog.open(HojaDeDatosComponent, {
        data: {data: item, hsArray: this.item.hsArray}
      , height: '775px'
      , width: '1340px'
    }).afterClosed().subscribe(newData => {
      if(newData != undefined && newData != true){
        if (newData.isNew){
          this.item.details.hojasDeDatos.push(newData);
          this.dataSource.data = this.item.details.hojasDeDatos;
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_ingresado_con_exito']);  
        }
        else{
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_modificado_con_exito']);  
        }
      }
    });
  }

  deleteItem(row:any){
    let index:number = this.item.details.hojasDeDatos.indexOf(row);
    this.item.details.hojasDeDatos.splice(index, 1);
    this.dataSource.data = this.item.details.hojasDeDatos;
  }

  getFields(){
    let fields:any[] = [];
    this.item.details.hojasDeDatos.forEach(e => {
      let arr:string[] = e.encabezado.split("\t");
      arr.forEach(f=>{
        let s = e.nombre + "-" + f;
        fields.push({codigo: s, descripcion: s});
      });        
    });
    return fields;
  }

  addItemValidacion(esNormativa:boolean){
    this.editItemValidacion({}, true, true, esNormativa);
  }
  editItemValidacion(item:any, isNew:Boolean, editable:Boolean, esNormativa:boolean){
      item.editable = editable;
      item.isNew = isNew;
      let tiposDeValidaciones:any[] = [];
      this.hsArray['TIPOS_DE_VALIDACIONES'].forEach(e => {
        if (e['esNormativa'] === esNormativa){
          tiposDeValidaciones.push(e);
        }
      });
      this.hsArray['tiposDeValidaciones'] = tiposDeValidaciones;
      this.dialog.open(TiposDeValidacionesEditComponent, {
        data: {data: item, hsArray: this.hsArray, fields: this.getFields(), esNormativo: esNormativa}
      , height: '300px'
      , width: '1100px'
    }).afterClosed().subscribe(newData => {
      if(newData != undefined && newData != true){
        if (newData.isNew){
          this.item.details.validacionesNormativas.push(newData);
          this.dsValidacionesNormativas.data = this.item.details.validacionesNormativas;
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_ingresado_con_exito']);  
        }
        else{
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_modificado_con_exito']);  
        }
      }
  });

  }
  deleteItemValidacion(row:any){
    let index:number = this.item.details.validacionesNormativas.indexOf(row);
    this.item.details.validacionesNormativas.splice(index, 1);
    this.dsValidacionesNormativas.data = this.item.details.validacionesNormativas;
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
    if (this.item.isNew){
      value.fechaCreacion = new Date();
    }
    value.ultModificacion = new Date();
    value.baseDatos = value.codigoBaseDatos.descripcion;
    value.codigoBaseDatos = value.codigoBaseDatos.codigo;
    value.hojasDeDatos = value.details.hojasDeDatos;
    value.validacionesNormativas = value.details.validacionesNormativas;
    if (value.delimitadorArchivo == 'T' || value.delimitadorArchivo == 't'){
      value.delimitadorArchivo = '\t';
    }
    formatDateObject(value, ['fechaCreacion', 'ultModificacion']);
    this.baseService.guardarTiposDeArchivo(value).subscribe((result:any)=>{
      value.ultModificacion = formatDate(value.ultModificacion, 'yyyy/MM/dd HH:mm:ss', global.currentLocale);
      this.dialogRef.close(value);
    });
  }

}
