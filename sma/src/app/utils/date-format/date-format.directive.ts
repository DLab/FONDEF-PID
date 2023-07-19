import { NgControl, NgModel } from '@angular/forms';
import { Directive, ElementRef, Input, HostListener, Optional, HostBinding } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { global } from 'src/globals/global';
import { BACKSPACE, FormatBaseDirective } from '../format-base.directive';
import { formatDate } from '@angular/common';
import * as moment from 'moment';


export function getLastDatePreviousMonth()
{
  return moment(moment().format('YYYYMM') + '01T00:00:00', ', "YYYY-MM-DD[T]HH:mm:ss"').subtract(1, 'seconds');
}
export function getFirstDatePreviousMonth()
{
  return moment(moment().format('YYYYMM') + '01T00:00:00', ', "YYYY-MM-DD[T]HH:mm:ss"').subtract(1, 'months');
}

export function formatDateObject(obj:any, properties:string[]){
  properties.forEach((prop:string)=>{
    let value:any = obj[prop];

    if (value){
      if (!value['format']){
        value = moment(value);
      }
      obj[prop] = value.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
  });
  return obj;
}

export function parseDateObject(obj:any, properties:string[]){
  properties.forEach((prop:string)=>{
    let value:any = obj[prop];
    if (value){
      if (!value['format']){
        obj[prop] = moment(value, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      }
    }
  });
  return obj;
}

@Directive({
  selector: 'input[dateFormat]',
  exportAs: 'dateFormat',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: DateFormatDirective}]

})
export class DateFormatDirective extends FormatBaseDirective{

  private caracteresEspeciales:string[];
  private largos:number[];
  private _format:string;
  private lastKeyDown:number;
  private isLostFocus:boolean = false;

  @Input('dateFormat') set format(value:string){
    this._format = value;
    var len:number = this._format.length;

    this.elementRef.nativeElement.placeholder = this._format.toUpperCase();
    this.elementRef.nativeElement.maxLength = len;
    this.caracteresEspeciales = [];
    this.largos = [];
    var n:number = 0;
    for(var i = 0; i < len; i++){
      var c:string = this._format.charAt(i);
      if (c == '/' || c == ' ' || c == ':'){
        this.caracteresEspeciales.push(c);
        this.largos.push(n);
      }
      n++;
    }
    this.largos.push(n);
  }
  @Input() parseDate:boolean = false;

  constructor(public elementRef: ElementRef<HTMLInputElement>, @Optional() ngModel: NgModel | null, @Optional() public ngControl:NgControl) {
    super(elementRef, ngModel, ngControl);
  }

  initValue(value:any){

    try{

      var date:any = typeof(value) === 'string' && value.indexOf('/') != -1 ? moment(value, this._format) : moment(value);
      this.value = date.format(this._format);
      this.elementRef.nativeElement.value = this._value;
      if (this.ngModel && this.parseDate && this._value && this._value != ''){
        this.isLostFocus = true;
        this.ngModel.viewToModelUpdate(date.format());
        this.isLostFocus = false;
      }

    }catch(error){
    }
  }
  @HostBinding('class') elementClass = 'date-format';

  @HostListener('input', ['$event.target.value'])
  onInput(value:string) {

    if (this.isLostFocus){
      return;
    }
    super.onInput(value);
    // here we cut any non numerical symbols
    if (value.length > 0 && this.lastKeyDown != BACKSPACE){
      var len:number = value.length;
      var c:string = value.charAt(value.length - 1);
      if (this.caracteresEspeciales.indexOf(c) == -1){
        for(var i = 0; i < this.largos.length; i++){
          var n = this.largos[i];
          if (n == len && i < this.caracteresEspeciales.length){
            value = value + this.caracteresEspeciales[i];
            break;
          }

        }
      }
    }
    this._value = value;
    this.elementRef.nativeElement.value = this._value;
  }

  @HostListener('blur')
  _onBlur() {
    if (this.ngModel && this.parseDate && this._value && this._value != ''){
      this.isLostFocus = true;
      var date = moment(this._value, this._format);
      this.ngModel.viewToModelUpdate(date.format());
      this.isLostFocus = false;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event:KeyboardEvent) {
    this.lastKeyDown = event.keyCode;
  }

  @HostListener('keypress', ['$event'])
  onKeypress(event:KeyboardEvent) {
    let key:string = event.key;
    if ((key >= '0' && key <= '9') || event.code == 'KeyV' || this.caracteresEspeciales.indexOf(key) != -1){
      return true;
    }
    event.preventDefault();
    return false;
  }

}
