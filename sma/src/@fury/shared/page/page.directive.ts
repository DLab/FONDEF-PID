import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPage],fury-page',
  host: {
    class: 'fury-page'
  }
})
export class PageDirective {

  constructor() { }

}
