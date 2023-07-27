import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { global } from 'src/globals/global';

@Component({
  selector: 'app-filtros-por-estacion-popup',
  templateUrl: './filtros-por-estacion-popup.component.html',
  styleUrls: ['./filtros-por-estacion-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FiltrosPorEstacionPopupComponent implements OnInit {
  app:any = global;
  form:FormGroup;
  analitica:any[] = [];
  _analiticas:any[];

  @Input() title:string;
  @Input() subTitle:string;
  @Input() inicio:Date;
  @Input() termino:Date;
  @Input() esProyeccion:Date;
  @Input() analiticas:any[];
  @Input() hsAnaliticas:any;

  @Output() search:EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder) { 
  }

  ngOnInit() {
    this.form = this.fb.group({
      inicio: [{value: this.inicio, disabled: false}]
    , termino: [{value: this.termino, disabled: false}]
    });    
    console.log(this.analiticas, this.esProyeccion)
    this._analiticas = [];
    this.analiticas.forEach(e=>{
      if (e.esProyeccion == this.esProyeccion)
        this._analiticas.push(e)
    })
  }

  getAnaliticas():any[]{
    var result:any[] = [];
    this.analitica.forEach(e=>{
      result.push(this.hsAnaliticas[e]);
    });
    
    return result;
  }
  isValid(){
    return this.analitica.length > 0;
  }
  getFecha(property:string){
    let fecha:any = this.form.get(property).value;
    if (fecha){
      if (!fecha.format)
        fecha = moment(fecha, 'YYYY-MM-DD HH:mm:ss')
      return fecha.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    return null;
  }

  searchItem(){
    this.search.emit({inicio: this.getFecha('inicio')
                    , termino: this.getFecha('termino')
                    , analitica: this.getAnaliticas()});

  }

}
