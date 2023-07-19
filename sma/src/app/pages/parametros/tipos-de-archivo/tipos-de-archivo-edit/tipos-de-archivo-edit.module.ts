import { HojaDeDatosComponent } from './hoja-de-datos/hoja-de-datos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TiposDeValidacionesEditComponent } from './hoja-de-datos/tipos-de-validaciones-edit/tipos-de-validaciones-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiposDeArchivoEditComponent } from './tipos-de-archivo-edit.component';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { UploadFileModule } from 'src/app/pages/components/upload-file/upload-file.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,
    UploadFileModule,
    NgSelectModule,
    ListModule,
  ],
  declarations: [TiposDeArchivoEditComponent, TiposDeValidacionesEditComponent, HojaDeDatosComponent],
  exports: [TiposDeArchivoEditComponent],
  entryComponents: [TiposDeArchivoEditComponent]
})
export class TiposDeArchivoEditModule { }
