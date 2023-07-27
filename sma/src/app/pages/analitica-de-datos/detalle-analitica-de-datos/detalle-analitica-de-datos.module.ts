import { FiltrosPorEstacionPopupModule } from './../../filtros-por-estacion-popup/filtros-por-estacion-popup.module';
import { AdditionalDataComponent } from './additional-data/additional-data.component';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleAnaliticaDeDatosComponent } from './detalle-analitica-de-datos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMatDatetimePickerModule,
    NumberFormatModule,
    FiltrosPorEstacionPopupModule,


    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  
  ],
  declarations: [DetalleAnaliticaDeDatosComponent, AdditionalDataComponent],
  exports: [DetalleAnaliticaDeDatosComponent],
  entryComponents:[DetalleAnaliticaDeDatosComponent, AdditionalDataComponent]


})
export class DetalleAnaliticaDeDatosModule { }
