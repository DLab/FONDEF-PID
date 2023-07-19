import { filter } from 'rxjs/operators';
import { BaseService } from 'src/app/base.service';
import { MessageBox } from 'src/app/pages/message-box/message.box';
import { FilterList } from 'src/app/utils/filter-list';
import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { global } from 'src/globals/global';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-filtros-por-estacion',
  templateUrl: './filtros-por-estacion.component.html',
  styleUrls: ['./filtros-por-estacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FiltrosPorEstacionComponent implements OnInit, OnDestroy {

  app:any = global;

  form: FormGroup;
  hsArray:any;

  filterOpenState:boolean = true;
  filterRegiones:FilterList = new FilterList();
  filterComunas:FilterList = new FilterList();
  filterRegulado:FilterList = new FilterList();
  filterBaseDato:FilterList = new FilterList();
  filterEstacion:FilterList = new FilterList();
  filterTipoDato:FilterList = new FilterList();
  filterFuenteDato:FilterList = new FilterList();

  analitica:any[] = [];
  
  analiticas:any[];
  hsAnaliticas:any;
  listener:any;

  @Output() search:EventEmitter<any> = new EventEmitter<any>();
  @Input() filterBaseDatoFn:any;
  @Input() filterTipoDatoFn:any;
  @Input() showAnalitica:boolean = false;

  multiplesParametros:any = {codigoPadre: ['REGIONES', 'COMUNAS', 'BASE_DATOS', 'PARAMETROS', 'ANALITICAS', 'TIPOS_DE_DATOS']};
  constructor(private baseService: BaseService
    , private messageBox: MessageBox
    , private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
        baseDato: [{value: null, disabled: false}]
      , tipoDato: [{value: null, disabled: false}]
      , region: [{value: null, disabled: false}]
      , comuna: [{value: null, disabled: false}]
      , regulado: [{value: null, disabled: false}]
      , estacion: [{value: null, disabled: false}]
      , inicio: [{value: null, disabled: false}]
      , termino: [{value: null, disabled: false}]
      , fuente: [{value: null, disabled: false}]
    });    
    this.filterRegiones.init([], this.form.get('region'));    
    this.filterComunas.init([], this.form.get('comuna'));    
    this.filterRegulado.init([], this.form.get('regulado'));    
    this.filterBaseDato.init([], this.form.get('baseDato'));    
    this.filterEstacion.init([], this.form.get('estacion')); 
    this.filterTipoDato.init([], this.form.get('tipoDato'));    
    this.filterFuenteDato.init([], this.form.get('fuente'));    
    this.analiticas = [];
    this.hsAnaliticas = {};

    this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{

      this.hsArray = result;
      this.filterRegiones.init(this.hsArray['REGIONES'], this.form.get('region'));    
      this.filterFuenteDato.init(this.hsArray['TIPOS_DE_DATOS'], this.form.get('fuente'));    
      if (this.filterBaseDatoFn){
        this.filterBaseDato.init(this.hsArray['BASE_DATOS'].filter(e=>this.filterBaseDatoFn(e)) , this.form.get('baseDato'));    
      }
      else{
        this.filterBaseDato.init(this.hsArray['BASE_DATOS'], this.form.get('baseDato'));    
      }
      
    });

    global.load.addListener('loadok', this.listener = ()=>{
      this.changeLanguage();
    });
  }
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }
  changeLanguage(){
    let list:any[] = [];
    this.analiticas.forEach(e=>{
      e.descripcion = this.app.screen[e.codigo]
      list.push(e);
    });
    this.analiticas = list;
  }

  isValid(){
    return this.form.valid && this.analitica.length > 0;
  }
  clearRegion(){
    this.form.get('region').reset();
    this.form.get('comuna').reset();
    this.form.get('regulado').reset();
    this.form.get('estacion').reset()    
    this.filterComunas.init([], this.form.get('comuna'));    
    this.filterRegulado.init([], this.form.get('regulado'));    
    this.filterEstacion.init([], this.form.get('estacion'));    
  }
  clearComuna(){
    this.form.get('comuna').reset();
    this.form.get('regulado').reset()    
    this.form.get('estacion').reset()    
    this.filterRegulado.init([], this.form.get('regulado'));    
    this.filterEstacion.init([], this.form.get('estacion'));    
  }
  clearRegulado(){
    this.form.get('regulado').reset()    
    this.form.get('estacion').reset()    
    this.filterEstacion.init(this.hsArray['estaciones'], this.form.get('estacion'));    
  }
  changeBaseDato():void{
    this.filterTipoDato.init([], this.form.get('tipoDato'));    
    this.analiticas = [];
    if (this.form.get('baseDato').value == null){
      return;  
    }
    var baseDato:any = this.form.get('baseDato').value;

    this.analiticas = this.hsArray['ANALITICAS'].filter(e=> e.codigoBaseDato == baseDato.codigo);    
    this.analiticas.forEach(e=>{
      this.hsAnaliticas[e.codigo] = e;
      e.descripcion = this.app.screen[e.codigo]
    });

    if (this.filterTipoDatoFn){
      this.filterTipoDato.init(this.hsArray['PARAMETROS'].filter(e=> e.codigoBaseDato == baseDato.codigo && this.filterTipoDatoFn(e)), this.form.get('tipoDato'));    
    }
    else{
      this.filterTipoDato.init(this.hsArray['PARAMETROS'].filter(e=> e.codigoBaseDato == baseDato.codigo), this.form.get('tipoDato'));    
    }
  }
  changeRegiones():void{
    this.filterComunas.init([], this.form.get('comuna'));    
    this.filterRegulado.init([], this.form.get('regulado'));    
    this.filterEstacion.init([], this.form.get('estacion'));    
    if (this.form.get('region').value == null){
      return;  
    }
    var region:any = this.form.get('region').value;
    this.filterComunas.init(this.hsArray['COMUNAS'].filter(e=> e.idRegion == region.id), this.form.get('comuna'));    
  }
  changeComunas():void{
    this.filterRegulado.init([], this.form.get('regulado'));   
    this.filterEstacion.init([], this.form.get('estacion')); 
    if (this.form.get('comuna').value == null){
      return;  
    }
    let comuna:any = this.form.get('comuna').value;
    this.baseService.consultaReguladosYEstaciones({idComuna: comuna.id}, null).subscribe((result:any)=>{

      this.filterRegulado.init(this.hsArray['regulados'] = result['regulados'], this.form.get('regulado'));    
      this.filterEstacion.init(this.hsArray['estaciones'] = result['estaciones'], this.form.get('estacion'));    

    });
  }
  changeRegulado():void{
    this.filterRegulado.init(this.hsArray['estaciones'], this.form.get('estacion'));    
    if (this.form.get('regulado').value == null){
      return;  
    }
    let regulado:any = this.form.get('regulado').value;
    this.filterEstacion.init(regulado.estaciones, this.form.get('estacion'));    
  }  
  changeEstacion():void{
    let estacion:any = this.form.get('estacion').value;
    if (!estacion){
      return;
    }
    this.form.get('regulado').setValue(this.hsArray['regulados'].find(e=> e.id === estacion.idRegulado));
  }
  getAnaliticas():any[]{
    var result:any[] = [];
    this.analitica.forEach(e=>{
      result.push(this.hsAnaliticas[e]);
    });
    
    return result;
  }
  getFecha(property:string){
    let fecha:any = this.form.get(property).value;
    if (fecha){
      return fecha.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    return null;
  }
  searchItem():void
  {    
    this.search.emit({inicio: this.getFecha('inicio')
                    , termino: this.getFecha('termino')
                    , estacion: this.form.get('estacion').value
                    , baseDatos: this.form.get('baseDato').value
                    , tipoDato: this.form.get('tipoDato').value
                    , fuente: this.form.get('fuente').value
                    , analitica: this.getAnaliticas()});
  }

}
