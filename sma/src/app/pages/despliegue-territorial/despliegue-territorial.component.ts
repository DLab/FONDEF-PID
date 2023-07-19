import { style } from '@angular/animations';
import { DetalleAnaliticaDeDatosComponent } from './../analitica-de-datos/detalle-analitica-de-datos/detalle-analitica-de-datos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { size } from 'lodash-es';
import { FilterList } from 'src/app/utils/filter-list';
import { global } from 'src/globals/global';
import { BaseService } from 'src/app/base.service';
import { MatDialog } from '@angular/material/dialog';
import { Icon, circle, icon, latLng, marker, point, tileLayer } from 'leaflet';
declare var $: any; 


@Component({
  selector: 'app-despliegue-territorial',
  templateUrl: './despliegue-territorial.component.html',
  styleUrls: ['./despliegue-territorial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DespliegueTerritorialComponent implements OnInit, AfterViewInit{

  app:any = global;
  chartClassName:String;
  options:any;
  layers:any;
  form: FormGroup;
  hsArray:any;

  filterOpenState:boolean = true;
  filterTipoDato:FilterList = new FilterList();
  filterBaseDato:FilterList = new FilterList();
  filterFuenteDato:FilterList = new FilterList();


  multiplesParametros:any = {codigoPadre: ['BASE_DATOS', 'PARAMETROS', 'ANALITICAS', 'TIPOS_DE_DATOS']};

  constructor(private baseService: BaseService
            , private fb: FormBuilder
            , private dialog: MatDialog) { 
              
  }     
  ngOnInit() {
    this.chartClassName = 'long-demo-chart';
    this.form = this.fb.group({
      tipoDato: [{value: null, disabled: false}]
    , baseDato: [{value: null, disabled: false}]
    , fuente: [{value: null, disabled: false}]
    , inicio: [{value: null, disabled: false}]
    , termino: [{value: null, disabled: false}]

    });    
    this.filterTipoDato.init([], this.form.get('tipoDato'));    
    this.filterBaseDato.init([], this.form.get('baseDato'));    
    this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{

      this.hsArray = result;
      this.filterBaseDato.init(this.hsArray['BASE_DATOS'], this.form.get('baseDato'));    
      this.filterFuenteDato.init(this.hsArray['TIPOS_DE_DATOS'], this.form.get('fuente'));    
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
  }
  changeBaseDato():void{
    this.filterTipoDato.init([], this.form.get('tipoDato'));    
    if (this.form.get('baseDato').value == null){
      return;  
    }
    var baseDato:any = this.form.get('baseDato').value;
    this.filterTipoDato.init(this.hsArray['PARAMETROS'].filter(e=> e.codigoBaseDato == baseDato.codigo), this.form.get('tipoDato'));    
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

  search():void {
    let data:any = {inicio: this.getFecha('inicio')
    , termino: this.getFecha('termino')
    , baseDatos: this.form.get('baseDato').value
    , tipoDato: this.form.get('tipoDato').value
    , fuente: this.form.get('fuente').value}

    this.baseService.getEstaciones(data, function(){console.log('error')}).subscribe((result:any)=>{
      console.log(result);
      let layers = [];
      result.result.forEach(e => {
        layers.push(this.newMark(e));        
      });
      this.layers = layers;
    });
    
  }
  newMark(e:any){
    let mark = marker([ e.latitud, e.longitud ], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/img/marker-icon.png',
        iconRetinaUrl: e.withData ? 'assets/marker-icon-2x.png' : 'assets/img/marker-icon-grey.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: point(20, 30),
      }),
    });
    
    mark.bindTooltip(e.ufId + '-' + e.regulado + ' ' + e.idProceso + "-" + e.estacion);
    mark.on('click', ()=>{
      this.dialog.open(DetalleAnaliticaDeDatosComponent, {
          data: {data: e, hsArray: this.hsArray, 
                 searchData:{
                      inicio: this.getFecha('inicio')
                    , termino: this.getFecha('termino')
                    , estacion: {id: e.idProceso, idRegulado: e.ufId}
                    , baseDatos: this.form.get('baseDato').value
                    , tipoDato: this.form.get('tipoDato').value
                    , fuente: this.form.get('fuente').value}
                , baseDato: this.form.get('baseDato').value}
        , height: '800px'
        , width: '1500px'
      });
      
    });
    return mark;
  }
}
