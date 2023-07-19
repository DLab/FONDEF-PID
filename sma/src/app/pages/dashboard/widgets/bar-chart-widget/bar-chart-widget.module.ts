import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingOverlayModule } from '../../../../../@fury/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@fury/shared/material-components.module';
import { BarChartWidgetComponent } from './bar-chart-widget.component';
import { FuryCardModule } from '../../../../../@fury/shared/card/card.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    LoadingOverlayModule,

    // Chart Widget Style
    FuryCardModule,
    ChartsModule
  ],
  declarations: [BarChartWidgetComponent],
  exports: [BarChartWidgetComponent]
})
export class BarChartWidgetModule {
}
