import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Chart from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { BehaviorSubject } from 'rxjs';
import { defaultChartOptions } from '../../../../../@fury/shared/chart-widget/chart-widget-defaults';
import { AudienceOverviewWidgetOptions } from './audience-overview-widget-options.interface';

@Component({
  selector: 'fury-audience-overview-widget',
  templateUrl: './audience-overview-widget.component.html',
  styleUrls: ['./audience-overview-widget.component.scss']
})
export class AudienceOverviewWidgetComponent {

  data: ChartData;
  @ViewChild('canvas', { read: ElementRef, static: true }) canvas: ElementRef;
  @Input() chartOptions: ChartOptions = defaultsDeep({
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          fontColor: '#9e9e9e',
          padding: 12
        },
      }],
      yAxes: [{
        display: true,
        position: 'right',
        gridLines: {
          drawBorder: false,
          offsetGridLines: true
        },
        ticks: {
          fontColor: '#9e9e9e',
          maxTicksLimit: 5
        }
      }]
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5
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
  chart: Chart;
  isLoading: boolean;
  timeframe = new FormControl('last7');

  constructor() {}

  private _options: AudienceOverviewWidgetOptions[];

  get options() {
    return this._options;
  }

  @Input() set options(options: AudienceOverviewWidgetOptions[]) {
    if (options) {
      this._options = options;

      options.forEach(option => {
        if (!option.sum) {
          const data = option.data.datasets[0].data as number[];
          option.sum = data.reduce((sum: number, x: number) => sum + x);
        }

        if (!option.gain && option.data.datasets && option.data.datasets.length > 1) {
          const data1 = option.data.datasets[0].data as number[];
          const data2 = option.data.datasets[1].data as number[];
          const sum1 = data1.reduce((sum: number, x: number) => sum + x);
          const sum2 = data2.reduce((sum: number, x: number) => sum + x);

          option.gain = Math.round(((sum1 - sum2) / sum2 * 100) * 100) / 100;
        }
      });

      this.setActiveOptions(options[0]);
    }
  }

  private _activeOptions = new BehaviorSubject<AudienceOverviewWidgetOptions>({ label: '' });

  get activeOptions() {
    return this._activeOptions.getValue();
  }

  set activeOptions(options) {
    this._activeOptions.next(options);
  }

  setActiveOptions(options: AudienceOverviewWidgetOptions) {
    this.activeOptions = options;
  }

  isActive(options) {
    return this.activeOptions === options;
  }

  reload() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
