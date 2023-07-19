import { TabItemListComponent } from './tab-item-list/tab-item-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabListComponent } from './tab-list.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { ScrollbarModule } from 'src/@fury/shared/scrollbar/scrollbar.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';

@NgModule({
  imports: [
    CommonModule
    , FurySharedModule
    , ScrollbarModule
    , MaterialModule
  ],
  declarations: [TabListComponent, TabItemListComponent],
  exports:[TabListComponent]
})
export class TabListModule { }
