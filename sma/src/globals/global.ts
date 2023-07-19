import { Optional } from '@angular/core';
import { EventEmitter } from "events";

export var global = {
    constants: {},
    screen: {},
    user: null,
    userName: null,
    passwordUser: null,
    selectedMenuItem: null,
    currentLanguage: 'cl',
    currentLocale: 'es-CL',
    accionesxFuncion: null,
    datosUsuario: null,
    numberCleanRegExp: /\./gi,
    sepDecimal: ',',
    acciones: null,
    cliente: null,
    currentComponent: null,
    menues:null,
    hasIdMenu:[],

    //title:' / Darta\u00AE',
    title:' / Darta2.0',
    load: new EventEmitter(),
    loading: new EventEmitter(),

    getScreen : function(key:string, ...vars){
      if (vars.length === 1 && Array.isArray(vars[0]))
      {
        vars = vars[0];
      }
      if (key === '')
      {
        return vars[0];
      }
      let str:string = this.screen[key];
      for(var i in vars){
        const s:string = "{" + i + "}";
        str = str.replace(s, vars[i]);
      }
      return str;
    },

  };


export const Constantes= {
  DASHBOARD_ID: 35,

    visualizaciones: [{codigo: 'line', property: 'Grafico_de_Lineas', descripcion: ''}
                    , {codigo: 'bar', property: 'Grafico_de_Barras', descripcion: ''}
                    , {codigo: 'pie', property: 'Grafico_de_Tortas', descripcion: ''}],


    ambitoInformacion: [{codigo: 'aplicada', property: 'Regla_Negocio_Aplicadas', descripcion: ''}
                    , {codigo: 'noAplicada', property: 'Regla_Negocio_No_Aplicadas', descripcion: ''}],

    diasDeLaSemana: [{codigo:0, descripcion:'', property: 'Dom'},
                      {codigo:1, descripcion:'', property: 'Lun'},
                      {codigo:2, descripcion:'', property: 'Mar'},
                      {codigo:3, descripcion:'', property: 'Mie'},
                      {codigo:4, descripcion:'', property: 'Jue'},
                      {codigo:5, descripcion:'', property: 'Vie'},
                      {codigo:6, descripcion:'', property: 'Sab'},
                      ]

};

export enum CargaMasivaType{
  VALIDACION_ARCHIVO
};

export function initConstants(){
  for(var i in Constantes.diasDeLaSemana){
    Constantes.diasDeLaSemana[i].descripcion = global.screen[Constantes.diasDeLaSemana[i].property];
  }
  for(var i in Constantes.visualizaciones){
    Constantes.visualizaciones[i].descripcion = global.screen[Constantes.visualizaciones[i].property];
  }
  for(var i in Constantes.ambitoInformacion){
    Constantes.ambitoInformacion[i].descripcion = global.screen[Constantes.ambitoInformacion[i].property];
  }

}
