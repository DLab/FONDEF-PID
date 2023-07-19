import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { FurySharedModule } from '../../../@fury/fury-shared.module';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';

@NgModule({
  imports: [
    CommonModule,
    FurySharedModule
  ],
  declarations: [NavigationComponent, NavigationItemComponent],
  exports: [NavigationComponent]
})
export class NavigationModule {
}
