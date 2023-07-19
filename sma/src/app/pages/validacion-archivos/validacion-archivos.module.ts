import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from './../../../@fury/fury-shared.module';
import { MaterialModule } from './../../../@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidacionArchivosComponent } from './validacion-archivos.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ValidacionArchivosComponent],
  exports: [ValidacionArchivosComponent],
  entryComponents:[ValidacionArchivosComponent]
})
export class ValidacionArchivosModule { }
