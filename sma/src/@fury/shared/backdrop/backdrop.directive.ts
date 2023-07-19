import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[furyBackdrop],fury-backdrop',
  host: {
    class: 'fury-backdrop'
  },
  exportAs: 'furyBackdrop'
})
export class BackdropDirective {

  @Input()
  @HostBinding('class.visible')
  visible: boolean;

  @HostBinding('class.invisible') invisible: boolean;
  @Output() closed = new EventEmitter();

  constructor() {}

  show() {
    if (!this.visible) {
      this.visible = true;
      this.invisible = false;
    }
  }

  @HostListener('click')
  hide() {
    if (this.visible) {
      this.visible = false;
      this.invisible = false;
      this.closed.emit();
    }
  }

  showInvisible() {
    if (!this.visible) {
      this.visible = true;
      this.invisible = true;
    }
  }
}
