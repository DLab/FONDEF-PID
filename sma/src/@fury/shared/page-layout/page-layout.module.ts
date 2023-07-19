import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutDirective } from './page-layout.directive';
import { PageLayoutHeaderDirective } from './page-layout-header.directive';
import { PageLayoutContentDirective } from './page-layout-content.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PageLayoutDirective, PageLayoutHeaderDirective, PageLayoutContentDirective],
  exports: [PageLayoutDirective, PageLayoutHeaderDirective, PageLayoutContentDirective]
})
export class PageLayoutModule {
}
