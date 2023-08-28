import { startWith, map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';


export class FilterList{

  public filteredItems: Observable<any[]>;
  private items: any[] = [];
  private control:AbstractControl;

  constructor(){

  }

  init(items:any[], control:AbstractControl):void{
    this.items = items; 
    this.control = control;
    control['filterList'] = this;
    this.filteredItems = this.control.valueChanges.pipe(
      startWith<string | any>(''),
      map(value=> typeof value === 'string' ? value : value == null ? null : value.descripcion),
      map(item => item ? this.filterItem(item) : this.items.slice())
    );
  }

  public displayItem(item:any):string{
    return item && item.descripcion ? item.descripcion : item;
  }


  private filterItem(descripcion: string):any[] {
    return this.items.filter(item =>
      (typeof item === 'string' ? item : item.descripcion).toLowerCase().indexOf(descripcion.toLowerCase()) === 0);
  }
  public getItems():any[]{
    return this.items;
  }

}