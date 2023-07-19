import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutFormatDirective } from './rut-format.directive';
import { FormatBaseModule } from '../format-base.module';

@NgModule({
  imports: [
    CommonModule
    , FormatBaseModule
  ],
  declarations: [		RutFormatDirective],
  exports: [RutFormatDirective]
})
export class RutFormatModule {
}
