import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackdropDirective } from './backdrop.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BackdropDirective],
  exports: [BackdropDirective]
})
export class BackdropModule {
}
