import { Component, OnInit, Optional, ViewEncapsulation, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { BaseService } from 'src/app/base.service';
import { global } from 'src/globals/global';
import { getAnaliticsOptions, renderStem } from '../../dashboard/dashboard-util';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageBox, MessageBoxType } from '../../message-box/message.box';
import { MatMenuTrigger } from '@angular/material/menu';
import { clone } from 'lodash-es';
import { AdditionalDataComponent } from './additional-data/additional-data.component';

@Component({
  selector: 'app-detalle-analitica-de-datos',
  templateUrl: './detalle-analitica-de-datos.component.html',
  styleUrls: ['./detalle-analitica-de-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleAnaliticaDeDatosComponent implements OnInit {

  PALETA:string[] = ['#980909', '#a0a339', '#ef07f6', '#2af607', '#433131', '#0228f3', '#f05d10'];
  app:any = global;
  isPopup:boolean;
  hsArray:any;
  subTitle:string;
  form: FormGroup;
  analiticas:any[];
  hsAnaliticas:any;
  inicio:Date;
  termino:Date;


  optionsGraph:any[] = [];
  xAxis:any[] = [];
  usedColors:string[];
  listener:any;
  moveToGraphs:any[];
  contextMenuPosition = { x: '0px', y: '0px' };  
  withData:boolean = false;

  methodName:string;

  @Input() title:string;
  @Input() esProyeccion:boolean;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any
            , private baseService: BaseService
            , private messageBox: MessageBox
            , private dialog: MatDialog
            , private fb: FormBuilder) { 
    this.isPopup  = data != undefined;
    if (this.isPopup){
      this.title = data.data.title;
      this.subTitle = data.data.regulado + '-' + data.data.estacion + ' ( ' + data.searchData.tipoDato.descripcion + ' - ' + data.searchData.fuente.descripcion + ' )';
      this.inicio = this.data.searchData.inicio;
      this.termino = this.data.searchData.termino;
      this.hsArray = this.data.hsArray;
      this.esProyeccion = this.data.data.esProyeccion
      this.analiticas = this.hsArray['ANALITICAS'];
      this.hsAnaliticas = {};
      this.analiticas.forEach(e=>{
        this.hsAnaliticas[e.codigo] = e;
        e.descripcion = this.app.screen[e.codigo]
      });
  
    }
  }

  ngOnInit() {
    this.optionsGraph = [this.newOptionGraph([], [], '', 'Fechas', 'Valores', {})];
    global.load.addListener('loadok', this.listener = ()=>{
      this.changeLanguage();
    });

    this.methodName = this.esProyeccion ? 'getPrediccionIA': 'getAnaliticaDeDatos'
  }
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }
  changeLanguage(){
    this.optionsGraph.forEach(g=>{
      g.series.forEach(e=>{
        e.name = this.app.screen[e.code]
        if (!e.name)
          e.name = e.code
      });  
      this.selectedSeriesChange(g);
    })

  }

  openNewGraph(item:any){
    let newItem:any = clone(item);
    item.selected = false;
    newItem.selected = true;
    this.optionsGraph.push(this.newOptionGraph(this.xAxis, [newItem], '', 'Fechas', 'Valores', {}));
    this.optionsGraph = this.optionsGraph;
    this.selectedSeriesChange(this.optionsGraph[0])
  }
  moveToGraph(item:any, graph:any){
    let newItem:any = clone(item);
    newItem.selected = true;
    graph.series.push(item);
    graph._series.push(item);
    this.optionsGraph = this.optionsGraph;
    this.selectedSeriesChange(graph)

  }
  removeFromGraph(item:any){
    let graph:any = this.optionsGraph[item.indexGraph];
    let index:number = graph._series.indexOf(item);
    graph._series.splice(index, 1);
    if (graph._series.length == 0){
      this.optionsGraph.splice(item.indexGraph, 1);
    }
    else{
      this.selectedSeriesChange(graph);
    }
  }
  openMenu(event:any, index:number, item:any){
    item['indexGraph'] = index;
    event.preventDefault(); 
    this.moveToGraphs = [];
    if (index == 0){
      let n:number = 0;
      this.optionsGraph.forEach(e=>{
        if (n > 0){
          this.moveToGraphs.push(e);
        }
        n++;
      });      
    }
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  newOptionGraph(xaxis:any[], series:any[], caption:string, xAxisLabel:string, yAxisLabel:string, searchData:any){
    let optionGraph = getAnaliticsOptions(xaxis, series, this.app.screen[this.title], caption, xAxisLabel, yAxisLabel);
    optionGraph['_series'] = clone(series);
    optionGraph['searchData'] = searchData
    return optionGraph;
  }
  selectedSeriesChange(graph:any){
    let series:any[] = [];
    graph._series.forEach(e=>{
      if (e.selected){
        series.push(e);
      }
    });
    graph['series'] = series;
    let index:number = this.optionsGraph.indexOf(graph);
    this.optionsGraph[index] = clone(graph);
    //this.optionsGraph = [this.newOptionGraph(this.xAxis, series, this.app.screen.Analitica_de_Datos, '', 'Fechas', 'Valores')];
  }
  getRandomColor()
  {
    let index:number = 0;
    while (index < this.PALETA.length){
      let color:string = this.PALETA[index++];
      if (this.usedColors.indexOf(color) == -1){
        return color;
      }
    }

    const dec = Math.floor(0x1000000 * Math.random()); // 0x1000000 = 0xFFFFFF + 1
    let hex = dec.toString(16);
    for (let i = hex.length; i < 6; ++i) {
      hex = '0' + hex;
    }
    return '#' + hex;
  }
  showAdditionalData(data:any, items:any){

    this.dialog.open(AdditionalDataComponent, {
      data: {items: items
          , esProyeccion: this.esProyeccion
          , hsArray: this.hsArray
      }
    }).afterClosed().subscribe((result:any) => {      
      if (result != undefined && result != true){
        data['additionalData'] = result;
        this._search(data);
      }
    });
  }  
  searchItem(item:any){
    let data:any = this.data.searchData;
    for(let e in item){
      data[e] = item[e]
    }
    this.search(data);
  }

  search(data:any):void{
      let additionalData:any[] = [];
      let show:boolean = false;
      data.analitica.forEach(e => {
        let jsonGui:any;
        if (!e['jsonGui']){
          jsonGui = JSON.parse(e['parametrosGui']);
          e['jsonGui'] = jsonGui;
        }
        else{
          jsonGui = e['jsonGui'];
        }
        
        if (jsonGui['additionalData']){
          show = true;
          additionalData.push({'name': this.app.screen[e['codigo']], 'codigoBaseDato': e['codigoBaseDato'], additionalData: jsonGui['additionalData']})
        }
        else{
          additionalData.push({'name': this.app.screen[e['codigo']], additionalData: []})
        }
      });

      if (show){
        this.showAdditionalData(data, additionalData);
      }
      else{
        data['additionalData'] = [[]];
        this._search(data);
      }
  }
  _search(data:any):void{
    this.withData = false;
    let dialogRef = this.messageBox.showWaitMessageBox(this.app.screen.Estamos_procesando_sus_analisis)
    this.baseService[this.methodName](data, function(){console.log('error')}).subscribe((result:any)=>{
        this.withData = true;
        dialogRef.close();
        console.log(result)
        let series = [];
        if (result.ERROR){
          this.optionsGraph = [this.newOptionGraph([], [], '', 'Fechas', 'Valores', {})];
          let error:string = this.app.screen[result.ERROR];
          this.messageBox.showMessageBox(MessageBoxType.Error, error ? error : result.ERROR);  
          return;
        }
        this.xAxis = [];

        if (data.analitica.funcion == 'cantidad_datos'){
          series = [{type: 'line', smooth: true, name: 'Datos', data: result.datos.Y, selected: true}];
        }
        else{
          this.usedColors = [];
          series = [];
          result.data.forEach((e:any) => {
            if (e.analitica){              
              let jsonGui:any = JSON.parse(this.hsAnaliticas[e.analitica]['parametrosGui'])['display'];
              let index:number = 0;
              let markLine:any[] = [];
              let markPoint:any;
              jsonGui.forEach((serie:any) => {
                if (serie.type == 'markLine'){
                  serie['yAxis'] = e.data[index++]
                  markLine.push(serie);
                }
                else if (serie.type == 'markPoint'){
                  let points:any[] = e.data[index++];
                  markPoint = serie;
                  serie['data'] = [];
                  points.forEach(e=>{
                    serie['data'].push({xAxis:e[0], yAxis:e[1], value: e[1]});
                  })
                }
                else{
                  serie['data'] = e.data[index++];
                  serie['code'] = serie['name'];
                  serie['name'] = this.app.screen[serie['code']];
                  if (serie.renderItem){
                    if (serie.renderItem == 'renderStem')
                    serie.renderItem = renderStem;
                  }
                  serie['selected'] = true;
                  if (!serie['itemStyle']){
                    serie['itemStyle'] = {};
                  }
                  if (!serie['itemStyle']['color']){
                    serie['itemStyle']['color'] = this.getRandomColor()
                  }
                  if (markLine.length > 0){
                    serie['markLine'] = {label:{show:true}
                      , data: markLine
                    }  
                    markLine = [];
                  }
                  if (markPoint){
                    serie['markPoint'] = markPoint;
                    markPoint = null;
                  }
                  this.usedColors.push(serie['itemStyle']['color']);
                  series.push(serie);    
                }
              });
            }
            else{
              let name = this.app.screen[e.name]
              if (!name){
                name = e.name;
              }
              let serie:any = {type: 'line', smooth: true, code: e.name, name: name, data: e.Y, selected: true, itemStyle: {color: this.getRandomColor()}};
              this.usedColors.push(serie['itemStyle']['color']);
              series.push(serie);

            }
            //series.push({type: 'scatter', symbol: 'circle', symbolSize: 10, smooth: true, name: e.name, data: e.Y});
            //series.push({type: 'bar', barWidth: 1, smooth: true, name: e.name, data: e.Y});
          });
        }
        //console.log(this.series)

        result.X.forEach((e:any)=>{
          this.xAxis.push(moment(e, 'YYYY-MM-DD HH:mm:ss').format('DD MMM-YY HH'));
        });
        this.optionsGraph = [this.newOptionGraph(this.xAxis, series, '', 'Fechas', 'Valores', data)];
    });    
  }

}
