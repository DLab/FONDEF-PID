import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleDirective } from './title.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TitleDirective],
  exports: [TitleDirective]
})
export class TitleModule {
}
