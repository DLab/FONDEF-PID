import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { default as hljs } from 'highlight.js/lib/core';
import { default as typescript } from 'highlight.js/lib/languages/typescript';
import { default as xml } from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('typescript', typescript);

@Directive({
  selector: 'code[furyHighlight]'
})
export class HighlightDirective implements AfterViewInit {

  constructor(private elem: ElementRef) {
  }

  ngAfterViewInit() {
    hljs.highlightBlock(this.elem.nativeElement);
  }

}
