import { NumberFormatModule } from 'src/app/utils/number-format/number-format.module';
import { ListMantenedorModule } from './list-mantenedor/list-mantenedor.module';
import { FiltroMantenedorModule } from './filtro-mantenedor/filtro-mantenedor.module';
import { MantenedorBaseComponent } from './mantenedor-base.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from 'src/@fury/fury-shared.module';

@NgModule({
  imports: [
      CommonModule
    , MaterialModule
    , FurySharedModule
    , FiltroMantenedorModule
    , ListMantenedorModule
  ],
  exports: [MantenedorBaseComponent],
  declarations: [MantenedorBaseComponent]
})
export class MantenedorBaseModule { }
