import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { ComponentType } from '@angular/cdk/portal';
import { global } from 'src/globals/global';
import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { MantenedorBaseComponent } from '../../mantenedor-base/mantenedor-base.component';

@Component({
  selector: 'darta-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  app:any = global;

  @Output() multiplesParametros:any = {codigoPadre: ['FUNCIONES', 'TIPOS_DE_PRODUCTOS']};
  @Output() editDialog:ComponentType<any> = RolesEditComponent;
  @Output() columns: ListColumn[] = [
    { name: this.app.screen.Id, property: 'id', visible: true, isModelProperty: true },
    { name: this.app.screen.Descripcion, property: 'descripcion', visible: true, isModelProperty: true },
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
    row['idRol'] = row['id'];
  }

}
