import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { MantenedorBaseModule } from '../../mantenedor-base/mantenedor-base.module';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';

@NgModule({
  imports: [
    CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , UsuariosRoutingModule
    , FurySharedModule
    , MantenedorBaseModule
  ],
  declarations: [UsuariosComponent, UsuariosEditComponent]
})
export class UsuariosModule { }
