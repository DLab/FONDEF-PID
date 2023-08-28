import { ValidacionArchivosComponent } from './pages/validacion-archivos/validacion-archivos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaMasivaType } from 'src/globals/global';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/authentication/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/authentication/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'presentacion',
        loadChildren: () => import('./pages/presentacion/presentacion.module').then(m => m.PresentacionModule)
      },
      {
        path: 'administracion/usuarios',
        loadChildren: () => import('./pages/administracion/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'administracion/roles',
        loadChildren: () => import('./pages/administracion/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'parametros/tipos_archivo',
        loadChildren: () => import('./pages/parametros/tipos-de-archivo/tipos-de-archivo.module').then(m => m.TiposDeArchivoModule)
      },
      {
        path: 'procesos/validacion_archivos',
        data:{title: 'Validacion_Archivos'
            , processMethodName: 'validaArchivo'
            , cargaMasivaType: CargaMasivaType
            , uploadFileType: 'xlsx'
            , filterClassName: ValidacionArchivosComponent
            , loadNumRegistrosAProcesar: 'Consulta_Registros_a_procesar'
            , msgWaitProcess: 'Aviso_Procesando_registro'
            , msgResultadoCargaMasiva: 'Proceso_de_Carga_Masiva_realizado_con_exito'
            , variablesMsgResultadoCarga: ['resultadoOk', 'resultadoNOk']
            , variableProcesoConErrores: 'conError'
            , variableMsgErrores: 'msgError'
            , columns: [
              { name: 'TipoError', property: 'tipo', visible: true, isModelProperty: true }
            , { name: 'Hoja', property: 'hoja', visible: true, isModelProperty: true }
            , { name: 'Fila', property: 'fila', visible: true, isModelProperty: true }
            , { name: 'Campo', property: 'campo', visible: true, isModelProperty: true }
            , { name: 'Parametro', property: 'parametro', visible: true, isModelProperty: true }
            , { name: 'Error', property: 'descripcion', visible: true, isModelProperty: true }
            ]},
        loadChildren: () => import('./pages/carga-masiva/carga-masiva.module').then(m => m.CargaMasivaModule)
      },
      {
        path: 'procesos/analitica_de_datos',
        data:{title: 'Analitica_de_Datos'
            , esProyeccion: false
        },
        loadChildren: () => import('./pages/analitica-de-datos/analitica-de-datos.module').then(m => m.AnaliticaDeDatosModule)
      },
      {
        path: 'procesos/despliegue_territorial',
        loadChildren: () => import('./pages/despliegue-territorial/despliegue-territorial.module').then(m => m.DespliegueTerritorialModule)
      },
      {
        path: 'procesos/proyecciones_ia',
        data:{title: 'Proyecciones_IA'
            , esProyeccion: true
        },
        loadChildren: () => import('./pages/analitica-de-datos/analitica-de-datos.module').then(m => m.AnaliticaDeDatosModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation:  'enabledNonBlocking',
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
