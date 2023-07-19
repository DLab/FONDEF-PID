import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CambioDeClaveModule } from 'src/app/pages/authentication/cambio-de-clave/cambio-de-clave.module';
import { LanguageModule } from 'src/app/pages/components/language/language.module';
import { FuryCardModule } from '../../../@fury/shared/card/card.module';
import { ClickOutsideModule } from '../../../@fury/shared/click-outside/click-outside.module';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ScrollbarModule } from '../../../@fury/shared/scrollbar/scrollbar.module';
import { ToolbarFullscreenToggleComponent } from './toolbar-fullscreen-toggle/toolbar-fullscreen-toggle.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { ToolbarQuickpanelToggleComponent } from './toolbar-quickpanel-toggle/toolbar-quickpanel-toggle.component';
import { ToolbarSearchBarComponent } from './toolbar-search-bar/toolbar-search-bar.component';
import { ToolbarSearchComponent } from './toolbar-search/toolbar-search.component';
import { ToolbarSidenavMobileToggleComponent } from './toolbar-sidenav-mobile-toggle/toolbar-sidenav-mobile-toggle.component';
import { ToolbarUserComponent } from './toolbar-user/toolbar-user.component';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ScrollbarModule,
    ClickOutsideModule,
    FuryCardModule,
    LanguageModule,
    FormsModule,
    ReactiveFormsModule,
    CambioDeClaveModule
  ],
  declarations: [
    ToolbarComponent,
    ToolbarUserComponent,
    ToolbarNotificationsComponent,
    ToolbarSearchComponent,
    ToolbarSearchBarComponent,
    ToolbarQuickpanelToggleComponent,
    ToolbarFullscreenToggleComponent,
    ToolbarSidenavMobileToggleComponent
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {
}
