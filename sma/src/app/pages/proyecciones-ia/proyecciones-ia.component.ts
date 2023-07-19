import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { global } from 'src/globals/global';
import { getAnaliticsOptions } from '../dashboard/dashboard-util';

@Component({
  selector: 'app-proyecciones-ia',
  templateUrl: './proyecciones-ia.component.html',
  styleUrls: ['./proyecciones-ia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProyeccionesIaComponent implements OnInit {

  app:any = global;  
  chartClassName:String;
  optionsGraph:any;

  constructor(private baseService: BaseService) { 
              
  }            

  ngOnInit() {
    this.chartClassName = 'long-demo-chart';
    this.optionsGraph = {};
  }

  filterBaseDatosFn(e:any){
    return e.codigo == 'AIRE';
  }
  filterTipoDatoFn(e:any){
    return (e.codigo == 'PM25' || e.codigo == 'PM10' || e.codigo == 'NO2' || e.codigo == 'SO2');
  }

  search(event:any):void
  {
    this.baseService.getPrediccionIA({}, null).subscribe((result:any)=>{

      this.configureChart(result);

    });
  }
  configureChart(data:any){

    var series:any[] = [];
    var i = 0;
    data.series.forEach(e => {
      var serie:any = {type: 'line', smooth: true, name: e.name, data: e.data};
      if (i++ == 0){
        serie['markArea'] = {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)'
          },
          data: [
            [
              {
                name: 'Zona de Alerta Predictiva',
                xAxis: data.hoy
              },
              {
                xAxis: data.maxFecha
              }
            ]
          ]
        }
      }
      series.push(serie);
    });

    this.optionsGraph = getAnaliticsOptions(data.xaxis, series, 'Forecasting', 'Datos de Test', 'Niveles de X en Aire', 'Valor Normalizado');

  }

}
