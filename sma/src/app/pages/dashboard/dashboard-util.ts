import { getFormatNumber } from 'src/app/utils/number-format/number-format.directive';

export function getCharOptionTarificaciones() {
    return {
        totalResumen: 0,
        responsive: true,
        legend: {
          position: 'right',
        },
        plugins: {
          datalabels: {
            color: '#fff',
            formatter: (value:number, ctx:any) => {
              return getFormatNumber((value / ctx.chart.options.totalResumen) * 100, 2) + '%';
            },
          },
        }
      };    
}
export function dayInterval(index:number, value:string) {
  var day:string = value.substring(1, 2);
  if (index == 0 || day == '0' || day == '5') {
    return value;
  } else{
    return false;
  }
}

export function getPieChartOptions(series:any[], selected:string[], legend:string[], legendFormatter?:any){
  return {
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'horizontal',
        align: 'left',
        left: 10,
        bottom: 0,
        data: legend,
        formatter: legendFormatter ? legendFormatter : '{name}',
        selected: selected
    },
    series: [
        {
            type: 'pie',
            radius: '55%',
            center: ['50%', '30%'],
            data: series,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
  }  
}
export function getItemSerie(name:string, data:number[], type?:string){
  return {
    data: data,
    name: name,
    type: type || 'line',
    areaStyle: { color: '#fff'}
  }
}
export function getBarChartOptions(source: any[], series:any[], selected:string[], legend:string[], legendFormatter?:any){
  return  {
    legend: {
        orient: 'horizontal',
        align: 'left',
        left: 10,
        bottom: 0,
        height: legend.length <= 5 ? "30%" : legend.length <= 10 ? "40%" : "50%",
        data: legend,
        formatter: legendFormatter ? legendFormatter : '{name}',
        selected: selected
    },
    grid: {
      height: legend.length <= 5 ? "70%" : legend.length <= 10 ? "60%" : "50%",
    },
    tooltip: {},
    dataset: {
        source: source
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: series
  };

}
export function getEChartOptions(xAxis:any[], series:any[], legend:string[], intervalFunction?:any, tooltipFomatter?:any){
    return {      
        xAxis: [
            {
              type: "category",
              boundaryGap: false,
              axisLine: {
                onZero: true,
              },
              //You can use the dividing line of the x-axis and y-axis to realize the grid
              splitLine: {
                show: true,
                interval: "0",
              },
              axisLabel: {
                show: true,
                // Process the data in data into the interval you want
                interval: function(index:number, value:string) {
                  if (intervalFunction){
                    return intervalFunction(index, value);
                  }
                  var day:string = value.substring(0, 2);
                  if (index == 0 || day == '01' || day == '15') {
                    return value;
                  } else{
                    return false;
                  }
                }
              },
              // The x-axis data can be fixed or dynamically acquired
              data: xAxis
            }],        
        yAxis: {
          type: 'value'
        },
        legend: {data: legend, y: 'top'}, 
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: tooltipFomatter ? tooltipFomatter : function (params) {
            return `<b>${params['name']}</b> : ${getFormatNumber(params['value'], 2)}`;
          }
        },
        dataZoom: [
          {
            textStyle: {
              color: '#8392A5'
            },
            bottom: "10",
            handleIcon:
              'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            dataBackground: {
              areaStyle: {
                color: '#8392A5'
              },
              lineStyle: {
                opacity: 0.8,
                color: '#8392A5'
              }
            },
            brushSelect: true
          },
          {
            type: 'inside'
          }
        ],          
        series: series
      };
} 

export function renderStem(param:any, api:any){
  var xValue = api.value(0);
  var openPoint = api.coord([xValue, api.value(1)]);
  var zero = api.coord([xValue, 0]);
  var style = api.style({
    stroke: api.visual('color')
  });
  return {
    type: 'group',
    children: [
      {
        type: 'line',
        shape: {
          x1: openPoint[0],
          y1: openPoint[1],
          x2: openPoint[0],
          y2: zero[1]
        },
        style: style
      },
      {
        type: 'circle',
        shape: {
          cx: openPoint[0],
          cy: openPoint[1],
          r: 5
        },
        style: style
      }
    ]
  };
}

export function getAnaliticsOptions(xaxis:any[], series:any[], title:string, caption:string, xAxisLabel:string, yAxisLabel:string){
  return {      
  title: {
    text: title,
    subtext: caption
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  grid:{height: '75%'},
  xAxis: {
    name: xAxisLabel,
    nameLocation: 'middle',
    nameGap: 70,
    nameTextStyle: {fontSize: 16},        
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: xaxis
  },
  yAxis: {
    name: yAxisLabel,
    nameLocation: 'middle',
    nameGap: 50,
    nameTextStyle: {fontSize: 16},        
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    axisPointer: {
      snap: true
    }
  },
  dataZoom: [
    {
      textStyle: {
        color: '#8392A5'
      },
      bottom: "55",
      handleIcon:
        'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      dataBackground: {
        areaStyle: {
          color: '#8392A5'
        },
        lineStyle: {
          opacity: 0.8,
          color: '#8392A5'
        }
      },
      brushSelect: true
    },
    {
      type: 'inside'
    }
  ],    
  series: series
  };
}