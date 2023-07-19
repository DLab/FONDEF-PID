import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatBaseDirective } from './format-base.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [	FormatBaseDirective],
  exports: [FormatBaseDirective]
})
export class FormatBaseModule {
}
