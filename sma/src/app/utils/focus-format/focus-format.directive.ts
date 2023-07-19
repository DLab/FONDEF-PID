import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focusFormat]',
  exportAs: 'rutFormat',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: FocusFormatDirective}]
})
export class FocusFormatDirective {

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    elementRef.nativeElement.style['border-bottom-color'] = '#aaa';
    elementRef.nativeElement.style['border-bottom-style'] = 'inherit';
    elementRef.nativeElement.style['border-bottom-width'] = '1px';
  }
  @HostListener('blur')
  _onBlur() {
    this.elementRef.nativeElement.style['border-bottom-color'] = '#aaa';
  }

  @HostListener('focus')
  onFocus() {
    this.elementRef.nativeElement.style['border-bottom-color'] = '#1976d2';
  } 


}
