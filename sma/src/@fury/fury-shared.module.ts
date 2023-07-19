import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadcrumbsModule } from './shared/breadcrumbs/breadcrumbs.module';
import { TitleModule } from './shared/title/title.module';
import { PageModule } from './shared/page/page.module';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PageLayoutModule } from './shared/page-layout/page-layout.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    BreadcrumbsModule,
    TitleModule,
    PageModule,
    SidebarModule,
    RouterModule,
    PageLayoutModule,

    // External
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule,
    FontAwesomeModule,
    ScrollingModule
  ]
})
export class FurySharedModule {
}
