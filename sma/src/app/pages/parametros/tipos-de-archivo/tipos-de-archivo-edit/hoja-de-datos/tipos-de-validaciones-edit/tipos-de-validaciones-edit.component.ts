import { FormBuilder, FormGroup } from '@angular/forms';
import { global } from 'src/globals/global';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseEditComponent } from 'src/app/pages/util/base-edit-component';
import { FilterList } from 'src/app/utils/filter-list';

@Component({
  selector: 'app-tipos-de-validaciones-edit',
  templateUrl: './tipos-de-validaciones-edit.component.html',
  styleUrls: ['./tipos-de-validaciones-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TiposDeValidacionesEditComponent extends BaseEditComponent implements OnInit {

  app:any = global;
  form: FormGroup;
  fields:any[];
  tipoValidacionSelected:String;
  esNormativo: boolean;

  additionalData:any;
  tiposDeValidaciones:any[];

  filterTipoValidacion:FilterList = new FilterList();
  filterTipoErrores:FilterList = new FilterList();

  filterParamId:FilterList = new FilterList();
  filterParamName:FilterList = new FilterList();
  filterParamValue:FilterList = new FilterList();
  filterParamUMedida:FilterList = new FilterList();

  filterLatitud:FilterList = new FilterList();
  filterLongitud:FilterList = new FilterList();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any
            , private dialogRef: MatDialogRef<TiposDeValidacionesEditComponent>
            , private fb: FormBuilder) { 

      super(data);
      super.hsArray = data.hsArray;
      this.fields = data.fields;
      this.esNormativo = data.esNormativo;
  }


  ngOnInit() {
    if (!this.item.isNew){
      this.additionalData = JSON.parse(this.item.datosAdicionales);
    }
    this.form = this.fb.group({
        tipoValidacion: [{value: this.getItem('codigoTipoValidacion', 'codigo', 'tiposDeValidaciones'), disabled: !this.item.editable}]
      , tipoError: [{value: this.getItem('codigoTipoError', 'codigo', 'TIPOS_DE_ERRORES'), disabled: !this.item.editable}]
    });    
    this.filterTipoValidacion.init(this.hsArray['tiposDeValidaciones'], this.form.get('tipoValidacion'));    
    this.filterTipoErrores.init(this.hsArray['TIPOS_DE_ERRORES'], this.form.get('tipoError'));    
    this.changeTipoValidacion();
  }
  getValue(field:string, type:string):any{
    if (this.item.isNew || this.item.codigoTipoValidacion != type){
      return null;
    }
    let value:string = this.additionalData[field];
    return this.fields.find(e=> e.codigo == value);
  }
  changeTipoValidacion(){
    if (this.esNormativo){
      return;
    }
    let value:any = this.form.get('tipoValidacion').value;
    let tipoError:any = this.form.get('tipoError').value;
    if (value == null){
      this.form = this.fb.group({
        tipoValidacion: [{value: this.getItem('codigoTipoValidacion', 'codigo', 'tiposDeValidaciones'), disabled: !this.item.editable}],
        tipoError: [{value: this.getItem('codigoTipoError', 'codigo', 'TIPOS_DE_ERRORES'), disabled: !this.item.editable}]});
      this.tipoValidacionSelected = null;
      this.form.get('tipoError').setValue(tipoError);
      return;
    }
    if (value.codigo == 'TIPO_PARAMETRO'){
      this.form = this.fb.group({
        tipoValidacion: [{value: this.getItem('codigoTipoValidacion', 'codigo', 'tiposDeValidaciones'), disabled: !this.item.editable}],
        tipoError: [{value: this.getItem('codigoTipoError', 'codigo', 'TIPOS_DE_ERRORES'), disabled: !this.item.editable}],
        paramId: [{value: this.getValue('paramId', 'TIPO_PARAMETRO'), disabled: !this.item.editable}],
        paramName: [{value: this.getValue('paramName', 'TIPO_PARAMETRO'), disabled: !this.item.editable}],
        paramValue: [{value: this.getValue('paramValue', 'TIPO_PARAMETRO'), disabled: !this.item.editable}],
        paramUMedida: [{value: this.getValue('paramUMedida', 'TIPO_PARAMETRO'), disabled: !this.item.editable}],
      });    
      this.filterParamId.init(this.fields, this.form.get('paramId'));    
      this.filterParamName.init(this.fields, this.form.get('paramName'));    
      this.filterParamValue.init(this.fields, this.form.get('paramValue'));    
      this.filterParamUMedida.init(this.fields, this.form.get('paramUMedida'));    
      }
    else if (value.codigo == 'TIPO_COORDENADA'){
      this.form = this.fb.group({
        tipoValidacion: [{value: this.getItem('codigoTipoValidacion', 'codigo', 'tiposDeValidaciones'), disabled: !this.item.editable}],
        tipoError: [{value: this.getItem('codigoTipoError', 'codigo', 'TIPOS_DE_ERRORES'), disabled: !this.item.editable}],
        latitud: [{value: this.getValue('latitud', 'TIPO_COORDENADA'), disabled: !this.item.editable}],
        longitud: [{value: this.getValue('longitud', 'TIPO_COORDENADA'), disabled: !this.item.editable}]
      });    
      this.filterLongitud.init(this.fields, this.form.get('longitud'));    
      this.filterLatitud.init(this.fields, this.form.get('latitud'));    

    }
    else{
      this.form = this.fb.group({
        tipoValidacion: [{value: this.getItem('codigoTipoValidacion', 'codigo', 'tiposDeValidaciones'), disabled: !this.item.editable}],
        tipoError: [{value: this.getItem('codigoTipoError', 'codigo', 'TIPOS_DE_ERRORES'), disabled: !this.item.editable}]
      });    

    }
    this.form.get('tipoValidacion').setValue(value);
    this.form.get('tipoError').setValue(tipoError);
    this.tipoValidacionSelected = value.codigo;

  }
  isFormValid(){
    if (!this.form.valid){
      return false;
    }
    let value:any = this.form.get('tipoValidacion').value;
    if (value.codigo == 'TIPO_NUMBER' || value.codigo == 'NOT_NULL'){
      return this.additionalData != undefined && this.additionalData.length > 0;
    }
    return true;
  }
  save(){
    let value:any = this.form.get('tipoValidacion').value;
    let error:any = this.form.get('tipoError').value;
    this.item.codigoTipoValidacion = value.codigo;
    this.item.tipoValidacion = value.descripcion;
    if (error != null){
      this.item.codigoTipoError = error.codigo;
      this.item.tipoError = error.descripcion;
    }
    if (this.item.codigoTipoValidacion == 'TIPO_PARAMETRO'){
      this.additionalData = {paramId: this.form.get('paramId').value.codigo
                          , paramName: this.form.get('paramName').value.codigo
                          , paramValue: this.form.get('paramValue').value.codigo
                          , paramUMedida: this.form.get('paramUMedida').value.codigo};
    }
    else if (this.item.codigoTipoValidacion == 'TIPO_COORDENADA'){
      this.additionalData = {latitud: this.form.get('latitud').value.codigo
                           , longitud: this.form.get('longitud').value.codigo};
    }
    this.item.datosAdicionales = JSON.stringify(this.additionalData);
    this.dialogRef.close(this.item);
  }
}
