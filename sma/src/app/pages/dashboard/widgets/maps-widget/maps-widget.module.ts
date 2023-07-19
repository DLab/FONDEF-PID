import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MapsWidgetComponent } from './maps-widget.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  declarations: [MapsWidgetComponent],
  exports: [MapsWidgetComponent]
})
export class MapsWidgetModule {
}
