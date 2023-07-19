import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { ListMantenedorComponent } from './list-mantenedor.component';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { ActionCellModule } from '../../components/action-cell/action-cell.module';

@NgModule({
  imports: [
      CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , FurySharedModule
    , ListModule
    , ActionCellModule
  ],
  declarations: [ListMantenedorComponent],
  entryComponents:[ListMantenedorComponent]
})
export class ListMantenedorModule { }
