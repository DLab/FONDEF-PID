import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { defaultChartOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-defaults';
import { ListColumn } from '../../../../../@fury/shared/list/list-column.model';
import { RecentSalesWidgetOptions } from './recent-sales-widget-options.interface';

@Component({
  selector: 'fury-recent-sales-widget',
  templateUrl: './recent-sales-widget.component.html',
  styleUrls: ['./recent-sales-widget.component.scss']
})
export class RecentSalesWidgetComponent {

  @Input() tableOptions: {
    pageSize: number;
    columns: ListColumn[]
  };
  @Input() tableData: any[];
  @Input() chartData: ChartData;
  @Input() options: RecentSalesWidgetOptions;
  @Input() chartOptions: ChartOptions = defaultsDeep({
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
