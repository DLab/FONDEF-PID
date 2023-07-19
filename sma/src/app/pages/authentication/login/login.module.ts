import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../../@fury/shared/material-components.module';
import { MessageBox } from '../../message-box/message.box';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LanguageModule } from '../../components/language/language.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    LanguageModule,
    ReactiveFormsModule,
  ], 
  declarations: [LoginComponent],
})
export class LoginModule {
}
