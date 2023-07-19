import { clone } from 'lodash-es';
import { DownloadFileProperties } from './../mantenedor-base.component';
import { ActionCellComponent } from './../../components/action-cell/action-cell.component';
import { Invoker } from './../../../utils/invoker';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { Component, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MessageBox, MessageBoxType } from '../../message-box/message.box';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { global } from 'src/globals/global';
import { filter } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { hasPrivilege } from 'src/app/utils/privileges';


@Component({
  selector: 'darta-list-mantenedor',
  templateUrl: './list-mantenedor.component.html',
  styleUrls: ['./list-mantenedor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListMantenedorComponent implements OnInit, AfterViewInit {
  app = global;
  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<any[]> = this.subject$.asObservable();

  data: any[] = [];
  hsArray:any;
  pageSize = 10;
  dataSource: MatTableDataSource<any> | null;
  hasAddNewItem:boolean = true;
  hasAccion:boolean;
  hasExport:boolean;
  hasActivate:boolean;
  hasEliminate:boolean;
  hasRecods:boolean = false;
  lastSearchParams:any = {};
  lastSearchParamsInvoker:any;
  getDataAnularFunction:any;
  panelClass:string;

  addInvoker:Invoker = new Invoker(this, 'addItem');
  editInvoker:Invoker = new Invoker(this, 'editItem');
  copyInvoker:Invoker = new Invoker(this, 'copyItem');
  deleteInvoker:Invoker = new Invoker(this, 'deleteItem');
  viewInvoker:Invoker = new Invoker(this, 'viewItem');
  desactivarInvoker:Invoker = new Invoker(this, 'desactivarItem');
  hasFilter:boolean;
  searchResult:any[];

  private eliminarFunction:string;
  private consultaDetalleFunction:string;
  private generaNuevoIdFunction:string;
  private semillaNuevoId:string;
  private anularFunction:string;
  private consultaMasivaFunction:string;
  private eliminarMasivoFunction:string;
  private activarMasivoFunction:string;
  private newItem:any;
  private processRow:any;
  private editItemDialog:ComponentType<any>;
  private multiplesParametros:any;
  private paramsConsultaMasiva:any;
  private getParametersBase:Invoker;
  private _findFilter:any;
  private exportTitle:string;
  private downloadFileProperties:DownloadFileProperties;

  @Input() title:string;
  @Input() columns: ListColumn[];
  @Input() consultaParametrosEvent:EventEmitter<any> = new EventEmitter();
  @Input() parent:any;
  @Input() searchAfterSave:boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(ActionCellComponent, { static: true }) cell: ActionCellComponent;

  constructor(private baseService: BaseService,
    private messageBox: MessageBox,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.hasAddNewItem = hasPrivilege('Agregar');
    if (this.multiplesParametros){
      this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe(result=>{
        this.hsArray = result;
        if (this.parent){
          this.parent["hsArray"] = result;
        }
        this.consultaParametrosEvent.emit(result);
        if (!this.hasFilter){
          this.searchWithoutParameters();
        }
      });
    }
    else{
      if (!this.hasFilter){
        this.searchWithoutParameters();
      }
    }
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      var arr:string[] = filter.split(' ');
      for(var j in arr){
        if (!this.isFilterOk(data, arr[j])){
          return false;
        }
      }
      return true;
    };

    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((item) => {
      this.data = item;
      this.dataSource.data = item;
      this.hasRecods = item.length > 0;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  isFilterOk(data:any, _filter:string){
    for(var i in this.columns){
      var col:ListColumn = this.columns[i];
      var o:any = data[col.property];
      if (o != null && o.toString().toLowerCase().indexOf(_filter) != -1){
        return true;
      }
    }
    return false;
  }
  public initialize(hasFilter:boolean
                , title:string
                , eliminarFunction:string
                , consultaDetalleFunction:string
                , generaNuevoIdFunction:string
                , semillaNuevoId:string
                , anularFunction:string
                , consultaMasivaFunction:string
                , eliminarMasivoFunction:string
                , activarMasivoFunction:string
                , newItem:any
                , processRow:any
                , editItemDialog:ComponentType<any>
                , columns: ListColumn[]
                , multiplesParametros:any
                , paramsConsultaMasiva:any
                , getParametersBase:Invoker
                , findFilter:any
                , hasAccion:boolean
                , hasExport:boolean
                , hasActivate:boolean
                , hasEliminate:boolean
                , exportTitle:string
                , downloadFileProperties:DownloadFileProperties){

      this.hasFilter = hasFilter;
      this.title = title;
      this.eliminarFunction = eliminarFunction;
      this.consultaDetalleFunction = consultaDetalleFunction;
      this.generaNuevoIdFunction = generaNuevoIdFunction;
      this.semillaNuevoId = semillaNuevoId;
      this.anularFunction = anularFunction;
      this.consultaMasivaFunction = consultaMasivaFunction;
      this.eliminarMasivoFunction = eliminarMasivoFunction;
      this.activarMasivoFunction = activarMasivoFunction;
      this.newItem = newItem;
      this.processRow = processRow;
      this.editItemDialog = editItemDialog;
      this.columns = columns;
      this.multiplesParametros = multiplesParametros;
      this.paramsConsultaMasiva = paramsConsultaMasiva;
      this.getParametersBase = getParametersBase;
      this._findFilter = findFilter;
      this.hasAccion = hasAccion == undefined || hasAccion;
      this.hasExport = hasExport;
      this.hasActivate = hasActivate;
      this.hasEliminate = hasEliminate;
      this.exportTitle = exportTitle;
      this.downloadFileProperties = downloadFileProperties;

      if (!this.hasAccion){
        let index:number = columns.findIndex((col:ListColumn)=>col.property == 'accion');
        if (index != -1){
          columns.splice(index, 1);
        }
      }
  }
  searchWithoutParameters(){
      this.getConsultaMasiva().subscribe((res: any[]) => this.processConsultaMasiva(res));
  }

  search(params:any){
    this.lastSearchParams = params;
    if (this.getParametersBase)
    {
      let _params = this.getParametersBase.invokeFunction();
      for(var e in params){
        _params[e] = params[e];
      }
      params = _params;
    }
    for(var e in params){
      if (params[e] === ''){
        params[e] = null;
      }

    }
    this.lastSearchParamsInvoker = params;
    return this.baseService[this.consultaMasivaFunction](params).subscribe((res: any[]) => this.processConsultaMasiva(res));
  }
  clearResultData(){
    if (this.searchResult && this.searchResult.length > 0){
      this.searchResult = null;
      this.subject$.next([]);
    }

  }
  processConsultaMasiva(res:any[]):void{
    res.forEach(a=>{
      if (this.processRow){
        this.processRow(a, this.hsArray);
      }else{
        a['timestamp'] = formatDate(a['timestamp'], 'yyyy/MM/dd HH:mm:ss', global.currentLocale)
      }
    });
    this.searchResult = res;
    this.subject$.next(res);
  }

  lastSearch(){
    if (this.hasFilter){
      this.search(this.lastSearchParams);
    }else{
      return this.searchWithoutParameters();
    }
  }
  getConsultaMasiva():Observable<Object>{
    if (this.paramsConsultaMasiva){
      return this.baseService[this.consultaMasivaFunction](this.paramsConsultaMasiva);
    }else{
      return this.baseService[this.consultaMasivaFunction]();
    }

  }
  onFilterChange(value:string) {

    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  hasCommand(action:string, row:any):boolean
  {
    return action !== 'Agregar';
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  getNewItem():any{
    let item = this.newItem();
    item.hsArray = this.hsArray;
    item.searchResult = this.searchResult;
    return item;
  }

  addItem(){
    if (this.generaNuevoIdFunction){
      this.baseService[this.generaNuevoIdFunction]({semilla: this.semillaNuevoId}).subscribe(resp=>{
        let data:any = this.getNewItem();
        data.semilla = resp;
        this._addItem(data);
      });
    }
    else{
      this._addItem(this.getNewItem());
    }
  }
  _addItem(_data:any){
    this.dialog.open(this.editItemDialog, {
      data: {data: _data, parent: this.parent},
    }).afterClosed().subscribe(newData => {
        if(newData != undefined && newData != true){
          if (this.searchAfterSave){
            this.lastSearch();
          }
          else{
            this.addItemGrid(newData);
          }
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_ingresado_con_exito']);
        }
    });

  }
  editItem(data:any){
    this._editItem(data, true, false);
  }
  viewItem(data:any){
    this._editItem(data, false, false);
  }
  copyItem(data:any){
    this._editItem(data, false, true);
  }
  _editItem(data:any, edit:boolean, copy:boolean){
    if (this.consultaDetalleFunction)
    {
      delete data.hsArray;
      delete data.searchResult;
      this.baseService[this.consultaDetalleFunction](data).subscribe(resp=>{
        data.details = resp;
        this.showEditItem(data, edit, copy);
      });
      return;
    }
    this.showEditItem(data, edit, copy);
  }
  showEditItem(data:any, edit:boolean, copy:boolean){
    data.isNew = copy;
    data.editable = copy || edit;
    data.isCopy = copy;
    if (copy){
      data = clone(data);
      data.codigo = null;
      data.id = null;
    }

    data.hsArray = this.hsArray;
    data.searchResult = this.searchResult;
    this.dialog.open(this.editItemDialog, {
      data: {data: data, parent: this.parent},
      panelClass: this.panelClass
    }).afterClosed().subscribe(result => {
      if (edit && result != undefined && result != true){
        this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_modificado_con_exito']);
        if (this.searchAfterSave){
          this.lastSearch();
        }
        else{
          if (!result.isNew && (result.newCorrelativo == undefined || !result.newCorrelativo)){
            for(var e in result){
              data[e] = result[e];
            }
          }
          else{
            this.addItemGrid(result);
          }
        }
      }
    });
  }
  getDataAnular(data:any):any{
    if (this.getDataAnularFunction){
      return this.getDataAnularFunction(data);
    }
    return data;
  }
  desactivarItem(data:any):void{
    this.messageBox.showMessageBox(MessageBoxType.Question, global.screen['Desea_anular_el_registro_de_forma_permanente']).subscribe(value=>{
      if (value === 'SI'){
        delete data.hsArray;
        delete data.searchResult;
        data.isNew = false;
        data.codigoEstado = 'ANUL';
        data.isNew = false;
        this.baseService[this.anularFunction](this.getDataAnular(data)).subscribe(resp=>{
          if (this)
          this.lastSearch();
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_anulado_con_exito']);
        });
      }
    });
  }
  deleteItem(data:any):void{
    this.messageBox.showMessageBox(MessageBoxType.Question, global.screen['Desea_eliminar_el_registro_definitivamente']).subscribe(value=>{
      if (value === 'SI'){
        delete data.hsArray;
        delete data.searchResult;
        this.baseService[this.eliminarFunction](data).subscribe(resp=>{
          this.deleteItemGrid(data);
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registro_eliminado_con_exito']);
        });
      }
    });
  }
  masiveDelete():void{
    this.messageBox.showMessageBox(MessageBoxType.Question, global.screen['Desea_eliminar_los_registros_seleccionados_definitivamente']).subscribe(value=>{
      if (value === 'SI'){
        this.baseService[this.eliminarMasivoFunction](this.lastSearchParamsInvoker).subscribe(resp=>{
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registros_eliminados_con_exito']);
          this.lastSearch();
        });
      }
    });
  }
  masiveActivate():void{
    this.messageBox.showMessageBox(MessageBoxType.Question, global.screen['Desea_activar_los_registros_seleccionados']).subscribe(value=>{
      if (value === 'SI'){
        this.baseService[this.activarMasivoFunction](this.lastSearchParamsInvoker).subscribe(resp=>{
          this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Registros_activados_con_exito']);
          this.lastSearch();
        });
      }
    });
  }
  addItemGrid(item:any):void{
    this.data.unshift(item);
    this.subject$.next(this.data);
  }
  deleteItemGrid(item:any):void{
    this.data.splice(this.data.findIndex((existing) => this.findFilter(existing, item)), 1);
    this.subject$.next(this.data);
  }
  findFilter(findItem:any, item:any):boolean{
    if (this._findFilter)
    {
      return this._findFilter(findItem, item);
    }
    return findItem === item;
  }

  download(){
    var cols = [];
    this.columns.forEach((col:ListColumn)=>{
      if (col.property != 'accion'){
        cols.push({name: col.property, title: col.name});
      }
    });
    let params:any = {title: this.exportTitle, rows: this.data, cols: cols, addHiddenColumns: true, writeTitle: true};
    let fileName:string = null;
    let contentType:string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    let methodName:string = 'exportToFile';
    if (this.downloadFileProperties)
    {
      if (this.downloadFileProperties.additionalData){
        for(var prop in this.downloadFileProperties.additionalData){
          params[prop] = this.downloadFileProperties.additionalData[prop];
        };
      }
      if (this.downloadFileProperties.fileName){
        fileName = this.downloadFileProperties.fileName;
      }
      if (this.downloadFileProperties.contentType){
        contentType = this.downloadFileProperties.contentType;
      }
      if (this.downloadFileProperties.downloadMethodName != null){
        methodName = this.downloadFileProperties.downloadMethodName;
      }
    }
    if (fileName == null){
      fileName = this.exportTitle + '_' + formatDate(new Date(), 'yyyy/MM/dd/HH:mm:ss', global.currentLocale)+ '.xlsx';
    }
    let dialogRef = null;
    if (this.downloadFileProperties.additionalData.msgWaitDownloadFile != null){
      dialogRef = this.messageBox.showWaitMessageBox(global.screen[this.downloadFileProperties.additionalData.msgWaitDownloadFile]);
    }
    this.baseService[methodName](params).subscribe((file:any)=>{
      const blob = new Blob([file], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =  fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      if (dialogRef){
        dialogRef.close();
      }
      this.messageBox.showMessageBox(MessageBoxType.Success, this.app.screen['Se_ha_generado_el_archivo_con_exito']);
    });
  }
}
