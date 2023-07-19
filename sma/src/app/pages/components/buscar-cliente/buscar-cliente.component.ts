import { getRut } from 'src/app/utils/rut-format/rut-format.directive';
import { MessageBox, MessageBoxType } from './../../message-box/message.box';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { global } from 'src/globals/global';
import { Invoker } from 'src/app/utils/invoker';

@Component({
  selector: 'fury-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.scss']
})
export class BuscarClienteComponent implements OnInit {

  gl:any = global;
  form: FormGroup;
  clienteValido:boolean = false;
  descripcionCliente:string;
  validationFunction:Invoker;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
            private dialogRef: MatDialogRef<BuscarClienteComponent>,
            private fb: FormBuilder,
            private baseService: BaseService,
            private messageBox: MessageBox) { 
      if (data){
        this.validationFunction = data.validationFunction;
      }
  }


  ngOnInit() {
    this.form = this.fb.group({
      idCliente: [{value: null, disabled: false}],
      descripcionCliente: [{value: null, disabled: true}]
    });
  }
  isFormValid():boolean {
    return this.form.valid && this.clienteValido;
  }  

  idClienteChange(){
    let idCliente:string = getRut(this.form.get('idCliente').value);
    if (idCliente == null){
      this.form.get('descripcionCliente').setValue(null);
      return;
    }
    this.baseService.consultaFicha({idCliente: idCliente, esUnitaria: true}).subscribe((data:any)=>{
        var list = data.listData;
        if (list.length == 0)
        {
            this.clienteValido = false;
            this.form.get('descripcionCliente').setValue(null);
            this.form.get('idCliente').setErrors({'incorrect': true});
            this.messageBox.showMessageBox(MessageBoxType.Error, global.screen['Por_favor_ingrese_un_Identificador_de_Cliente_valido']);
            return;
        }
        this.clienteValido = true;
        this.form.get('descripcionCliente').setValue(this.descripcionCliente = list[0].descripcionCliente);
        
    });  
  }

  accept(){
    var value:any = this.form.value;
    value.descripcionCliente = this.descripcionCliente;
    value.idCliente = getRut(value.idCliente);
    if (this.validationFunction)
    {
      if (!this.validationFunction.invokeFunction(value))
      {
        return;
      }
    }
    this.dialogRef.close(this.form.value);
  }

}
