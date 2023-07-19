import { DateFormatModule } from 'src/app/utils/date-format/date-format.module';
import { RutFormatModule } from 'src/app/utils/rut-format/rut-format.module';
import { FocusFormatModule } from 'src/app/utils/focus-format/focus-formet.module';
import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabCondicionesComponent } from './tab-condiciones.component';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { TabListModule } from '../tab-list/tab-list.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  declarations: [TabCondicionesComponent],
  exports: [TabCondicionesComponent],
  entryComponents:[TabCondicionesComponent]
})
export class TabCondicionesModule { }
