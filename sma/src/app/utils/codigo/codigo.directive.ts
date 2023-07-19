import { NgControl, NgModel } from '@angular/forms';
import { Directive, ElementRef, Input, HostListener, Optional, HostBinding, AfterViewInit, OnInit } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { BACKSPACE, FormatBaseDirective } from '../format-base.directive';
import * as moment from 'moment';

const DEAD:number = 229;
@Directive({
  selector: 'input[codigo]',
  exportAs: 'codigo',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: CodigoDirective}]

})
export class CodigoDirective extends FormatBaseDirective{

  private isLostFocus:boolean = false;
  private lastKeyDown:number;

  constructor(public elementRef: ElementRef<HTMLInputElement>, @Optional() ngModel: NgModel | null, @Optional() public ngControl:NgControl) {
    super(elementRef, ngModel, ngControl);
  }


  @HostListener('input', ['$event.target.value'])
  onInput(value:string) {

    if (this.isLostFocus){
      return;
    }
    super.onInput(value);
    // here we cut any non numerical symbols
    if (value.length > 0 && this.lastKeyDown != BACKSPACE){
      let reg = /[`´^¨]/
      value = value.toUpperCase().replace(reg, '');
    }
    this._value = value;
    this.elementRef.nativeElement.value = this._value;
    if (this.ngModel){
      this.ngModel.viewToModelUpdate(value);
    }
    else{
      this.ngControl.control.setValue(value);
    }

  }

  @HostListener('keydown', ['$event'])
  onKeydown(event:KeyboardEvent) {
    this.lastKeyDown = event.keyCode;
  }

  @HostListener('keypress', ['$event'])
  onKeypress(event:KeyboardEvent) {
    let key:string = event.key;
    if ((key != 'ñ' && key != 'Ñ') &&
         ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z') || (key >= '0' && key <= '9') || (key == '_' || event.keyCode == BACKSPACE))){
      return true;
    }
    event.preventDefault();
    return false;
  }

}
