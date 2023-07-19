import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { TabListModule } from '../tab-list/tab-list.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { FocusFormatModule } from 'src/app/utils/focus-format/focus-formet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RutFormatModule } from 'src/app/utils/rut-format/rut-format.module';
import { DateFormatModule } from 'src/app/utils/date-format/date-format.module';
import { ExpGrupoComponent } from './exp-grupo.component';

@NgModule({
  imports: [
    CommonModule
    , MaterialModule
    , FurySharedModule
    , TabListModule
    , ListModule
    , NgSelectModule
    , NumberFormatModule
    , FocusFormatModule
    , RutFormatModule
    , ReactiveFormsModule
    , FormsModule
    , DateFormatModule

  ],
  declarations: [ExpGrupoComponent],
  exports: [ExpGrupoComponent],
  entryComponents:[ExpGrupoComponent]

})
export class ExpGrupoModule { }
