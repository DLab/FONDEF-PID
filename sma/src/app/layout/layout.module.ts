import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BackdropModule } from '../../@fury/shared/backdrop/backdrop.module';
import { LoadingIndicatorModule } from '../../@fury/shared/loading-indicator/loading-indicator.module';
import { MaterialModule } from '../../@fury/shared/material-components.module';
import { FooterModule } from './footer/footer.module';
import { LayoutComponent } from './layout.component';
import { QuickpanelModule } from './quickpanel/quickpanel.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ConfigPanelModule } from './config-panel/config-panel.module';
import { FurySharedModule } from '../../@fury/fury-shared.module';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    LoadingIndicatorModule,
    FurySharedModule,

    // Core
    ToolbarModule,
    QuickpanelModule,
    SidenavModule,
    FooterModule,
    BackdropModule,
    ConfigPanelModule,
    NavigationModule
  ],
  declarations: [LayoutComponent]
})
export class LayoutModule {
}
