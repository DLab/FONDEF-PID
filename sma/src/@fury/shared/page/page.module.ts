import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDirective } from './page.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PageDirective],
  exports: [PageDirective]
})
export class PageModule {
}
