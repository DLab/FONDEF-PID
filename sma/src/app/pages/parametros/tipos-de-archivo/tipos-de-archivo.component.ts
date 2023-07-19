import { TiposDeArchivoEditComponent } from './tipos-de-archivo-edit/tipos-de-archivo-edit.component';
import { formatDate } from '@angular/common';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { RolesEditComponent } from '../../administracion/roles/roles-edit/roles-edit.component';
import { ComponentType } from '@angular/cdk/portal';
import { global } from 'src/globals/global';
import { Component, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tipos-de-archivo',
  templateUrl: './tipos-de-archivo.component.html',
  styleUrls: ['./tipos-de-archivo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TiposDeArchivoComponent implements OnInit {
  app:any = global;
  basesDeDatos:any;

  @Output() multiplesParametros:any = {codigoPadre: ['TIPOS_DE_VALIDACIONES', 'TIPOS_DE_ERRORES', 'BASE_DATOS']};
  @Output() editDialog:ComponentType<any> = TiposDeArchivoEditComponent;
  @Output() columns: ListColumn[] = [
    { name: this.app.screen.Codigo, property: 'codigo', visible: true, isModelProperty: true },
    { name: this.app.screen.Descripcion, property: 'descripcion', visible: true, isModelProperty: true },
    { name: this.app.screen.BaseDato, property: 'baseDatos', visible: true, isModelProperty: true },
    { name: this.app.screen.Fecha, property: 'ultModificacion', visible: true, isModelProperty: true },
    { name: this.app.screen.Accion, property: 'accion', visible: true},
  ] as ListColumn[];

  constructor() { }

  ngOnInit() {
  }

  @Output() newItem():any{
    return {isNew:true
      , codigoEstado:'INGR'
      , editable: true
      , usuario: global.user
     };
  }
  @Output() processRow(row:any, hsArray:any):void{
    if (!this.basesDeDatos){
      this.basesDeDatos = {};
      hsArray['BASE_DATOS'].forEach(e => {
        this.basesDeDatos[e.codigo] = e;
      });
    }
    row['baseDatos'] = this.basesDeDatos[row.codigoBaseDatos].descripcion;
    row['ultModificacion'] = formatDate(row['ultModificacion'], 'yyyy/MM/dd HH:mm:ss', global.currentLocale);
  }

}
