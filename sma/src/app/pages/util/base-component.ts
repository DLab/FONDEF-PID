import { hasPrivilege } from 'src/app/utils/privileges';
export class BaseComponent {

    constructor(){

    }
    
    getIdOrValue(value:any){
        if (value && value.id){
          return value.id;
        }
        return value;
    }
    
    getId(value:any):number{
        if (value){
          return value.id;
        }
        return null;
    }
    getIdAsString(value:any):number{
        if (value){
          return typeof value.id == 'string' ? value.id : '' + value.id;
        }
        return null;
    }
    getCodigo(value:any):number{
        if (value){
          return value.codigo;
        }
        return null;
    }
    getDescripcion(value:any):string{
        if (value){
          return value.descripcion;
        }
        return null;
    }
    _hasPrivilege(action:string):boolean{
        return hasPrivilege(action);
    }
  
      
}
