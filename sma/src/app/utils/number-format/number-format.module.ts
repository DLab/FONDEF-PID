import { NumberFormatDirective } from './number-format.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatBaseModule } from '../format-base.module';

@NgModule({
  imports: [
    CommonModule
    , FormatBaseModule
  ],
  declarations: [	NumberFormatDirective],
  exports: [NumberFormatDirective]
})
export class NumberFormatModule {
}
