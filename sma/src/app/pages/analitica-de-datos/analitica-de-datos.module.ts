import { FiltrosPorEstacionModule } from './../filtros-por-estacion/filtros-por-estacion.module';
import { DetalleAnaliticaDeDatosModule } from './detalle-analitica-de-datos/detalle-analitica-de-datos.module';
import { AnaliticaDeDatosRoutingModule } from './analitica-de-datos-routing.module';
import { MarketWidgetModule } from './../dashboard/widgets/market-widget/market-widget.module';
import { MapsWidgetModule } from './../dashboard/widgets/maps-widget/maps-widget.module';
import { AdvancedPieChartWidgetModule } from './../dashboard/widgets/advanced-pie-chart-widget/advanced-pie-chart-widget.module';
import { RecentSalesWidgetModule } from './../dashboard/widgets/recent-sales-widget/recent-sales-widget.module';
import { QuickInfoWidgetModule } from './../dashboard/widgets/quick-info-widget/quick-info-widget.module';
import { RealtimeUsersWidgetModule } from './../dashboard/widgets/realtime-users-widget/realtime-users-widget.module';
import { AudienceOverviewWidgetModule } from './../dashboard/widgets/audience-overview-widget/audience-overview-widget.module';
import { SalesSummaryWidgetModule } from './../dashboard/widgets/sales-summary-widget/sales-summary-widget.module';
import { DonutChartWidgetModule } from './../dashboard/widgets/donut-chart-widget/donut-chart-widget.module';
import { LineChartWidgetModule } from './../dashboard/widgets/line-chart-widget/line-chart-widget.module';
import { BarChartWidgetModule } from './../dashboard/widgets/bar-chart-widget/bar-chart-widget.module';
import { AnaliticaDeDatosComponent } from './analitica-de-datos.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { FurySharedModule } from '../../../@fury/fury-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FurySharedModule,
    FormsModule,
    ReactiveFormsModule,

    AnaliticaDeDatosRoutingModule,  
    FiltrosPorEstacionModule,
    // Widgets
    BarChartWidgetModule,
    LineChartWidgetModule,
    DonutChartWidgetModule,
    SalesSummaryWidgetModule,
    AudienceOverviewWidgetModule,
    RealtimeUsersWidgetModule,
    QuickInfoWidgetModule,
    RecentSalesWidgetModule,
    AdvancedPieChartWidgetModule,
    MapsWidgetModule,
    MarketWidgetModule,
    DetalleAnaliticaDeDatosModule,

  ],
  declarations: [AnaliticaDeDatosComponent],

})
export class AnaliticaDeDatosModule {
}
