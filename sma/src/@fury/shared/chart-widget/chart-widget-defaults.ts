import { ChartOptions } from 'chart.js';

export const defaultChartOptions: ChartOptions = {
  responsive: true,
  responsiveAnimationDuration: 0,
  animation: {
    duration: 0,
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false
    }]
  },
  tooltips: {
    titleFontFamily: 'Roboto, \'Helvetica Neue\', Arial, sans-serif',
    bodyFontFamily: 'Roboto, \'Helvetica Neue\', Arial, sans-serif',
    footerFontFamily: 'Roboto, \'Helvetica Neue\', Arial, sans-serif'
  }
};
