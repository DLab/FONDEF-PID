import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { global } from 'src/globals/global';
import { getAnaliticsOptions } from '../dashboard/dashboard-util';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-proyecciones-ia',
  templateUrl: './proyecciones-ia.component.html',
  styleUrls: ['./proyecciones-ia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProyeccionesIaComponent implements OnInit {

  app:any = global;  
  hsArray:any;

  chartClassName:String;
  optionsGraph:any;
  isPopup:boolean;

  subTitle:string;
  analiticas:any[];
  hsAnaliticas:any;
  inicio:Date;
  termino:Date;


  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any
            , private baseService: BaseService) { 
      this.isPopup = data != undefined;
      if (this.isPopup){
        this.subTitle = data.data.regulado + '-' + data.data.estacion + ' ( ' + data.searchData.tipoDato.descripcion + ' - ' + data.searchData.fuente.descripcion + ' )';
        this.inicio = this.data.searchData.inicio;
        this.termino = this.data.searchData.termino;
        this.hsArray = this.data.hsArray;
        this.analiticas = this.hsArray['ANALITICAS'];
        this.hsAnaliticas = {};
        this.analiticas.forEach(e=>{
          this.hsAnaliticas[e.codigo] = e;
          e.descripcion = this.app.screen[e.codigo]
        });
    
      }
  
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
  searchItem(item:any):void{
    let data:any = this.data.searchData;
    for(let e in item){
      data[e] = item[e]
    }
    this.search(data);

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
