import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [QuestionComponent]
})
export class QuestionModule { }
