import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  imports: [
    CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , FurySharedModule
  ],
  declarations: [UploadFileComponent, DragDropDirective],
  exports:[UploadFileComponent],
  entryComponents:[UploadFileComponent]
})
export class UploadFileModule { }
