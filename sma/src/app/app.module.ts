import { ValidacionArchivosModule } from './pages/validacion-archivos/validacion-archivos.module';
import { CodigoModule } from './utils/codigo/codigo.module';
import { CustomMatPaginatorIntl } from './utils/CustomMatPaginatorIntl';
import { DateFormatModule } from './utils/date-format/date-format.module';
import { FocusFormatModule } from './utils/focus-format/focus-formet.module';
import { NumberFormatModule } from './utils/number-format/number-format.module';
import { RutFormatModule } from './utils/rut-format/rut-format.module';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Touch functionality of Material Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PendingInterceptorModule } from '../@fury/shared/loading-indicator/pending-interceptor.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BaseService } from './base.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { CustomNgxDatetimeAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from './utils/CustomNgxDatetimeAdapter';
import { MessageBox } from './pages/message-box/message.box';
import { QuestionModule } from './pages/message-box/question/question.module';
import { WaitMessageModule } from './pages/message-box/wait-message/wait-message.module';
import { ToastrModule } from 'ngx-toastr';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const CUSTOM_DATE_FORMATS_HM: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

registerLocaleData(localeEs, 'es');


@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Fury Core Modules
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,

    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ToastrModule.forRoot(),
    QuestionModule,
    WaitMessageModule,
    NgxMatNativeDateModule,
    RutFormatModule,
    NumberFormatModule,
    FocusFormatModule,
    DateFormatModule,
    CodigoModule,
    LeafletModule,
    ValidacionArchivosModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      } as MatSnackBarConfig
    },
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS_HM },
    BaseService,
    MessageBox
  ]
})
export class AppModule {
}
