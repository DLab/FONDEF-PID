import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[furyPageLayout],fury-page-layout',
  host: {
    class: 'fury-page-layout'
  }
})
export class PageLayoutDirective {

  @Input() mode: 'card' | 'simple' = 'simple';

  constructor() { }

  @HostBinding('class.fury-page-layout-card')
  get isCard() {
    return this.mode === 'card';
  }

  @HostBinding('class.fury-page-layout-simple')
  get isSimple() {
    return this.mode === 'simple';
  }

}
