import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { global } from 'src/globals/global';
import { TabItemList } from '../tab-list.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'darta-tab-item-list',
  templateUrl: './tab-item-list.component.html',
  styleUrls: ['./tab-item-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabItemListComponent implements OnInit, AfterViewInit {

  app:any = global;
  filterList:any[];

  @Input() itemList:TabItemList;
  @Output() itemSelected:EventEmitter<any> = new EventEmitter();

  @ViewChild('filter') filter: ElementRef;
  constructor() { }

  ngOnInit() {
    this.filterList = this.itemList.items;
  }

  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup').pipe(
      distinctUntilChanged(),
      debounceTime(150)
    ).subscribe(() => {
      this.onFilterChange(this.filter.nativeElement.value);
    });
  }
  onFilterChange(value:string) {
    if (value == '')
    {
      this.filterList = this.itemList.items;
      return;
    }
    value = value.trim().toLowerCase();
    this.filterList = this.itemList.items.filter((item:any)=> item.descripcion.toLowerCase().indexOf(value) != -1);
  }  
  selectedItem(item:any){
    this.itemSelected.emit(item);
  }


}
