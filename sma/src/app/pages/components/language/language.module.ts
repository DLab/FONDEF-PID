import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { BaseService } from 'src/app/base.service';
import { LanguageComponent } from './language.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ], 
  declarations: [LanguageComponent],
  exports: [LanguageComponent],
  providers: [BaseService, NgSelectComponent]
})
export class LanguageModule {
}
