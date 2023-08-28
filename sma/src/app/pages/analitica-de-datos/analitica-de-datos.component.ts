import { DetalleAnaliticaDeDatosComponent } from './detalle-analitica-de-datos/detalle-analitica-de-datos.component';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { global } from 'src/globals/global';
import { FiltrosPorEstacionComponent } from '../filtros-por-estacion/filtros-por-estacion.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analitica-de-datos',
  templateUrl: './analitica-de-datos.component.html',
  styleUrls: ['./analitica-de-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnaliticaDeDatosComponent implements OnInit, AfterViewInit {

  app:any = global;
  title:string;
  esProyeccion:boolean
  hsArray:any  = {};

  @ViewChild('graph', { static: true }) graph: DetalleAnaliticaDeDatosComponent;
  @ViewChild('filtros', { static: true }) filtros: FiltrosPorEstacionComponent;

  constructor(actRoute: ActivatedRoute) { 
    this.title = actRoute.snapshot.data.title;
    this.esProyeccion = actRoute.snapshot.data.esProyeccion;
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    console.log(this.filtros, this.graph)
    this.graph.hsAnaliticas = this.filtros.hsAnaliticas;
  }

  search(event):void
  {
    this.graph.search(event);
  }



}
