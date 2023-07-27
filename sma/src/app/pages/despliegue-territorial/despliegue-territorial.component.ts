import { DetalleAnaliticaDeDatosComponent } from './../analitica-de-datos/detalle-analitica-de-datos/detalle-analitica-de-datos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { size } from 'lodash-es';
import { FilterList } from 'src/app/utils/filter-list';
import { global } from 'src/globals/global';
import { BaseService } from 'src/app/base.service';
import { MatDialog } from '@angular/material/dialog';
import { Icon, icon, latLng, marker, point, tileLayer } from 'leaflet';
import { Options } from '@angular-slider/ngx-slider';
import * as L from 'leaflet';
import { event } from 'jquery';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProyeccionesIaComponent } from '../proyecciones-ia/proyecciones-ia.component';


@Component({
  selector: 'app-despliegue-territorial',
  templateUrl: './despliegue-territorial.component.html',
  styleUrls: ['./despliegue-territorial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DespliegueTerritorialComponent implements OnInit, AfterViewInit, OnDestroy{

  app:any = global;
  chartClassName:String;
  options:any;
  layers:any;
  form: FormGroup;
  hsArray:any;
  minValue:number = 0;
  maxValue:number = 100;
  estaciones:any[];
  contextMenuPosition = { x: '0px', y: '0px' };  
  optionsSlider:Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    noSwitching: true,
    translate: (value: number): string => {
      return  value + '%';
    },
    selectionBarGradient: {
      from: '#d0d0d0',
      to: '#a00',
    }
  };

  filterOpenState:boolean = true;
  filterParametro:FilterList = new FilterList();
  filterBaseDato:FilterList = new FilterList();
  filterFuenteDato:FilterList = new FilterList();

  tiposOperaciones:any[] = [];
  tipoOperacion:any;
  listener:any;


  multiplesParametros:any = {codigoPadre: ['BASE_DATOS', 'PARAMETROS', 'ANALITICAS', 'FUENTE_DE_DATOS', 'TIPO_OPERACION']};

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  constructor(private baseService: BaseService
            , private fb: FormBuilder
            , private dialog: MatDialog) { 
              
  }     
  ngOnInit() {
    this.chartClassName = 'long-demo-chart';
    this.form = this.fb.group({
      tipoDato: [{value: null, disabled: false}]
    , baseDato: [{value: null, disabled: false}]
    , tipoOperacion: [{value: null, disabled: false}]
    , fuente: [{value: null, disabled: false}]
    , inicio: [{value: null, disabled: false}]
    , termino: [{value: null, disabled: false}]

    });    
    
    this.filterParametro.init([], this.form.get('tipoDato'));    
    this.filterBaseDato.init([], this.form.get('baseDato'));    
    this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{

      this.hsArray = result;
      this.filterBaseDato.init(this.hsArray['BASE_DATOS'], this.form.get('baseDato'));    
      this.filterFuenteDato.init(this.hsArray['FUENTE_DE_DATOS'], this.form.get('fuente'));    
      this.tiposOperaciones = this.hsArray['TIPO_OPERACION']; 
      this.changeLanguage();

    });
    this.layers = [];
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      ],
      zoom: 5,
      center: latLng(-32.8854990, -71.2474240)
    };
    //this.search()
    global.load.addListener('loadok', this.listener = ()=>{
      this.changeLanguage();
    });
  }
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }
  changeLanguage(){
    let list:any[] = [];
    this.tiposOperaciones.forEach(e=>{
      e.descripcion = this.app.screen[e.codigo]
      list.push(e);
    });
    this.tiposOperaciones = list;
  }

  changeBaseDato():void{
    this.filterParametro.init([], this.form.get('tipoDato'));    
    if (this.form.get('baseDato').value == null){
      return;  
    }
    var baseDato:any = this.form.get('baseDato').value;
    this.filterParametro.init(this.hsArray['PARAMETROS'].filter(e=> e.codigoBaseDato == baseDato.codigo), this.form.get('tipoDato'));    
  }

  ngAfterViewInit(): void {
  }

  isValid(){
    return this.form.valid;
  }
  getFecha(property:string){
    let fecha:any = this.form.get(property).value;
    if (fecha){
      return fecha.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    return null;
  }
  filterChange(){
    this.showEstaciones()
  }

  showEstaciones(){
    let layers = [];
    let filter:boolean = this.minValue > 0 || this.maxValue < 100;
    this.estaciones.forEach(e => {
      if (!filter || (e.withData && e.percentage >= this.minValue && e.percentage <= this.maxValue)){
        layers.push(this.newMark(e));        
      }
    });
    this.layers = layers;

  }
  search():void {
    let data:any = {inicio: this.getFecha('inicio')
    , termino: this.getFecha('termino')
    , baseDatos: this.form.get('baseDato').value
    , tipoDato: this.form.get('tipoDato').value
    , tipoOperacion: this.tipoOperacion
    , fuente: this.form.get('fuente').value}

    this.baseService.getEstaciones(data, function(){console.log('error')}).subscribe((result:any)=>{
      this.estaciones = result.result;
      this.filterOpenState = false;
      this.estaciones.forEach(e=>{
        e.tieneValor = e.valor || e.valor == 0
        e.percentage = Math.round((e.tieneValor ? e.valor / e.valorMaximo : 1) * 1000) / 10;
      })
      this.showEstaciones()
    });
    
  }
  getImage(e:any):any{
    if (e.tieneValor){
      if (!e.withData || e.percentage <= 0){
        return 'assets/img/marker-icon-grey.png';
      }
      if (e.percentage > 100){
        return 'assets/img/marker-icon-red0.png'
      }
      let n:Number = 10 - Math.round(e.percentage / 10);
      return 'assets/img/marker-icon-red' + n + '.png';
    }
    return e.withData ? 'assets/img/marker-icon-red.png' : 'assets/img/marker-icon-grey.png';

  }
  openAnaliticaClass(data:any, AnaliticsClass:any){
      this.dialog.open(AnaliticsClass, {
          data: {data: data, hsArray: this.hsArray, 
                 searchData:{
                      inicio: this.getFecha('inicio')
                    , termino: this.getFecha('termino')
                    , estacion: {id: data.idProceso, idRegulado: data.ufId}
                    , baseDatos: this.form.get('baseDato').value
                    , tipoDato: this.form.get('tipoDato').value
                    , fuente: this.form.get('fuente').value}
                , baseDato: this.form.get('baseDato').value}
        , height: '800px'
        , width: '1500px'
      });

  }
  openProyeccionesIA(data:any){
    this.openAnaliticaClass(data, ProyeccionesIaComponent)
  }
  openAnaliticaDeDatos(data:any){
    this.openAnaliticaClass(data, DetalleAnaliticaDeDatosComponent)
}
newMark(e:any){
    let mark = marker([ e.latitud, e.longitud ]
      , {
          icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/img/marker-icon.png',
          iconRetinaUrl: this.getImage(e),
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: point(20, 30),
        }),
    });
    
    mark.bindTooltip(e.ufId + '-' + e.regulado + ' ' + e.idProceso + "-" + e.estacion + (e.tieneValor ? " (" + e.percentage + "%)" : ""));
    mark.on('click', (event)=>{
      this.contextMenuPosition.x = event.originalEvent.clientX + 'px';
      this.contextMenuPosition.y = event.originalEvent.clientY + 'px';
      this.contextMenu.menuData = { 'item': e };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
      
    });
    return mark;
  }
}
