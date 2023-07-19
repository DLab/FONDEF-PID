import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpCalculoComponent } from './exp-calculo.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { TabListModule } from '../tab-list/tab-list.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { FocusFormatModule } from 'src/app/utils/focus-format/focus-formet.module';
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
    , ReactiveFormsModule
    , FormsModule
  ],
  declarations: [ExpCalculoComponent],
  exports: [ExpCalculoComponent],
  entryComponents:[ExpCalculoComponent]

})
export class ExpCalculoModule { }
