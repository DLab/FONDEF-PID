import { global } from 'src/globals/global';
import { Component, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { hasPrivilege } from 'src/app/utils/privileges';
import { Invoker } from 'src/app/utils/invoker';


@Component({
  selector: 'darta-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActionCellComponent  implements OnInit {

  gl:any = global;

  @Input() cell_value: string;
  @Input() row_data: any;
  @Input() column: any;

  @Input() copy:Invoker;
  @Input() edit:Invoker;
  @Input() delete:Invoker;
  @Input() view:Invoker;
  @Input() desactivar:Invoker;
  @Input() add:Invoker;

  visible:boolean;


  constructor() { }

  ngOnInit() {
    this.visible = true;
  }

  hasCommand(action:string, row:any):boolean {

    if (!hasPrivilege(action))
    {
      return false;
    }
    if (global.currentComponent && global.currentComponent.hasCommand){
      return global.currentComponent.hasCommand(action, row);
    }
    if (action === 'Copiar'){
      return true;
    }
    if (row.codigoEstado == undefined || row.codigoEstado == 'INGR'){
      return action === 'Visualizar' || action === 'Procesar' || action === 'Editar' || action === 'Eliminar';
    }
    else if (row.codigoEstado != 'ANUL'){
      if (row.correlativo != undefined && row.maxCorrelativo != undefined && row.correlativo == row.maxCorrelativo){
        return action === 'Visualizar' || action === 'Editar' || action === 'Desactivar';
      }
      return action === 'Visualizar' || action === 'Desactivar';
    }
    return action === 'Visualizar';
  }
  _copy(data:any){
    if (global.currentComponent && global.currentComponent.copyItem){
      global.currentComponent.copyItem(data);
    }
    else if (this.copy){
      this.copy.invokeMethod(data);
    }
  }

  _edit(data:any){
    if (global.currentComponent && global.currentComponent.editItem){
      global.currentComponent.editItem(data);
    }
    else if (this.edit){
      this.edit.invokeMethod(data);
    }
  }
  _delete(data:any){
    if (global.currentComponent && global.currentComponent.deleteItem){
      global.currentComponent.deleteItem(data);
    }
    else if (this.delete){
      this.delete.invokeMethod(data);
    }
  }
  _add(data:any){
    if (global.currentComponent && global.currentComponent.addItem){
      global.currentComponent.addItem(data);
    }
    else if (this.add){
      this.add.invokeMethod(data);
    }
  }
  _view(data:any){
    if (global.currentComponent && global.currentComponent.viewItem){
      global.currentComponent.viewItem(data);
    }
    else if (this.view){
      this.view.invokeMethod(data);
    }
  }
  _ejecutar(data:any){
    if (global.currentComponent && global.currentComponent.ejecutar){
      global.currentComponent.ejecutar(data);
    }
  }
  _desactivar(data:any){
    if (global.currentComponent && global.currentComponent.desactivar){
      global.currentComponent.desactivar(data);
    }
    else if (this.desactivar){
      this.desactivar.invokeMethod(data);
    }
  }
}
