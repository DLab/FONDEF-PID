import { MessageBox, MessageBoxType } from './../../message-box/message.box';
import { BaseService } from 'src/app/base.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { global } from 'src/globals/global';
import { PasswordModel } from '../password-model';

@Component({
  selector: 'darta-cambio-de-clave',
  templateUrl: './cambio-de-clave.component.html',
  styleUrls: ['./cambio-de-clave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CambioDeClaveComponent implements OnInit {

  gl:any = global;
  form: FormGroup;
  passwordModel:PasswordModel;
  newPasswordModel:PasswordModel;
  rePasswordModel:PasswordModel;

  constructor(private dialogRef: MatDialogRef<CambioDeClaveComponent>,
    private fb: FormBuilder,
    private messageBox:MessageBox,
    private cd: ChangeDetectorRef,
    private baseService: BaseService) { 
      
      this.passwordModel = new PasswordModel(cd);
      this.newPasswordModel = new PasswordModel(cd);
      this.rePasswordModel = new PasswordModel(cd);
    } 

  ngOnInit() {
    this.form = this.fb.group({
      password: [{value: null, disabled: false}],
      newPassword: [{value: null, disabled: false}],
      reNewPassword: [{value: null, disabled: false}],
    });
  }

  save() {
    let value:any = {};
    for(var e in this.form.value){
      value[e] = this.form.value[e];
    }
    if (global.passwordUser != value.password){
      this.form.get('password').setErrors({'incorrect': true});
      this.messageBox.showMessageBox(MessageBoxType.Error, global.screen['Clave_ingresada_invalida']);
      return;
    }
    if (value.newPassword != value.reNewPassword){
      this.form.get('newPassword').setErrors({'incorrect': true});
      this.form.get('reNewPassword').setErrors({'incorrect': true});
      this.messageBox.showMessageBox(MessageBoxType.Error, global.screen['La_confirmacion_de_la_nueva_clave_es_invalida']); 
      return;
    }
    value.user = global.user;
    this.baseService.changePassword({user: value, showResponseText:true}).subscribe((resp:any)=>{
      global.passwordUser = resp.password;
      this.messageBox.showMessageBox(MessageBoxType.Success, global.screen['Cambio_de_clave_exitoso']);
      this.dialogRef.close(value);
    });
  }  

}
