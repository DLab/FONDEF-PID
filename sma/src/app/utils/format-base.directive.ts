import { NgControl, NgModel } from '@angular/forms';
import { Directive, ElementRef, AfterViewInit, Input, HostListener, Optional, OnInit } from '@angular/core';

export const BACKSPACE:number = 8;

@Directive({
  selector: '[dartaFormatBase]'
})
export class FormatBaseDirective implements AfterViewInit, OnInit{

  _value: string | null;
  private hasInput:boolean;
  constructor(public elementRef: ElementRef<HTMLInputElement>, @Optional() public ngModel:NgModel | null, @Optional() public ngControl:NgControl | null) {
    this.hasInput = false;
  }
  ngOnInit(): void {
    if (this.elementRef.nativeElement.value != null){
      this.value = this.elementRef.nativeElement.value;
    }
  }

  ngAfterViewInit(): void {
    var value :any = (this.ngModel && this.ngModel.model) ||  (this.ngControl && this.ngControl.control.value);
    if (value){
      setTimeout(() => {
        this.initValue(value);
        }, 100);
    }
  }
  initValue(value:any){
    this.value = value;
  }
  get value(): string | null {
    return this._value;
  }

  @Input('value')
  set value(value: string | null) {
    this._value = value;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value:string) {
    this.hasInput = true;
  }

  @HostListener('ngModelChange', ['$event'])
  ngModelChange(value: any) {
    if (!this.hasInput){
      this.onInput(value);
    }
    this.hasInput = false;
  }

}
