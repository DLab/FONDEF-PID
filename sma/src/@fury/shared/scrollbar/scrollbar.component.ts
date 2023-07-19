import { AfterContentInit, Component, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import SimpleBar from 'simplebar/dist/simplebar-core.esm';
import { Options } from 'simplebar';

@Component({
  selector: 'fury-scrollbar',
  template: `
    <ng-content></ng-content>`,
  styleUrls: ['./scrollbar.component.scss'],
  host: {
    class: 'fury-scrollbar'
  },
})
export class ScrollbarComponent implements AfterContentInit, OnDestroy {

  @Input() options: Partial<Options>;

  scrollbarRef: SimpleBar;

  constructor(private _element: ElementRef,
              private zone: NgZone) {
  }

  ngAfterContentInit() {
    this.zone.runOutsideAngular(() => {
      this.scrollbarRef = new SimpleBar(this._element.nativeElement, this.options);
    });
  }

  ngOnDestroy(): void {
    /**
     * Exists, but not typed in the type definition
     * https://github.com/Grsmto/simplebar/blob/master/packages/simplebar/src/simplebar.js#L903
     */
    if (this.scrollbarRef && (this.scrollbarRef as any).unMount) {
      (this.scrollbarRef as any).unMount();
    }
  }
}
