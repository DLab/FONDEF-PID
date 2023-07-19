import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuryCardModule } from '../../../../../@fury/shared/card/card.module';
import { MaterialModule } from '../../../../../@fury/shared/material-components.module';
import { RealtimeUsersWidgetComponent } from './realtime-users-widget.component';
import { ScrollbarModule } from '../../../../../@fury/shared/scrollbar/scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    FuryCardModule,
    ScrollbarModule
  ],
  declarations: [RealtimeUsersWidgetComponent],
  exports: [RealtimeUsersWidgetComponent]
})
export class RealtimeUsersWidgetModule {
}
