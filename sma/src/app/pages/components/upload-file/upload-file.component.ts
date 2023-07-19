import { MessageBox, MessageBoxType } from './../../message-box/message.box';
import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { global } from 'src/globals/global';

@Component({
  selector: 'darta-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadFileComponent implements OnInit {
  app:any = global;
  files: any[] = [];
  currentFile: any;
  
  @Output() fileUploaded:EventEmitter<any> = new EventEmitter<any>();
  @Output() delete:EventEmitter<any> = new EventEmitter<any>();
  @Input() msgArrastreYSuelte:String = this.app.screen.Arrastre_y_suelte_el_archivo;
  @Input() fileType:String = 'xlsx';
  @Input() additionalData:String;
  @Input() showDeleteFile:boolean = true;

  @ViewChild('fileDropRef') fileDrop: ElementRef;
  constructor(private baseService: BaseService,
    private messageBox: MessageBox) { }

  ngOnInit() {
  }


  upload(): void {
    const file: File | null = this.files[0];
    if (file) {
      this.currentFile = file;

      if (this.additionalData){
        this.currentFile['additionalData'] = this.additionalData;
      }
      this.baseService.uploadFile(this.currentFile).subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
            this.currentFile.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['Se_ha_subido_el_archivo_con_exito']);
            file['body'] = event['body'];
            this.fileUploaded.emit(file);
          }
        },
        (err: any) => {
          console.log(err);

          if (err.error && err.error.message) {

            this.messageBox.showMessageBox(MessageBoxType.Success, err.error.message);
          } else {
            this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['No_fue_posible_cargar_el_archivo']);
          }
          this.currentFile = undefined;
        });
    }
  
}

/**
   * on file drop handler
   */
 onFileDropped($event) {
  this.prepareFilesList($event);
}

/**
 * handle file from browsing
 */
fileBrowseHandler(files) {
  this.prepareFilesList(files);
}

/**
 * Delete file from files list
 * @param index (File index)
 */
deleteFile(index: number) {
  const file:File = this.files[index];
  this.files.splice(index, 1);
  this.delete.emit(file);
  //JMC:revisar cuando sea multiple
  this.fileDrop.nativeElement.value = "";
}

/**
 * Convert Files list to normal array list
 * @param files (Files List)
 */
prepareFilesList(files: Array<any>) {
  for (const item of files) {
    var index = item.name.lastIndexOf('.');
    var val:boolean;
    if (index > 0){
        val = this.fileType == item.name.slice(index + 1);
    }
    else {
        val = false;
    }
        
    if (!val){
        this.messageBox.showMessageBox(MessageBoxType.Error, global.getScreen('Solo_archivos_XXX_son_permitidos', this.fileType));
        return;
    }

    item.progress = 0;
    this.files = [];
    this.files.push(item);
  }
  this.upload();
}

/**
 * format bytes
 * @param bytes (File size in bytes)
 * @param decimals (Decimals point)
 */
formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}  
}
