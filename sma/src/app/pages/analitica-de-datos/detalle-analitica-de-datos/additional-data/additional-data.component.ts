import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { FilterList } from 'src/app/utils/filter-list';
import { global } from 'src/globals/global';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {

  app:any = global;
  form: FormGroup;
  items:any[];

  filterTipoDato:FilterList;
  tipoDatos:any[];
  tipoDatoProperty:string;
  initTipoDato:boolean;
  multiplesParametros:any = {codigoPadre: ['PARAMETROS']};
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any
          , private dialogRef: MatDialogRef<AdditionalDataComponent>
          , private fb: FormBuilder
          , private baseService: BaseService) { 
    this.items = data.items;
  }

  ngOnInit() {
    let fields: any = {};
    this.initTipoDato = false;
    this.items.forEach(item=>{
      item.additionalData.forEach(e => {
        fields[e.name] = [{value: e.defaultValue, disabled: false}];
        if (e.type == 'parametro') {
          this.tipoDatoProperty = e.name;
          this.baseService.consultarMultiplesParametros(this.multiplesParametros).subscribe((result:any)=>{
            this.tipoDatos = result['PARAMETROS'].filter(e=> e.codigoBaseDato == item.codigoBaseDato);
            this.initializeTipoDato();
          });
        }
      });
    })
    this.form = this.fb.group(fields);   
    if (this.tipoDatoProperty){
      this.filterTipoDato = new FilterList();
      this.filterTipoDato.init([], this.form.get(this.tipoDatoProperty));      
      this.initializeTipoDato();     
    }
    else{
      this.initTipoDato = true;
    }
  }
  initializeTipoDato(){
    if (this.initTipoDato || !this.form || !this.tipoDatos){
      return;
    }
    this.initTipoDato = true;
    this.filterTipoDato.init(this.tipoDatos, this.form.get(this.tipoDatoProperty));    
  }
  isFormValid()
  {
    return this.initTipoDato && this.form.valid;
  }

  accept()
  {
    let data:any = this.form.value;
    let result:any[] = [];
    this.items.forEach(item=>{
      let ritem:any[] = [];
      result.push(ritem);
      item.additionalData.forEach(e => {
        let value:any = data[e.name]
        if (e.type == 'number' && typeof(value) == 'string'){
          if (e.decimals > 0){
            value = value.replace(',', '.')
          }
          value = Number(value)
        }
        else if (e.type == 'parametro'){
          if (value['codigo'])
            value = value['codigo'];
        }
        e.defaultValue = value;
        ritem.push(value)
      });
    });
    this.dialogRef.close(result);
  }
}
