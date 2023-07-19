import { DateFormatDirective } from './date-format.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatBaseModule } from '../format-base.module';

@NgModule({
  imports: [
    CommonModule
    , FormatBaseModule
  ],
  declarations: [	DateFormatDirective],
  exports: [DateFormatDirective]
})
export class DateFormatModule {
}
