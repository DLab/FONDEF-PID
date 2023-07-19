import { formatNumber } from '@angular/common';
import { Directive, ElementRef, Input, HostListener, Optional } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { global } from 'src/globals/global';
import { FormatBaseDirective } from '../format-base.directive';

export function getFormatNumber(value:any, decimales:number):string{
  if (value === '' || value == null){
    return value;
  }
  let val:number;
  if (typeof value == 'string'){
    value = value.replace(global.numberCleanRegExp, '');
    if (global.sepDecimal == ','){
      value = value.replace(',', '.');
    }
    val = parseFloat(value);
  }
  else{
    val = value;
  }
  if (decimales == undefined){
    decimales = 0;
  }
  return formatNumber(val, global.currentLocale, '0.' + decimales + '-' + decimales);
}

export function getParseNumber(value:string):number{
  if (value == ''){
    return null;
  }
  if (typeof value != 'string'){
    return value;
  }
  value = value.replace(global.numberCleanRegExp, '');
  if (global.sepDecimal == ','){
    value = value.replace(',', '.');
  }
  return parseFloat(value);
}


@Directive({
  selector: 'input[numberFormat]',
  exportAs: 'numberFormat',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: NumberFormatDirective}]
})
export class NumberFormatDirective extends FormatBaseDirective {

  private isLostFocus:boolean;
  private decimales:number = 0;
  @Input('numberFormat') set _decimales(value:number){
    this.decimales = value;
    if (this._value){
      this.onBlur();
    }

  };
  @Input() negativos:boolean = false;


  constructor(public elementRef: ElementRef<HTMLInputElement>
            , @Optional() ngModel:NgModel | null
            , @Optional() public ngControl:NgControl) {
    super(elementRef, ngModel, ngControl);
    elementRef.nativeElement.style['textAlign'] = 'right';
  }

  @Input('value')
  set value(value: any | null) {
    super.value = value;
    this.formatValue(value);

  }
  private formatValue(value: any | null) {
    if (value) {
      this.elementRef.nativeElement.value = getFormatNumber(value, this.decimales);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }
  private _unformat(value:string){
    return value.replace(/\./gi, '');
  }
  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value.replace(/\./gi, '');
    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value:any) {
    if (this.isLostFocus){
      return;
    }
    super.onInput(value);
    if (value == null){
      this._value = value;
    }
    else{
      this._value = value.replace(global.numberCleanRegExp, '');
      if (this._value.length > 0 && this._value.charAt(this._value.length - 1) == '-'){
        if (this._value.charAt(0) == '-'){
          this._value = this._value.slice(1, this._value.length -1);
        }
        else{
          this._value = '-' + this._value.slice(0, -1);
        }
      }
    }
    if (this.ngModel){
      this.ngModel.viewToModelUpdate(this._value);
    }
    this.elementRef.nativeElement.value = this._value;
  }

  @HostListener('blur')
  onBlur() {
    this.formatValue(this._value);
    this.isLostFocus = true;
    if (this.ngControl && this.ngControl.control){
      this.ngControl.control.setValue(this.elementRef.nativeElement.value == '' ? null : this.elementRef.nativeElement.value);
    }
    if (this.ngModel){
      this.ngModel.viewToModelUpdate(this._unformat(this.elementRef.nativeElement.value ));
    }

  }

  @HostListener('focus')
  onFocus() {
    this.isLostFocus = false;
    this.unFormatValue(); // remove commas for editing purpose
  }

  @HostListener('keypress', ['$event'])
  onKeypress(event:KeyboardEvent) {
    let key:string = event.key;
    if ((key >= '0' && key <= '9') || (key == global.sepDecimal && this.decimales > 0 && (this._value == null || this._value.indexOf(key) == -1)) || event.code == 'KeyV' || (this.negativos && key == '-')){
      return true;
    }
    event.preventDefault();
    return false;
  }

}
