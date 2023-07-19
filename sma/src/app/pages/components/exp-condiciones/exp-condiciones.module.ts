import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpCondicionesComponent } from './exp-condiciones.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { TabListModule } from '../tab-list/tab-list.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { FocusFormatModule } from 'src/app/utils/focus-format/focus-formet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RutFormatModule } from 'src/app/utils/rut-format/rut-format.module';
import { DateFormatModule } from 'src/app/utils/date-format/date-format.module';

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
  declarations: [ExpCondicionesComponent],
  exports: [ExpCondicionesComponent],
  entryComponents:[ExpCondicionesComponent]
})
export class ExpCondicionesModule { }

