import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuryCardModule } from '../../../../../@fury/shared/card/card.module';
import { LoadingOverlayModule } from '../../../../../@fury/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@fury/shared/material-components.module';
import { SalesSummaryWidgetComponent } from './sales-summary-widget.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    LoadingOverlayModule,
    FuryCardModule,
    ChartsModule
  ],
  declarations: [SalesSummaryWidgetComponent],
  exports: [SalesSummaryWidgetComponent]
})
export class SalesSummaryWidgetModule {
}
