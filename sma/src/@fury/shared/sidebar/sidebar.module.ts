import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarDirective } from './sidebar.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarDirective],
  exports: [SidebarDirective]
})
export class SidebarModule {
}
