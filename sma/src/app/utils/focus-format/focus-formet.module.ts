import { FocusFormatDirective } from './focus-format.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [	FocusFormatDirective],
  exports: [FocusFormatDirective]
})
export class FocusFormatModule {
}
