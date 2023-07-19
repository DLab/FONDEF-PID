import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { defaultChartOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-defaults';
import { SalesSummaryWidgetOptions } from './sales-summary-widget-options.interface';

@Component({
  selector: 'fury-sales-summary-widget',
  templateUrl: './sales-summary-widget.component.html',
  styleUrls: ['./sales-summary-widget.component.scss']
})
export class SalesSummaryWidgetComponent {

  @Input() data: ChartData;
  @Input() options: SalesSummaryWidgetOptions;
  @Input() chartOptions: ChartOptions = defaultsDeep({
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }, defaultChartOptions);

  isLoading: boolean;

  constructor() {
  }

  reload() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
