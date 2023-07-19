import { TiposDeArchivoEditModule } from './tipos-de-archivo-edit/tipos-de-archivo-edit.module';
import { MantenedorBaseModule } from '../../mantenedor-base/mantenedor-base.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiposDeArchivoComponent } from './tipos-de-archivo.component';
import { TiposDeArchivoRoutingModule } from './tipos-de-archivo-routing.module';

@NgModule({
  imports: [
      CommonModule,
      MantenedorBaseModule,
      TiposDeArchivoRoutingModule,
      TiposDeArchivoEditModule
  ],
  declarations: [TiposDeArchivoComponent]
})
export class TiposDeArchivoModule { }
