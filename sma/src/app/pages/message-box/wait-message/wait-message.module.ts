import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitMessageComponent } from './wait-message.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [WaitMessageComponent]
})
export class WaitMessageModule { }
