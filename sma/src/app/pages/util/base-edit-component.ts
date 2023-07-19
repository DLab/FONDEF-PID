import { BaseComponent } from './base-component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { global } from "src/globals/global";

export class BaseEditComponent extends BaseComponent {

    gl:any = global;
    item:any;
    parent:any;
    hsArray:any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
      super();
      this.item = data.data;
      this.parent = data.parent;
      this.hsArray = this.item.hsArray;
    }
  
    getItem(property:string, codeProperty:string, listName:string, item?: any):any{
      return this._getItem(property, codeProperty, this.hsArray[listName], item);
    }
    _getItem(property:string, codeProperty:string, arr:any[], item?:any):any{
      item = item ? item : this.item;
      if (item[property] && item[property] != null){
        const value:any = item[property];
        return arr.find(o=>o[codeProperty] == value);
      }
      return null;
    }
  }
  