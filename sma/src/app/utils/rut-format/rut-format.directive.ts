import { Directive, ElementRef, Input, HostListener, AfterViewInit, Optional } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { element } from 'protractor';
import { FormatBaseDirective } from '../format-base.directive';

export function getRut(value:string):string{
  let rut:string = formatRut(unFormatValue(value));
  return rut == '' ? null : rut;
}
function unFormatValue(value:string):string {
  if (value && value.length > 2)
  {
    return value.replace(/\./gi, '').replace(/\-/, '');
  }
  return value ? value : '';
}  
function formatRut(value:string):string{
  let len:number = value.length;
  if (len < 2){
    return value;
  }
  let dif = 11 - len;
  if (dif > 0){
    value = Array(dif).join(' ') + value;
  }
  let result = '';
  for(var i = 0; i < 3; i++){
    let r = value.slice(i * 3, i * 3 + 3);  
    if (r != '   '){
      result = result + (result != '' ? '.' : '') + r.trim();
    }
  }
  result = result + '-' + value.slice(9, 10);  
  return result;    
}

@Directive({
  selector: 'input[rutFormat]',
  exportAs: 'rutFormat',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: RutFormatDirective}]
})
export class RutFormatDirective extends FormatBaseDirective{

  private isPasteValue:boolean = false;
  private isLost:boolean = false;

  constructor(public elementRef: ElementRef<HTMLInputElement>
    , @Optional() ngModel:NgModel | null
    , @Optional() public ngControl:NgControl | null) {
    super(elementRef, ngModel, ngControl)
    elementRef.nativeElement.maxLength = 10;
  }

  @Input('value') 
  set value(value: string | null) {
    super.value = value;
    this.formatValue(unFormatValue(value));
  }
  private formatValue(value: string | null) {
    if (value !== null) { 
      this.elementRef.nativeElement.value = formatRut(value);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }
  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = this._value = unFormatValue(value);
  }  
  @HostListener('input', ['$event.target.value'])
  onInput(value:string) {
    if (this.isLost){
      return;
    }
    super.onInput(value);
    if (this.isPasteValue)
    {
      this.elementRef.nativeElement.maxLength = 10;
      this.isPasteValue = false;
    }
    this._value = value;
    this.elementRef.nativeElement.value = this._value = unFormatValue(value);
  }
  @HostListener('paste', ['$event'])
  _onPaste(event:ClipboardEvent) {
    this.elementRef.nativeElement.maxLength = 12;
    this.isPasteValue = true;
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue(this._value);
    this.isLost = true;
    if (this.ngModel){
      this.ngModel.viewToModelUpdate(this.elementRef.nativeElement.value == '' ? null : this.elementRef.nativeElement.value );
    }
    if (this.ngControl && this.ngControl.control){
      this.ngControl.control.setValue(this.elementRef.nativeElement.value == '' ? null : this.elementRef.nativeElement.value);
    }
    this.isLost = false;
  }

  @HostListener('focus')
  onFocus() {
    this.unFormatValue(); 
  } 

  @HostListener('keypress', ['$event'])
  onKeypress(event:KeyboardEvent) {
    let value:string = event.target['value'];
    if (value != '' && value.endsWith('K'))
    {
      event.preventDefault();
      return false;
    }
    let key:string = event.key;
    if ((key >= '0' && key <= '9') || key == 'K' || key == 'k' || event.code == 'KeyV'){
      return true;
    }
    event.preventDefault();
    return false;
  }
}
