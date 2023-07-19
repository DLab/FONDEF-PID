import { ComponentType } from '@angular/cdk/portal';
import { global } from 'src/globals/global';
import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { MantenedorBaseComponent } from '../../mantenedor-base/mantenedor-base.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';

@Component({
  selector: 'darta-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  app:any = global;

  @Output() multiplesParametros:any = {codigoPadre: ['ROLES']};
  @Output() editDialog:ComponentType<any> = UsuariosEditComponent;
  @Output() columns: ListColumn[] = [
    { name: this.app.screen.Id, property: 'id', visible: true, isModelProperty: true },
    { name: this.app.screen.Nombre, property: 'nombre', visible: true, isModelProperty: true },
    { name: this.app.screen.Rol_Asignado, property: 'rol', visible: true, isModelProperty: true },
    { name: this.app.screen.Accion, property: 'accion', visible: true},
  ] as ListColumn[];

  @ViewChild(MantenedorBaseComponent, { static: true }) mantenedor: MantenedorBaseComponent;

  constructor() {
    global.currentComponent = this;
  }

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
    row['rol'] = hsArray['ROLES'].find(rol=> rol.id == row['idRol']).descripcion;
  }

}
