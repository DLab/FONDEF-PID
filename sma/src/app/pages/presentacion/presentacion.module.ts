import { NgModule } from '@angular/core';
import { PresentacionComponent } from './presentacion.component';
import { CommonModule } from '@angular/common';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { PresentacionRoutingModule } from './presentacion-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FurySharedModule,
    PresentacionRoutingModule,
    MatTabsModule,
  ],
  declarations: [PresentacionComponent]
})
export class PresentacionModule {
}