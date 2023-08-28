import { filter } from 'rxjs/operators';
import { DetalleAnaliticaDeDatosComponent } from './../analitica-de-datos/detalle-analitica-de-datos/detalle-analitica-de-datos.component';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
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
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { MessageBox, MessageBoxType } from '../message-box/message.box';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-despliegue-territorial',
  templateUrl: './despliegue-territorial.component.html',
  styleUrls: ['./despliegue-territorial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DespliegueTerritorialComponent implements OnInit, AfterViewInit, OnDestroy{

  FIELDS_CLASIFICACION:string[] = ['reino', 'filodivision', 'clase', 'orden', 'familia', 'genero', 'epitetoespecifico'];

  app:any = global;
  chartClassName:String;
  form: FormGroup;
  hsArray:any;
  minValue:number = 0;
  maxValue:number = 100;
  estaciones:any[];
  estacionesFiltradas:any[] = [];
  esBiodiversidad:boolean;
  contextMenuPosition = { x: '0px', y: '0px' };  
  isLayersLoaded:boolean = false;
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

  filterRegion:FilterList = new FilterList();
  filterReino:FilterList = new FilterList();
  filterFiloDivision:FilterList = new FilterList();
  filterClase:FilterList = new FilterList();
  filterOrden:FilterList = new FilterList();
  filterFamilia:FilterList = new FilterList();
  filterGenero:FilterList = new FilterList();
  filterEpitetoEspecifico:FilterList = new FilterList();

  tiposOperaciones:any[] = [];
  _tiposOperaciones:any[] = [];
  layers:any[] = [];
  tipoOperacion:any;
  listener:any;

  screenShoter:SimpleMapScreenshoter;


  multiplesParametros:any = {codigoPadre: ['BASE_DATOS', 'REGIONES', 'PARAMETROS', 'ANALITICAS', 'FUENTE_DE_DATOS', 'TIPO_OPERACION', 'REINOS']};

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  map:any;
  constructor(private baseService: BaseService
            , private fb: FormBuilder
            , private messageBox: MessageBox
            , private dialog: MatDialog) { 
              
  }     
  ngOnInit() {
    this.esBiodiversidad = false;
    this.chartClassName = 'long-demo-chart';
    this.form = this.fb.group({
      tipoDato: [{value: null, disabled: false}]
    , baseDato: [{value: null, disabled: false}]
    , tipoOperacion: [{value: null, disabled: false}]
    , fuente: [{value: null, disabled: false}]
    , inicio: [{value: null, disabled: false}]
    , termino: [{value: null, disabled: false}]
    , nombreComun: [{value: null, disabled: false}]
    , region: [{value: null, disabled: false}]
    , reino: [{value: null, disabled: false}]
    , filodivision: [{value: null, disabled: false}]
    , clase: [{value: null, disabled: false}]
    , orden: [{value: null, disabled: false}]
    , familia: [{value: null, disabled: false}]
    , genero: [{value: null, disabled: false}]
    , epitetoespecifico: [{value: null, disabled: false}]
    });    
    
    this.filterParametro.init([], this.form.get('tipoDato'));    
    this.filterBaseDato.init([], this.form.get('baseDato'));   

    this.filterRegion.init([], this.form.get('region'));   
    this.filterReino.init([], this.form.get('reino'));   
    this.filterFiloDivision.init([], this.form.get('filodivision'));   
    this.filterClase.init([], this.form.get('clase'));   
    this.filterOrden.init([], this.form.get('orden'));   
    this.filterFamilia.init([], this.form.get('familia'));   
    this.filterGenero.init([], this.form.get('genero'));   
    this.filterEpitetoEspecifico.init([], this.form.get('epitetoespecifico'));   
    let fields:string[] = ['reino', 'filodivision', 'clase', 'orden', 'familia', 'genero', 'epitetoespecifico'];
    this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{

      this.hsArray = result;
      
      this.filterBaseDato.init(this.hsArray['BASE_DATOS'].filter(e=>e.codigo == 'AIRE' || e.codigo == 'SeguimientoBio'), this.form.get('baseDato'));    
      this.filterFuenteDato.init(this.hsArray['FUENTE_DE_DATOS'], this.form.get('fuente'));    
      this.filterRegion.init(this.hsArray['REGIONES'], this.form.get('region'));    
      
      this.filterReino.init(this.hsArray['REINOS'], this.form.get('reino'));    

      this._tiposOperaciones = this.hsArray['TIPO_OPERACION']; 
      this.changeLanguage();

    });
    this.map = L.map('map', {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      ],
      zoom: 5,
      center: latLng(-32.8854990, -71.2474240)
    });
    this.screenShoter = new SimpleMapScreenshoter({hidden: true}).addTo(this.map);
    console.log(this.map)
    //this.search()
    global.load.addListener('loadok', this.listener = ()=>{
      this.changeLanguage();
    });
  }  
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }
  changeClasificacion(field:string){
    let clean:boolean = false;
    let nextField:string = null;
    this.FIELDS_CLASIFICACION.forEach(e=>{
      if (clean){
        if (nextField == null){
          nextField = e;
        }
        this.form.get(e).reset();
      }
      else if (e == field){
        clean = true;
      }
    });
    let values:any = this.form.value;
    let params:any = {};
    for(let e in values){
      if (values[e] && values[e].codigo){
        params[e] = values[e].codigo;
      }
    }

    this.baseService.changeClasificacionBiodiversidad(params).subscribe((result:any)=>{
      console.log(result)
      let ctr:any = this.form.get(nextField);
      ctr['filterList'].init(result, ctr);    
    });
  }
  changeLanguage(){
    let list:any[] = [];
    this._tiposOperaciones.forEach(e=>{
      e.descripcion = this.app.screen[e.codigo]
      list.push(e);
    });
    if (this.esBiodiversidad){
      this.tiposOperaciones = list.filter(e=>e.clasificacion=='Operacion_Simple');
    }
    else{
      this.tiposOperaciones = list;
    }
    
  }
  changeValidator(key:string, validator:ValidatorFn){
    this.form.get(key).setValidators(validator);
    this.form.get(key).updateValueAndValidity()
  }
  changeBaseDato():void{
    this.esBiodiversidad = false;
    this.filterParametro.init([], this.form.get('tipoDato'));    
    if (this.form.get('baseDato').value == null){
      return;  
    }
    var baseDato:any = this.form.get('baseDato').value;
    this.esBiodiversidad = baseDato.codigo == 'SeguimientoBio'
    this.form.get("tipoDato").reset();
    if (this.esBiodiversidad){
      this.changeValidator("fuente", Validators.nullValidator)
      if (!this.tipoOperacion){
        this.changeValidator("tipoDato", Validators.nullValidator)
      }
      
      this.tiposOperaciones = this._tiposOperaciones.filter(e=>e.clasificacion=='Operacion_Simple');
    }
    else{
      this.changeValidator("tipoDato", Validators.required)
      this.changeValidator("fuente", Validators.required)
      this.tiposOperaciones = this._tiposOperaciones;
    }
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

    this.layers.forEach(e=>{
      this.map.removeLayer(e);
    });
    this.layers = [];
    this.estacionesFiltradas = [];    
    let filter:boolean = this.tipoOperacion && this.minValue > 0 || this.maxValue < 100;
    
    this.isLayersLoaded = this.estaciones.length > 0;
    this.estaciones.forEach(e => {
      if (!filter || (e.withData && e.percentage >= this.minValue && e.percentage <= this.maxValue)){
        let layer:any = this.newMark(e);
        this.map.addLayer(layer);        
        this.layers.push(layer);
        this.estacionesFiltradas.push(e);
      }
    });    

  }
  changeTipoOperacion(){
    if (this.esBiodiversidad){
      this.changeValidator("tipoDato", this.tipoOperacion ? Validators.required : Validators.nullValidator)
    }
  }
  downloadChart(){
    let ctr:any = this;
    this.screenShoter.takeScreen('blob', {
      caption: function () {
          return 'Hello world'
      }
    }).then((blob:Blob) => {
      var reader = new FileReader();
      reader.onloadend = function() {
        ctr.downloadFile(reader.result);
      }      
      reader.readAsDataURL(blob); 
        
    }).catch(e => {
      this.messageBox.showMessageBox(MessageBoxType.Error, e.toString());
    })    
  }
  downloadFile(img:any){
    this.baseService.downloadDespliegueTerritorial({img: img, data: this.estacionesFiltradas, searchData: this.getSearchData()}).subscribe((file:any)=>{
      const blob = new Blob([file], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = this.app.screen[this.app.selectedMenuItem.name] + formatDate(new Date(), 'yyyy/MM/dd/HH:mm:ss', global.currentLocale)+ '.zip';
      a.href = url;
      a.download =  fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['Se_ha_generado_el_archivo_con_exito']);
    });

  }

  getSearchData()
  {
    let data:any = this.form.value;
    data.inicio = this.getFecha('inicio');
    data.termino = this.getFecha('termino');
    data.tipoOperacion = this.tipoOperacion;
    data.filtro = this.minValue + "% - " + this.maxValue + "%";
    return data;
  }
  search():void {
    let data:any = this.getSearchData()

    this.baseService.getUnidadesMedicion(data, function(){console.log('error')}).subscribe((result:any)=>{
      this.estaciones = result.result;
      let max:number = this.esBiodiversidad ? result.max : 0;
      this.filterOpenState = false;
      this.estaciones.forEach(e=>{
        e.tieneValor = e.valor || e.valor == 0
        if (this.esBiodiversidad){
          e.valorMaximo = max;
        }
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
                    , estacion: {id: data.idProceso, idRegulado: data.ufId, descripcion: data.estacion}
                    , regulado: {id: data.ufId, descripcion: data.regulado}
                    , baseDatos: this.form.get('baseDato').value
                    , tipoDato: this.form.get('tipoDato').value
                    , fuente: this.form.get('fuente').value}
                , baseDato: this.form.get('baseDato').value}
        , height: '800px'
        , width: '1500px'
      });

  }
  openProyeccionesIA(data:any){
    data.esProyeccion = true
    data.title = 'Proyecciones_IA';
    this.openAnaliticaClass(data, DetalleAnaliticaDeDatosComponent)
  }
  openAnaliticaDeDatos(data:any){
    data.esProyeccion = false
    data.title = 'Analitica_de_Datos';
    this.openAnaliticaClass(data, DetalleAnaliticaDeDatosComponent)
  }
  format(value:number){
    if (Math.trunc(value + 0.9999) != value){
      return value.toFixed(3);
    }
    return value;
  }
  newMark(e:any){
    let mark = marker([ e.latitud, e.longitud ]
      , {
          icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: this.getImage(e),
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: point(20, 30),
        }),
    });
    if (this.esBiodiversidad){
      mark.bindTooltip('<b>' + this.app.screen.Especie + ':</b> ' + e.especie + '<br>' 
                    + '<b>' + this.app.screen.nombre_comun + ':</b> ' + e.nombreComun 
                    + (e.tieneValor ? "<br><b>" + this.app.screen.Valor + ':</b> ' + this.format(e.valor)
                    + '<br><b>' + this.app.screen.Porcentaje + ':</b> ' + e.percentage + "%" : ""));
    }
    else{
      mark.bindTooltip(e.ufId + '-' + e.regulado + ' ' + e.idProceso + "-" + e.estacion + (e.tieneValor ? " (" + e.percentage + "%)" : ""));
    }
    
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
