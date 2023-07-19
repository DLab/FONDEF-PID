import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { FiltroMantenedorComponent } from './filtro-mantenedor.component';

@NgModule({
  imports: [
    CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , FurySharedModule
  ],
  declarations: [FiltroMantenedorComponent],
  entryComponents:[FiltroMantenedorComponent]
})
export class FiltroMantenedorModule { }
