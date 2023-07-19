import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarClienteComponent } from './buscar-cliente.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { RutFormatModule } from 'src/app/utils/rut-format/rut-format.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule
    , MaterialModule
    , RutFormatModule
    , ReactiveFormsModule
    , FormsModule
  ],
  declarations: [BuscarClienteComponent],
  exports: [BuscarClienteComponent],
  entryComponents:[BuscarClienteComponent]  
})
export class BuscarClienteModule { }
