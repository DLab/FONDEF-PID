import { ListModule } from 'src/@fury/shared/list/list.module';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { MantenedorBaseModule } from '../../mantenedor-base/mantenedor-base.module';

@NgModule({
  imports: [
    CommonModule
    , ReactiveFormsModule
    , MaterialModule
    , FormsModule
    , RolesRoutingModule
    , FurySharedModule
    , MantenedorBaseModule
    , ListModule
  ],
  declarations: [RolesComponent, RolesEditComponent]
})
export class RolesModule { }
