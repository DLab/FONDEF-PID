import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { global } from 'src/globals/global';
import * as echarts from 'echarts';
import { BaseService } from 'src/app/base.service';
import { formatDate } from '@angular/common';
import { MessageBox, MessageBoxType } from 'src/app/pages/message-box/message.box';
import { clone } from 'lodash-es';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphComponentComponent implements OnInit, AfterViewInit {
  app:any = global;

  chartClassName:string;
  logScale:boolean = false;
  public _graph:any;

  @Input() withData:boolean;
  @Input() graph:any;
  @ViewChild('graph', { static: true }) graphRef: ElementRef;
  private graphEchart:any;

  constructor(private baseService: BaseService
            , private messageBox: MessageBox) { }

  ngOnInit() {
    this._graph = {}
    this.chartClassName = 'long-demo-chart';
    this._graph = this.graph;
  }
  ngAfterViewInit(): void {
    this.graphEchart = echarts.init(this.graphRef.nativeElement); 
  }
  changeLogScale(){
    this._graph['yAxis']['type'] = this.logScale ? 'log' : 'value';
    this._graph = clone(this._graph);
  }
  downloadChart(){
    let img:any = this.graphEchart.getDataURL({type:'png', pixelRatio: 1, backgroundColor: '#fff'});
    this._graph['logScale'] = this.logScale;
    this.baseService.downloadAnalisis({data: this._graph, img:img}).subscribe((file:any)=>{
      const blob = new Blob([file], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = this._graph.title.text + '_' + formatDate(new Date(), 'yyyy/MM/dd/HH:mm:ss', global.currentLocale)+ '.zip';
      a.href = url;
      a.download =  fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['Se_ha_generado_el_archivo_con_exito']);
    });

  }
}
