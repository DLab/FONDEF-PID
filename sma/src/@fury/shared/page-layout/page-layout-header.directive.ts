import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPageLayoutHeader],fury-page-layout-header',
  host: {
    class: 'fury-page-layout-header'
  }
})
export class PageLayoutHeaderDirective {

  constructor() { }

}

