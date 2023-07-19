import { global } from "src/globals/global";

export function hasPrivilege(action:string):boolean
{
  if (global.selectedMenuItem == undefined){
    return false;
  }
  var idAccion =  global.acciones[action];
  var fn = global.accionesxFuncion[global.selectedMenuItem.id];
  return fn != undefined && fn[idAccion] != undefined;
}

export function hasPrivilegeWithoutVersion(action:string, row: any):boolean
{
  return action !== 'Agregar' && action != 'Desactivar' && (action != 'Eliminar' || row.codigoEstado != 'ACTI') && (action != 'Editar' || row.codigoEstado != 'ACTI');
}
