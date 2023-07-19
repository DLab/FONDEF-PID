import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { FurySharedModule } from './../../../@fury/fury-shared.module';
import { MaterialModule } from './../../../@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrosPorEstacionComponent } from './filtros-por-estacion.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { NgSelectModule } from '@ng-select/ng-select';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgSelectModule,

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory
    })


  ],
  declarations: [FiltrosPorEstacionComponent],
  exports: [FiltrosPorEstacionComponent],
  entryComponents:[FiltrosPorEstacionComponent]
})
export class FiltrosPorEstacionModule { }
