import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { UploadFileModule } from 'src/app/pages/components/upload-file/upload-file.module';
import { CargaMasivaRoutingModule } from './carga-masiva-routing.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { CargaMasivaComponent } from './carga-masiva.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , CargaMasivaRoutingModule
    , FurySharedModule
    , UploadFileModule
    , ListModule
    , NgxMatDatetimePickerModule
  ],
  declarations: [CargaMasivaComponent]
})
export class CargaMasivaModule { }
