import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageBox, MessageBoxType } from './pages/message-box/message.box';
import { global } from 'src/globals/global';

@Injectable()
export class BaseService {

  http:   HttpClient;
  url = environment.backend;

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
        , 'Accept': 'application/json'
    })
  };



  constructor(@Inject(HttpClient) http: HttpClient
            , private messageBox: MessageBox) {
    this.http   = http;
  }

  private getStringify(params:any):string{
    delete params.hsArray;
    delete params.searchResult;
    if (typeof(params.semilla) != 'string'){
      delete params.semilla;
    }
    params.datosUsuario = global.datosUsuario;
    return JSON.stringify(params);
  }
  private getErrorMsg(error:HttpErrorResponse, defaultMsg:string):string{
    if (error.status == 500)
    {
      let msg:string = error.error == null || (error.error instanceof Blob) ? error.statusText : error.error;
      if (msg.startsWith('Duplicate entry')){
        console.error('error de llave duplicada:', msg);
        return 'Registro_ya_existe';
      }
      else if (msg.startsWith('Internal Server Error') || msg.startsWith('Unknown column') || msg.endsWith('where clause is ambiguous')){
        return defaultMsg ? defaultMsg : 'Error_Interno_del_Servidor';
      }

      return msg;
    }
    else if (error.status == 403){
      return 'Tiempo_exedido_de_espera';
    }
    else if (error.status == 401){
      return 'Por_favor_conectese_nuevamente';
    }
    return error.message ? error.message :  error.error == null ? error.statusText : error.error;
  }
  protected handleError(error: HttpErrorResponse, msg?:string) {
    console.log('error', error)
      this.messageBox.showMessageBox(MessageBoxType.Error, this.traslateParam(this.getErrorMsg(error, msg)));
    return throwError(error);
  }
  traslateParam(param:string)
  {
    var msg = global.screen[param.replace(/ /g, '_')];
    return msg == undefined ? param : msg;
  }

  stopLoading(observable:Observable<Object>):Observable<Object>{
    return new Observable<Object>(observer=>{
        observable.subscribe(data=>{
          global.loading.emit('loading', 'end');
          observer.next(data);
      })
    });
  }

  uploadFile(file: File): Observable<Object>{
    const formData: FormData = new FormData();
    formData.append('file', file);
    if (file['additionalData']){
      formData. append('additionalData', file['additionalData']);
      delete file['additionalData'];
    }

    global.loading.emit('loading', 'start');
    const request = new HttpRequest('POST', this.url + '/service/restServices/uploadFile', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.stopLoading(this.http.request(request)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  exportToFile(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/exportToExcel', this.getStringify(params), {headers: this.httpOptions.headers, responseType: 'blob' as 'json' })
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  setCurrentUser(params:Object): Observable<Object>{
    return this.http.post(this.url + '/service/restServices/setCurrentUser', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              }));
  }

  changePassword(params:Object): Observable<Object>{
    return this.http.post(this.url + '/service/restServices/changePassword', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              }));
  }

  consultarMultiplesParametros(params:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultarMultiplesParametros', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  obtieneCondicionesIniciales(): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.get(this.url + '/service/restServices/obtieneCondicionesIniciales', this.httpOptions)
      .pipe(catchError(error=>{
        return this.handleError(error);
      })));
  }

  getCurrentUser(): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.get(this.url + '/service/restServices/getCurrentUser', this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  getScreen(lang:string): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.get(this.url + '/service/restServices/getScreen?lang=' + lang, this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  consultarUsuarios(): Observable<Object>{
    return this.stopLoading(this.http.get(this.url + '/service/restServices/consultarUsuarios', this.httpOptions, )
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  eliminarUsuario(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/eliminarUsuario', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  guardarUsuario(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/guardarUsuario', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  consultarRoles(): Observable<Object>{
    return this.stopLoading(this.http.get(this.url + '/service/restServices/consultarRoles', this.httpOptions, )
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  obtenerAccionesxFuncionRol(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/obtenerAccionesxFuncionRol', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  eliminarRol(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/eliminarRol', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  guardarRol(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/guardarRol', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }



  waitForProcess(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/waitForProcess', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));

  }

  consultaDetalleRol(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultaDetalleRol', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }

  validaArchivo(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/validaArchivo', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  
  getAnaliticaDeDatos(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/getAnaliticaDeDatos', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }

  getPrediccionIA(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/getPrediccionIA', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  getUnidadesMedicion(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/getUnidadesMedicion', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  
  consultaRegulados(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultaRegulados', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  
  consultaEstaciones(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultaEstaciones', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  consultaReguladosYEstaciones(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultaReguladosYEstaciones', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  consultarTiposDeArchivo(): Observable<Object>{
    return this.stopLoading(this.http.get(this.url + '/service/restServices/consultarTiposDeArchivo', this.httpOptions, )
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  consultaDetalleTiposDeArchivo(params:Object, errorFn:any): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/consultaDetalleTiposDeArchivo', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                errorFn();
                return this.handleError(error);
              })));
  }
  guardarTiposDeArchivo(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/guardarTiposDeArchivo', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  eliminarTiposDeArchivo(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/eliminarTiposDeArchivo', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  
  changeClasificacionBiodiversidad(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/changeClasificacionBiodiversidad', this.getStringify(params), this.httpOptions)
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));
  }
  
  downloadAnalisis(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/downloadAnalisis', this.getStringify(params), {headers: this.httpOptions.headers, responseType: 'blob' as 'json' })
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));

  }
  
  downloadDespliegueTerritorial(params:Object): Observable<Object>{
    global.loading.emit('loading', 'start');
    return this.stopLoading(this.http.post(this.url + '/service/restServices/downloadDespliegueTerritorial', this.getStringify(params), {headers: this.httpOptions.headers, responseType: 'blob' as 'json' })
              .pipe(catchError(error=>{
                return this.handleError(error);
              })));

  }
}








