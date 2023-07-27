import { FiltrosPorEstacionModule } from './../filtros-por-estacion/filtros-por-estacion.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { MaterialModule } from './../../../@fury/shared/material-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyeccionesIaComponent } from './proyecciones-ia.component';
import { ProyeccionesIaRoutingModule } from './proyecciones-ia-routing.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltrosPorEstacionPopupModule } from '../filtros-por-estacion-popup/filtros-por-estacion-popup.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FiltrosPorEstacionModule,
    FiltrosPorEstacionPopupModule,
    ProyeccionesIaRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })

  ],
  exports:[ProyeccionesIaComponent],
  declarations: [ProyeccionesIaComponent]
})
export class ProyeccionesIaModule { }
