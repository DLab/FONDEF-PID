import { DetalleAnaliticaDeDatosModule } from './../analitica-de-datos/detalle-analitica-de-datos/detalle-analitica-de-datos.module';
import { AnaliticaDeDatosModule } from './../analitica-de-datos/analitica-de-datos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from './../../../@fury/fury-shared.module';
import { MaterialModule } from './../../../@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DespliegueTerritorialRoutingModule } from './despliegue-territorial-routing.module';
import { DespliegueTerritorialComponent } from './despliegue-territorial.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    DespliegueTerritorialRoutingModule,
    DetalleAnaliticaDeDatosModule,
    LeafletModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })

  ],
  declarations: [DespliegueTerritorialComponent]
})
export class DespliegueTerritorialModule { }
