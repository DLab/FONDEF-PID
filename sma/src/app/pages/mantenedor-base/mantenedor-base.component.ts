import { Invoker } from './../../utils/invoker';
import { ListMantenedorComponent } from './list-mantenedor/list-mantenedor.component';
import { FiltroMantenedorComponent } from './filtro-mantenedor/filtro-mantenedor.component';
import { ListColumn } from './../../../@fury/shared/list/list-column.model';
import { Component, OnInit, Input, ViewChild, ViewEncapsulation, ComponentRef, ViewContainerRef, OnDestroy, Optional } from '@angular/core';
import { global } from 'src/globals/global';
import { ComponentType } from '@angular/cdk/portal';

export enum Tipo{
    Mantenedor
  , Consulta
  , Extraccion
  , Gestion
  , Reportes
}

export class DownloadFileProperties{

  constructor(public contentType:string
    , public fileName:string
    , public downloadMethodName:string
    , public additionalData:any){}
}

@Component({
  selector: 'darta-mantenedor-base',
  templateUrl: './mantenedor-base.component.html',
  styleUrls: ['./mantenedor-base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MantenedorBaseComponent implements OnInit, OnDestroy {

  app:any = global;
  filterComponent: FiltroMantenedorComponent;
  listComponent: ListMantenedorComponent;

  @Input() filterComponentClass:any;
  @Input() title:string;
  @Input() eliminarFunction:string;
  @Input() consultaDetalleFunction:string;
  @Input() generaNuevoIdFunction:string;
  @Input() semillaNuevoId:string;
  @Input() anularFunction:string;
  @Input() consultaMasivaFunction:string;
  @Input() eliminarMasivoFunction:string;
  @Input() activarMasivoFunction:string;
  @Input() newItem:any;
  @Input() getParametersBase:Invoker;
  @Input() processRow:any;
  @Input() editItemDialog:ComponentType<any>;
  @Input() columns: ListColumn[];
  @Input() multiplesParametros:any;
  @Input() paramsConsultaMasiva:any;
  @Input() parent:any;
  @Input() findFilter:any;
  @Input() hasAccion:boolean;
  @Input() hasExport:boolean;
  @Input() hasActivate:boolean;
  @Input() hasEliminate:boolean;
  @Input() exportTitle:string;
  @Input() downloadFileProperties:DownloadFileProperties;
  @Input() searchAfterSave:boolean = false;
  @Input() getDataAnularFunction:any;
  @Input() panelClass:string = 'default-panel-class';

  @ViewChild("container", { read: ViewContainerRef, static: true }) containerView: ViewContainerRef;

  constructor() {
  }

  ngOnInit() {

    let componetRef: ComponentRef<ListMantenedorComponent> = this.containerView.createComponent(ListMantenedorComponent);
    this.listComponent = componetRef.instance;
    this.listComponent.parent = this.parent;
    this.listComponent.searchAfterSave = this.searchAfterSave;
    this.listComponent.getDataAnularFunction = this.getDataAnularFunction;
    this.listComponent.panelClass = this.panelClass;

    if (this.filterComponentClass){

      let componetRef: ComponentRef<FiltroMantenedorComponent> = this.containerView.createComponent(FiltroMantenedorComponent);
      this.filterComponent = componetRef.instance;
      this.filterComponent.filterComponentClass = this.filterComponentClass;
      this.filterComponent.parent = this.parent;
      this.filterComponent.searchEvent.subscribe(params=>this.listComponent.search(params));
      this.listComponent.consultaParametrosEvent.subscribe(hsArray=>{
        this.filterComponent.setArrays(hsArray);
      });
      this.containerView.insert(componetRef.hostView);
    }
    this.listComponent.initialize(this.filterComponentClass != null
                                , this.title
                                , this.eliminarFunction
                                , this.consultaDetalleFunction
                                , this.generaNuevoIdFunction
                                , this.semillaNuevoId
                                , this.anularFunction
                                , this.consultaMasivaFunction
                                , this.eliminarMasivoFunction
                                , this.activarMasivoFunction
                                , this.newItem
                                , this.processRow
                                , this.editItemDialog
                                , this.columns
                                , this.multiplesParametros
                                , this.paramsConsultaMasiva
                                , this.getParametersBase
                                , this.findFilter
                                , this.hasAccion
                                , this.hasExport
                                , this.hasActivate
                                , this.hasEliminate
                                , this.exportTitle
                                , this.downloadFileProperties);

    this.containerView.insert(componetRef.hostView);

  }
  ngOnDestroy(): void {
    this.containerView.detach(0);
    if (this.filterComponent){
      this.containerView.detach(0);
    }
  }

  public set hasCommand(newHasCommand:any){
    this.listComponent.hasCommand = newHasCommand;
  }
  public clearResultData(){
    this.listComponent.clearResultData();
  }

}
