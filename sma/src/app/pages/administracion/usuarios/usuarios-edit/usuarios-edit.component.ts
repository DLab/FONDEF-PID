import { formatDate } from '@angular/common';
import { BaseService } from 'src/app/base.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { BaseEditComponent } from 'src/app/pages/util/base-edit-component';
import { FilterList } from 'src/app/utils/filter-list';
import { global } from 'src/globals/global';

@Component({
  selector: 'darta-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})
export class UsuariosEditComponent extends BaseEditComponent implements OnInit {

  form: FormGroup;
  filterRoles:FilterList = new FilterList();
  inputType = 'password';
  visible = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
            private dialogRef: MatDialogRef<UsuariosEditComponent>,
            private fb: FormBuilder,
            private baseService: BaseService,
            private cd: ChangeDetectorRef) { 
        
      super(data);

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [{value: this.item.id, disabled: !this.item.isNew}],
      nombre: [{value: this.item.nombre, disabled: !this.item.editable}], 
      password: [{value: this.item.password, disabled: !this.item.editable}],  
      idRol: [{value: this.getItem('idRol', 'id', 'ROLES'), disabled: !this.item.editable}],
    });
    this.filterRoles.init(this.item.hsArray['ROLES'], this.form.get('idRol'));
  }

  save() {
    let value:any = {};
    for(var e in this.form.value){
      value[e] = this.form.value[e];
    }
    let rol:any = value.idRol;    
    value.id = value.id || this.item.id;
    value.isNew = this.item.isNew;
    value.idRol = rol.id;
    value.rol = rol.descripcion;

    this.baseService.guardarUsuario(value).subscribe(result=>{
      this.dialogRef.close(value);
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }


}
