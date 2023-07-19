import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPanelComponent } from './config-panel.component';
import { FurySharedModule } from '../../../@fury/fury-shared.module';
import { ConfigPanelToggleComponent } from './config-panel-toggle/config-panel-toggle.component';

@NgModule({
  imports: [
    CommonModule,
    FurySharedModule
  ],
  declarations: [ConfigPanelComponent, ConfigPanelToggleComponent],
  exports: [ConfigPanelComponent, ConfigPanelToggleComponent]
})
export class ConfigPanelModule {
}
