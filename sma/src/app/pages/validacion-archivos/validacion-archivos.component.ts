import { BaseService } from 'src/app/base.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { global } from 'src/globals/global';
import { FilterList } from 'src/app/utils/filter-list';

@Component({
  selector: 'app-validacion-archivos',
  templateUrl: './validacion-archivos.component.html',
  styleUrls: ['./validacion-archivos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidacionArchivosComponent implements OnInit {

  app:any = global;
  form: FormGroup;

  filterTipoArchivo:FilterList = new FilterList();
  
  multiplesParametros:any = {codigoPadre: ['TIPOS_DE_ARCHIVO']};

  constructor(private baseService: BaseService
    , private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      tipoArchivo: [{value: null, disabled: false}]
    });    

    this.filterTipoArchivo.init([], this.form.get('tipoArchivo'));    
    this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{

      this.filterTipoArchivo.init(result['TIPOS_DE_ARCHIVO'], this.form.get('tipoArchivo'));    
    });

  }
  getParameters(){
    return {codigoBaseDatos: this.form.get('tipoArchivo').value.codigo};
  }
  isFormOk():Boolean{
    return this.form && this.form.valid;
  }
}
