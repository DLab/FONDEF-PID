import { MatTableDataSource } from '@angular/material/table';
import { BaseService } from 'src/app/base.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { BaseEditComponent } from 'src/app/pages/util/base-edit-component';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { global } from 'src/globals/global';

@Component({
  selector: 'darta-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesEditComponent extends BaseEditComponent implements OnInit {

  form: FormGroup;
  funciones:any[];
  dataSource: MatTableDataSource<any> | null;
  columns: ListColumn[] = [
    { name: global.screen['Id'], property: 'id', visible: true, isModelProperty: true,  },
    { name: global.screen['Acciones'], property: 'acciones', visible: true, isModelProperty: true }
  ] as ListColumn[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
            private dialogRef: MatDialogRef<RolesEditComponent>,
            private fb: FormBuilder,
            private baseService: BaseService) {

      super(data);

  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.funciones = this.item.hsArray['FUNCIONES'];
    this.dataSource.data = this.funciones;
    if (!this.item.isNew){
      var details:any = this.item.details.accionesxFuncion;
      for(var f in this.funciones){
        var funcion:any = this.funciones[f];
        funcion.selected = details[funcion.id] != undefined;
        var acciones = funcion.acciones;
        for(var a in acciones){
            var accion = acciones[a];
            accion.selected = funcion.selected && details[funcion.id][accion.idAccion] != undefined;
        }
      }
    }
    this.form = this.fb.group({
      id: [{value: this.item.id, disabled: true}],
      descripcion: [{value: this.item.descripcion, disabled: !this.item.editable}],
    });
  }

  save() {
    let value:any = {};
    for(var e in this.form.value){
      value[e] = this.form.value[e];
    }
    this.funciones.forEach(x=>{
      x.selected = x.selected || false;
      x.acciones.forEach(a => {
        x.selected = x.selected || false;
      });
    });
    value.id = value.id || this.item.id;
    value.isNew = this.item.isNew;
    value.funciones = this.funciones;
    this.baseService.guardarRol(value).subscribe((result:any)=>{
      value.id = result.id;
      if (value.id == global.datosUsuario.user.idRol){
        let arr:any[] = [];
      }
      this.dialogRef.close(value);
    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  onFilterChange(value:string) {

    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
  changeFunction(f:any)
  {
      if (!f.selected){
          for(var a in f.acciones){
              f.acciones[a].selected = false;
          }
      }
      else{
          for(var a in f.acciones){
              f.acciones[a].selected = f.id == 28 || f.id== 29 || f.id== 30 || f.id== 32 || f.id== 33 || f.acciones[a].idAccion == 1;
          }
      }

  }


}
