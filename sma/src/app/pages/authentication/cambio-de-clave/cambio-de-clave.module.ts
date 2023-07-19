import { FurySharedModule } from './../../../../@fury/fury-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambioDeClaveComponent } from './cambio-de-clave.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , MaterialModule
    , FurySharedModule
  ],
  declarations: [CambioDeClaveComponent],
  exports:[CambioDeClaveComponent]
})
export class CambioDeClaveModule { }
