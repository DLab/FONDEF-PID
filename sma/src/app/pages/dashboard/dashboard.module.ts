import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { AdvancedPieChartWidgetModule } from './widgets/advanced-pie-chart-widget/advanced-pie-chart-widget.module';
import { AudienceOverviewWidgetModule } from './widgets/audience-overview-widget/audience-overview-widget.module';
import { BarChartWidgetModule } from './widgets/bar-chart-widget/bar-chart-widget.module';
import { DonutChartWidgetModule } from './widgets/donut-chart-widget/donut-chart-widget.module';
import { LineChartWidgetModule } from './widgets/line-chart-widget/line-chart-widget.module';
import { MapsWidgetModule } from './widgets/maps-widget/maps-widget.module';
import { MarketWidgetModule } from './widgets/market-widget/market-widget.module';
import { QuickInfoWidgetModule } from './widgets/quick-info-widget/quick-info-widget.module';
import { RealtimeUsersWidgetModule } from './widgets/realtime-users-widget/realtime-users-widget.module';
import { RecentSalesWidgetModule } from './widgets/recent-sales-widget/recent-sales-widget.module';
import { SalesSummaryWidgetModule } from './widgets/sales-summary-widget/sales-summary-widget.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { FurySharedModule } from '../../../@fury/fury-shared.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FurySharedModule,

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
    MarketWidgetModule
  ],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule {
}
