import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodigoDirective } from './codigo.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [	CodigoDirective],
  exports: [CodigoDirective]
})
export class CodigoModule {
}
