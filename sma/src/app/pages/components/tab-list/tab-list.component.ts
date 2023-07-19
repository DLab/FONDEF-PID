import { Component, EventEmitter, Input, OnInit, Output, enableProdMode, ViewEncapsulation } from '@angular/core';
import { global } from 'src/globals/global';

export interface TabItemList{
  name:string;
  items:any[];
}

@Component({
  selector: 'darta-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabListComponent implements OnInit {

  app:any = global;

  @Output() itemSelected:EventEmitter<any> = new EventEmitter();
  @Input() items:TabItemList[];
  constructor() { }

  ngOnInit() {
  }
  
  selectedItem(item:any){
    this.itemSelected.emit(item);
  }

}
