import { Filterer } from './filterer';
import { Component, OnInit, ViewContainerRef, ViewChild, Input, ComponentRef, EventEmitter, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { global } from 'src/globals/global';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'darta-filtro-mantenedor',
  templateUrl: './filtro-mantenedor.component.html',
  styleUrls: ['./filtro-mantenedor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FiltroMantenedorComponent implements OnInit, OnDestroy, AfterViewInit {

  app:any = global;
  filterOpenState:boolean = true;
  searchEvent:EventEmitter<any> = new EventEmitter();
  filterComponent:Filterer;

  @Input() filterComponentClass:any;
  @Input() parent:any;

  @ViewChild("filtros", { read: ViewContainerRef, static: true }) filtrosView: ViewContainerRef;

  private initOk:boolean = false;
  constructor() { }

  ngOnInit() {

    let componentRef: ComponentRef<Filterer> = this.filtrosView.createComponent(this.filterComponentClass);
    this.filterComponent = componentRef.instance;
    this.filterComponent.setParent(this.parent);
    this.filtrosView.insert(componentRef.hostView);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initOk = true;
    });

  }
  ngOnDestroy(): void {
    this.filtrosView.detach(0);
  }
  setArrays(hsArrays:any){
    this.filterComponent.setArrays(hsArrays);
  }
  search():void
  {
    this.searchEvent.emit(this.filterComponent.getParameters());
  }
  isValid(){
    return this.initOk && (this.filterComponent['isValid'] == undefined || this.filterComponent['isValid']);
  }
}
