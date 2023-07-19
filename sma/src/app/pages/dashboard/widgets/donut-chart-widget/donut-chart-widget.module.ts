import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuryCardModule } from '../../../../../@fury/shared/card/card.module';
import { LoadingOverlayModule } from '../../../../../@fury/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@fury/shared/material-components.module';
import { DonutChartWidgetComponent } from './donut-chart-widget.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    FuryCardModule,
    LoadingOverlayModule,
    ChartsModule,
  ],
  declarations: [DonutChartWidgetComponent],
  exports: [DonutChartWidgetComponent]
})
export class DonutChartWidgetModule {
}
