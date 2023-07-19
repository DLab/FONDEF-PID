import { WaitMessageComponent } from './../message-box/wait-message/wait-message.component';
import { catchError } from 'rxjs/operators';
import { CargaMasivaType } from './../../../globals/global';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { GetParameters } from './get-parameters';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { global } from 'src/globals/global';
import { UploadFileComponent } from 'src/app/pages/components/upload-file/upload-file.component';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { MessageBox, MessageBoxType } from '../message-box/message.box';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'darta-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CargaMasivaComponent implements OnInit, AfterViewInit, OnDestroy {

  app:any = global;
  currentFile:File = null;
  pageSize = 10;
  title:string;
  hasExport:boolean = false;
  filterClassName:ComponentType<GetParameters>;
  filterComponent:GetParameters;
  enabledExport: boolean = false;
  numRowsLoaded:number;
  additionalData:string;
  fileType:string = 'xlsx';
  fileName:string;
  asynchronous:boolean;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: ListColumn[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(UploadFileComponent, { static: true }) uploadFile: UploadFileComponent;
  @ViewChild("filterContainer", { read: ViewContainerRef, static: true }) containerView: ViewContainerRef;

  private processData:any;
  private processMethodName:string;
  private downloadMethodName:string;
  private waitCargaMasivaMethodName:string;
  private waitCargaMasivaMsg:string;
  private waitCargaMasivaOkMsg:string;
  private loadNumRegistrosAProcesar:string;
  private msgWaitProcess:string;
  private msgResultadoCargaMasiva:string;
  private variableProcesoConErrores:string;
  private variableMsgErrores:string;
  private variablesMsgResultadoCarga:string[];

  private downloadFileName:any;
  private cargaMasivaType: CargaMasivaType;

  constructor(private baseService: BaseService
            , private messageBox: MessageBox
            , actRoute: ActivatedRoute
            , private dialog: MatDialog) {
      this.title = actRoute.snapshot.data.title;
      this.columns = actRoute.snapshot.data.columns as ListColumn[];
      this.processMethodName = actRoute.snapshot.data.processMethodName;
      this.hasExport = actRoute.snapshot.data.hasExport || false;
      this.waitCargaMasivaMethodName = actRoute.snapshot.data.waitCargaMasivaMethodName;
      this.downloadMethodName = actRoute.snapshot.data.downloadMethodName;
      this.downloadFileName = actRoute.snapshot.data.downloadFileName;
      this.waitCargaMasivaMsg = actRoute.snapshot.data.waitCargaMasivaMsg;
      this.waitCargaMasivaOkMsg = actRoute.snapshot.data.waitCargaMasivaOkMsg;
      this.filterClassName = actRoute.snapshot.data.filterClassName;
      this.cargaMasivaType = actRoute.snapshot.data.cargaMasivaType;
      this.loadNumRegistrosAProcesar = actRoute.snapshot.data.loadNumRegistrosAProcesar;
      this.msgWaitProcess = actRoute.snapshot.data.msgWaitProcess;
      this.msgResultadoCargaMasiva = actRoute.snapshot.data.msgResultadoCargaMasiva;
      this.variablesMsgResultadoCarga = actRoute.snapshot.data.variablesMsgResultadoCarga;
      this.variableProcesoConErrores = actRoute.snapshot.data.variableProcesoConErrores;
      this.variableMsgErrores = actRoute.snapshot.data.variableMsgErrores;
      this.asynchronous = actRoute.snapshot.data.asynchronous;
      if (this.asynchronous === undefined){
        this.asynchronous = false;
      }
      if (actRoute.snapshot.data.uploadFileType){
        this.fileType = actRoute.snapshot.data.uploadFileType;
      }
      this.additionalData = this.fileType === 'xlsx' ? 'readRows:' + this.cargaMasivaType: this.fileType === 'txt' || this.fileType === 'csv' ? 'readRowsTxt:' + this.cargaMasivaType : '';
    }

  ngOnInit() {
    if (this.filterClassName){
      let componetRef: ComponentRef<GetParameters> = this.containerView.createComponent(this.filterClassName);
      this.filterComponent = componetRef.instance;
      this.containerView.insert(componetRef.hostView);
    }

  }
  ngOnDestroy(): void {
    if (this.filterClassName){
      this.containerView.detach(0);
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCargaMasiva(){
    if (this.loadNumRegistrosAProcesar)
    {
      this.messageBox.showMessageBox(MessageBoxType.Question, this.app.getScreen(this.loadNumRegistrosAProcesar, this.numRowsLoaded) ).subscribe(value=>{
        if (value === 'SI'){
          this._loadCargaMasiva();
        }
      });
    }
    else{
      this._loadCargaMasiva();
    }
  }
  _loadCargaMasiva(){

    let params:any = {};
    if (this.filterComponent)
    {
      params = this.filterComponent.getParameters();
    }
    this.dataSource.data = [];
    this.enabledExport = false;
    params.fileName = this.fileName;
    params.datosUsuario = global.datosUsuario;
    let dialogRef = this.messageBox.showWaitMessageBox(global.screen[this.msgWaitProcess]);
    this.baseService[this.processMethodName](params, function(){dialogRef.close();}).subscribe((data:any)=>{
      if (this.asynchronous){
        this.waitProcess(dialogRef, data);
      }
      else{
        this.endProcess(dialogRef, data);
      }

    });
  }
  waitProcess(dialogRef:MatDialogRef<WaitMessageComponent>, data:any){
    let uuid:string = data.uuid;
    this.baseService.waitForProcess({uuid: uuid}, function(){dialogRef.close();}).subscribe((data:any)=>{

      let status:string = data.status;
      if (status === 'OK'){
        this.endProcess(dialogRef, data.result);
      }
      else if (status.startsWith('ERR:')){
        dialogRef.close();
        this.messageBox.showMessageBox(MessageBoxType.Error, global.screen['Proceso_terminado_con_errores'] + '\n' + status.substring(4));
      }
      else{
        setTimeout(() => {
          this.waitProcess(dialogRef, data);
        }, 500);
      }

    });
  }
  endProcess(dialogRef:MatDialogRef<WaitMessageComponent>, data:any){

    dialogRef.close();
    console.log(data)
    this.processData = data;
    if (data.result){
      data.result.forEach((item:any) => {
        item['statusOk'] = item['status'] ? 'OK' : 'NOK';
      });
    }
    let varMsgOk:any[] = [];
    this.variablesMsgResultadoCarga.forEach((variable:string)=>varMsgOk.push(data[variable]));
    this.dataSource.data = data.result;
    let hasError:boolean = false;
    if (this.variableProcesoConErrores)
    {
      hasError = data[this.variableProcesoConErrores];
    }
    if (hasError){
      if (this.variableMsgErrores){
        this.messageBox.showMessageBox(MessageBoxType.Error, data[this.variableMsgErrores]);
      }
      else{
        this.messageBox.showMessageBox(MessageBoxType.Error, global.screen['Proceso_terminado_con_errores']);
      }
      
    }
    else{
      this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['Proceso_de_Carga_Masiva_realizado_con_exito']);
    }


    if (!hasError && this.waitCargaMasivaMethodName){

      dialogRef = this.messageBox.showWaitMessageBox(global.screen[this.waitCargaMasivaMsg]);

      this.baseService[this.waitCargaMasivaMethodName](data).subscribe((_data:any)=>{
        dialogRef.close();
        this.enabledExport = true;
        this.messageBox.showMessageBox(MessageBoxType.Success, global.screen[this.waitCargaMasivaOkMsg]);
        this.messageBox.showMessageBox(MessageBoxType.Ok, global.getScreen(this.msgResultadoCargaMasiva, varMsgOk));

      });
    }
    else if (!hasError){
      this.enabledExport = !hasError;
      this.messageBox.showMessageBox(MessageBoxType.Ok, global.getScreen(this.msgResultadoCargaMasiva, varMsgOk));
    }
  }
  enabledLoadCargaMasiva():boolean{
    if (this.filterComponent && this.filterComponent['isFormOk'] && !this.filterComponent['isFormOk']())
    {
      return false;
    }
    return this.currentFile != null;
  }

  download(){
    this.baseService[this.downloadMethodName](this.processData).subscribe((data:any)=>{
      const blob = data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.downloadFileName.pre + this.processData[this.downloadFileName.param] + this.downloadFileName.ext;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  deleteFile(file:File):void{
    this.currentFile = null;
    this.fileName = null;
  }
  fileUploaded(file:File):void{
    this.currentFile = file;
    this.fileName = file.name;
    this.dataSource.data = [];
    if (file && file['body']){
      this.numRowsLoaded =  parseInt(file['body']['data']);
      this.fileName = file['body']['fileName'];
    }
  }
  get visibleColumns() {
    return this.columns ? this.columns.filter(column => column.visible).map(column => column.property) : [];
  }


  onFilterChange(value:string) {

    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

}
