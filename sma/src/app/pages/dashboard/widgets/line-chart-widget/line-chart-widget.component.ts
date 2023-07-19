import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { defaultChartOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-defaults';
import { ChartWidgetOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-options.interface';

@Component({
  selector: 'fury-line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss']
})
export class LineChartWidgetComponent {

  @Input() data: ChartData;
  @Input() options: ChartWidgetOptions;
  @Input() chartOptions: ChartOptions = defaultsDeep({
    layout: {
      padding: {
        left: 24,
        right: 24,
        top: 16,
        bottom: 24
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      intersect: true
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
