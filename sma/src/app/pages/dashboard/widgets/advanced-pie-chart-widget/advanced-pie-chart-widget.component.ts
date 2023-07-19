import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { defaultChartOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-defaults';
import { AdvancedPieChartWidgetOptions } from './advanced-pie-chart-widget-options.interface';

@Component({
  selector: 'fury-advanced-pie-chart-widget',
  templateUrl: './advanced-pie-chart-widget.component.html',
  styleUrls: ['./advanced-pie-chart-widget.component.scss']
})
export class AdvancedPieChartWidgetComponent implements OnInit {

  @Input() options: AdvancedPieChartWidgetOptions;
  @Input() chartOptions: ChartOptions = defaultsDeep({
    cutoutPercentage: 70,
    legend: {
      display: false
    }
  }, defaultChartOptions);
  @ViewChild('canvas', { read: ElementRef, static: true }) canvas: ElementRef;
  chart: Chart;
  total: number;

  isLoading: boolean;

  constructor() {
  }

  private _data: ChartData;

  get data() {
    return this._data;
  }

  @Input() set data(data: any) {
    let total = 0;
    data.datasets.forEach((dataset: any) => {
      total += dataset.data.reduce((pv, cv) => pv + cv, 0);
    });

    this._data = data;
    this.total = total;
  };

  get legendData() {
    return this._data.datasets[0].data;
  }

  getLegendLabel(index: number) {
    return this._data && this._data.labels.length > 0 ? this._data.labels[index] : null;
  }

  getLegendBackground(index: number) {
    return this._data && this._data.datasets
    && this._data.datasets[0]
    && this._data.datasets[0].backgroundColor
      ? this._data.datasets[0].backgroundColor[index]
      : null;
  }

  ngOnInit() {
  }

  getPercentageValue(value) {
    return `${Math.round((value / this.total) * 100)}%`;
  }

  reload() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
