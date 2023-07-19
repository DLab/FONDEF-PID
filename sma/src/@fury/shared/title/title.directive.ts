import { Directive } from '@angular/core';

@Directive({
  selector: '[furyTitle],fury-title',
  host: {
    class: 'fury-title'
  }
})
export class TitleDirective {

  constructor() { }

}
