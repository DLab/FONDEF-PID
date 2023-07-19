import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPageLayoutContent],fury-page-layout-content',
  host: {
    class: 'fury-page-layout-content'
  }
})
export class PageLayoutContentDirective {

  constructor() { }

}
