import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { global, Constantes } from 'src/globals/global';

@Component({
  selector: 'darta-presentacion', 
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PresentacionComponent implements OnInit {

  app:any;
  hasDashBoard:boolean;
  logo:string = environment.customers[environment.selectedCustomer].logo;

  constructor() { 
    global.currentComponent = this;
  }

  ngOnInit() {
    this.app = global;
    this.hasDashBoard = global.hasIdMenu[Constantes.DASHBOARD_ID];
  }

}
