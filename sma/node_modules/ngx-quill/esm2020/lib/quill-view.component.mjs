import { isPlatformServer } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation, SecurityContext } from '@angular/core';
import { getFormat } from './helpers';
import * as i0 from "@angular/core";
import * as i1 from "./quill.service";
import * as i2 from "@angular/platform-browser";
export class QuillViewComponent {
    constructor(elementRef, renderer, zone, service, domSanitizer, platformId) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.zone = zone;
        this.service = service;
        this.domSanitizer = domSanitizer;
        this.platformId = platformId;
        this.sanitize = false;
        this.strict = true;
        this.customModules = [];
        this.customOptions = [];
        this.preserveWhitespace = false;
        this.onEditorCreated = new EventEmitter();
        this.valueSetter = (quillEditor, value) => {
            const format = getFormat(this.format, this.service.config.format);
            let content = value;
            if (format === 'text') {
                quillEditor.setText(content);
            }
            else {
                if (format === 'html') {
                    if (this.sanitize) {
                        value = this.domSanitizer.sanitize(SecurityContext.HTML, value);
                    }
                    content = quillEditor.clipboard.convert(value);
                }
                else if (format === 'json') {
                    try {
                        content = JSON.parse(value);
                    }
                    catch (e) {
                        content = [{ insert: value }];
                    }
                }
                quillEditor.setContents(content);
            }
        };
    }
    ngOnChanges(changes) {
        if (!this.quillEditor) {
            return;
        }
        if (changes.content) {
            this.valueSetter(this.quillEditor, changes.content.currentValue);
        }
    }
    async ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Quill = await this.service.getQuill();
        const modules = Object.assign({}, this.modules || this.service.config.modules);
        modules.toolbar = false;
        this.customOptions.forEach((customOption) => {
            const newCustomOption = Quill.import(customOption.import);
            newCustomOption.whitelist = customOption.whitelist;
            Quill.register(newCustomOption, true);
        });
        this.customModules.forEach(({ implementation, path }) => {
            Quill.register(path, implementation);
        });
        let debug = this.debug;
        if (!debug && debug !== false && this.service.config.debug) {
            debug = this.service.config.debug;
        }
        let formats = this.formats;
        if (!formats && formats === undefined) {
            formats = this.service.config.formats ?
                Object.assign({}, this.service.config.formats) : (this.service.config.formats === null ? null : undefined);
        }
        const theme = this.theme || (this.service.config.theme ? this.service.config.theme : 'snow');
        this.elementRef.nativeElement.insertAdjacentHTML('afterbegin', this.preserveWhitespace ? '<pre quill-view-element></pre>' : '<div quill-view-element></div>');
        this.editorElem = this.elementRef.nativeElement.querySelector('[quill-view-element]');
        this.zone.runOutsideAngular(() => {
            this.quillEditor = new Quill(this.editorElem, {
                debug: debug,
                formats: formats,
                modules,
                readOnly: true,
                strict: this.strict,
                theme
            });
        });
        this.renderer.addClass(this.editorElem, 'ngx-quill-view');
        if (this.content) {
            this.valueSetter(this.quillEditor, this.content);
        }
        // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
        // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
        if (!this.onEditorCreated.observers.length) {
            return;
        }
        // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
        // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
        // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
        requestAnimationFrame(() => {
            this.onEditorCreated.emit(this.quillEditor);
        });
    }
}
QuillViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillViewComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i1.QuillService }, { token: i2.DomSanitizer }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
QuillViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: QuillViewComponent, selector: "quill-view", inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", formats: "formats", sanitize: "sanitize", strict: "strict", content: "content", customModules: "customModules", customOptions: "customOptions", preserveWhitespace: "preserveWhitespace" }, outputs: { onEditorCreated: "onEditorCreated" }, usesOnChanges: true, ngImport: i0, template: `
`, isInline: true, styles: [".ql-container.ngx-quill-view{border:0}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillViewComponent, decorators: [{
            type: Component,
            args: [{
                    encapsulation: ViewEncapsulation.None,
                    selector: 'quill-view',
                    styles: [`
.ql-container.ngx-quill-view {
  border: 0;
}
`],
                    template: `
`
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i1.QuillService }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { format: [{
                type: Input
            }], theme: [{
                type: Input
            }], modules: [{
                type: Input
            }], debug: [{
                type: Input
            }], formats: [{
                type: Input
            }], sanitize: [{
                type: Input
            }], strict: [{
                type: Input
            }], content: [{
                type: Input
            }], customModules: [{
                type: Input
            }], customOptions: [{
                type: Input
            }], preserveWhitespace: [{
                type: Input
            }], onEditorCreated: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcXVpbGwvc3JjL2xpYi9xdWlsbC12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUlsRCxPQUFPLEVBRUwsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFFTixXQUFXLEVBR1gsaUJBQWlCLEVBRWpCLGVBQWUsRUFDaEIsTUFBTSxlQUFlLENBQUE7QUFHdEIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQTs7OztBQWVuQyxNQUFNLE9BQU8sa0JBQWtCO0lBa0I3QixZQUNTLFVBQXNCLEVBQ25CLFFBQW1CLEVBQ25CLElBQVksRUFDWixPQUFxQixFQUNyQixZQUEwQixFQUNMLFVBQWU7UUFMdkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ0wsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQWxCdkMsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUNoQixXQUFNLEdBQUcsSUFBSSxDQUFBO1FBRWIsa0JBQWEsR0FBbUIsRUFBRSxDQUFBO1FBQ2xDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQTtRQUNsQyx1QkFBa0IsR0FBRyxLQUFLLENBQUE7UUFFekIsb0JBQWUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQWNqRSxnQkFBVyxHQUFHLENBQUMsV0FBc0IsRUFBRSxLQUFVLEVBQU8sRUFBRTtZQUN4RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUE7WUFDbkIsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO2dCQUNyQixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzdCO2lCQUFNO2dCQUNMLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtvQkFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtxQkFDaEU7b0JBQ0QsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2lCQUMvQztxQkFBTSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7b0JBQzVCLElBQUk7d0JBQ0YsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7cUJBQzVCO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLE9BQU8sR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7cUJBQzlCO2lCQUNGO2dCQUNELFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDakM7UUFDSCxDQUFDLENBQUE7SUF0QkUsQ0FBQztJQXdCSixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsT0FBTTtTQUNQO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO1NBQ2pFO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlO1FBQ25CLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLE9BQU07U0FDUDtRQUVELGdFQUFnRTtRQUNoRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM5RSxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUV2QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQzFDLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3pELGVBQWUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQTtZQUNsRCxLQUFLLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxjQUFjLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBRTtZQUNwRCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUN0QyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDdEIsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUMxRCxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1NBQ2xDO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUMxQixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDckMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzdHO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUU1RixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FDOUMsWUFBWSxFQUNaLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUM5RixDQUFBO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQzNELHNCQUFzQixDQUNSLENBQUE7UUFFaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUM1QyxLQUFLLEVBQUUsS0FBWTtnQkFDbkIsT0FBTyxFQUFFLE9BQWM7Z0JBQ3ZCLE9BQU87Z0JBQ1AsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixLQUFLO2FBQ04sQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUE7UUFFekQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDakQ7UUFFRCw2SEFBNkg7UUFDN0gscUhBQXFIO1FBQ3JILElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDMUMsT0FBTTtTQUNQO1FBRUQsK0dBQStHO1FBQy9HLGdJQUFnSTtRQUNoSSwyRkFBMkY7UUFDM0YscUJBQXFCLENBQUMsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7OytHQWpJVSxrQkFBa0IsbUpBd0JuQixXQUFXO21HQXhCVixrQkFBa0Isb1lBSG5CO0NBQ1g7MkZBRVksa0JBQWtCO2tCQVg5QixTQUFTO21CQUFDO29CQUNULGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsTUFBTSxFQUFFLENBQUM7Ozs7Q0FJVixDQUFDO29CQUNBLFFBQVEsRUFBRTtDQUNYO2lCQUNBOzswQkF5QkksTUFBTTsyQkFBQyxXQUFXOzRDQXZCWixNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUVJLGVBQWU7c0JBQXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IFF1aWxsVHlwZSBmcm9tICdxdWlsbCdcbmltcG9ydCB7IFF1aWxsTW9kdWxlcyB9IGZyb20gJy4vcXVpbGwtZWRpdG9yLmludGVyZmFjZXMnXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIE9uQ2hhbmdlcyxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgU2VjdXJpdHlDb250ZXh0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbmltcG9ydCB7IEN1c3RvbU9wdGlvbiwgQ3VzdG9tTW9kdWxlIH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuaW50ZXJmYWNlcydcbmltcG9ydCB7Z2V0Rm9ybWF0fSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgeyBRdWlsbFNlcnZpY2UgfSBmcm9tICcuL3F1aWxsLnNlcnZpY2UnXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdxdWlsbC12aWV3JyxcbiAgc3R5bGVzOiBbYFxuLnFsLWNvbnRhaW5lci5uZ3gtcXVpbGwtdmlldyB7XG4gIGJvcmRlcjogMDtcbn1cbmBdLFxuICB0ZW1wbGF0ZTogYFxuYFxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBmb3JtYXQ/OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJ1xuICBASW5wdXQoKSB0aGVtZT86IHN0cmluZ1xuICBASW5wdXQoKSBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIEBJbnB1dCgpIGRlYnVnPzogJ3dhcm4nIHwgJ2xvZycgfCAnZXJyb3InIHwgZmFsc2VcbiAgQElucHV0KCkgZm9ybWF0cz86IHN0cmluZ1tdIHwgbnVsbFxuICBASW5wdXQoKSBzYW5pdGl6ZSA9IGZhbHNlXG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWVcbiAgQElucHV0KCkgY29udGVudDogYW55XG4gIEBJbnB1dCgpIGN1c3RvbU1vZHVsZXM6IEN1c3RvbU1vZHVsZVtdID0gW11cbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXVxuICBASW5wdXQoKSBwcmVzZXJ2ZVdoaXRlc3BhY2UgPSBmYWxzZVxuXG4gIEBPdXRwdXQoKSBvbkVkaXRvckNyZWF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcXVpbGxFZGl0b3IhOiBRdWlsbFR5cGVcbiAgZWRpdG9yRWxlbSE6IEhUTUxFbGVtZW50XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgc2VydmljZTogUXVpbGxTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogYW55LFxuICApIHt9XG5cbiAgdmFsdWVTZXR0ZXIgPSAocXVpbGxFZGl0b3I6IFF1aWxsVHlwZSwgdmFsdWU6IGFueSk6IGFueSA9PiB7XG4gICAgY29uc3QgZm9ybWF0ID0gZ2V0Rm9ybWF0KHRoaXMuZm9ybWF0LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdClcbiAgICBsZXQgY29udGVudCA9IHZhbHVlXG4gICAgaWYgKGZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICBxdWlsbEVkaXRvci5zZXRUZXh0KGNvbnRlbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmb3JtYXQgPT09ICdodG1sJykge1xuICAgICAgICBpZiAodGhpcy5zYW5pdGl6ZSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnQgPSBxdWlsbEVkaXRvci5jbGlwYm9hcmQuY29udmVydCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb250ZW50ID0gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnRlbnQgPSBbeyBpbnNlcnQ6IHZhbHVlIH1dXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHF1aWxsRWRpdG9yLnNldENvbnRlbnRzKGNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmNvbnRlbnQpIHtcbiAgICAgIHRoaXMudmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgY2hhbmdlcy5jb250ZW50LmN1cnJlbnRWYWx1ZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxuICAgIGNvbnN0IFF1aWxsID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldFF1aWxsKClcblxuICAgIGNvbnN0IG1vZHVsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm1vZHVsZXMgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5tb2R1bGVzKVxuICAgIG1vZHVsZXMudG9vbGJhciA9IGZhbHNlXG5cbiAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBuZXdDdXN0b21PcHRpb24gPSBRdWlsbC5pbXBvcnQoY3VzdG9tT3B0aW9uLmltcG9ydClcbiAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgfSlcblxuICAgIHRoaXMuY3VzdG9tTW9kdWxlcy5mb3JFYWNoKCh7aW1wbGVtZW50YXRpb24sIHBhdGh9KSA9PiB7XG4gICAgICBRdWlsbC5yZWdpc3RlcihwYXRoLCBpbXBsZW1lbnRhdGlvbilcbiAgICB9KVxuXG4gICAgbGV0IGRlYnVnID0gdGhpcy5kZWJ1Z1xuICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgIGRlYnVnID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5kZWJ1Z1xuICAgIH1cblxuICAgIGxldCBmb3JtYXRzID0gdGhpcy5mb3JtYXRzXG4gICAgaWYgKCFmb3JtYXRzICYmIGZvcm1hdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9ybWF0cyA9IHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA/XG4gICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cykgOiAodGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID09PSBudWxsID8gbnVsbCA6IHVuZGVmaW5lZClcbiAgICB9XG4gICAgY29uc3QgdGhlbWUgPSB0aGlzLnRoZW1lIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICdhZnRlcmJlZ2luJyxcbiAgICAgIHRoaXMucHJlc2VydmVXaGl0ZXNwYWNlID8gJzxwcmUgcXVpbGwtdmlldy1lbGVtZW50PjwvcHJlPicgOiAnPGRpdiBxdWlsbC12aWV3LWVsZW1lbnQ+PC9kaXY+J1xuICAgIClcblxuICAgIHRoaXMuZWRpdG9yRWxlbSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnW3F1aWxsLXZpZXctZWxlbWVudF0nXG4gICAgKSBhcyBIVE1MRWxlbWVudFxuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICAgIGRlYnVnOiBkZWJ1ZyBhcyBhbnksXG4gICAgICAgIGZvcm1hdHM6IGZvcm1hdHMgYXMgYW55LFxuICAgICAgICBtb2R1bGVzLFxuICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdCxcbiAgICAgICAgdGhlbWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lZGl0b3JFbGVtLCAnbmd4LXF1aWxsLXZpZXcnKVxuXG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgdGhpcy52YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmNvbnRlbnQpXG4gICAgfVxuXG4gICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24uIFRoZXJlJ3Mgbm8gc2Vuc2UgdG8gaW52b2tlIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBhbnlvbmUgaXNcbiAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGBvbkVkaXRvckNyZWF0ZWRgIGV2ZW50IGluc2lkZSB0aGUgdGVtcGxhdGUsIGZvciBpbnN0YW5jZSBgPHF1aWxsLXZpZXcgKG9uRWRpdG9yQ3JlYXRlZCk9XCIuLi5cIj5gLlxuICAgIGlmICghdGhpcy5vbkVkaXRvckNyZWF0ZWQub2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHdpbGwgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBgb25FZGl0b3JDcmVhdGVkYCB3aWxsIGFsc28gY2FsbCBgbWFya0RpcnR5KClgXG4gICAgLy8gaW50ZXJuYWxseSwgc2luY2UgQW5ndWxhciB3cmFwcyB0ZW1wbGF0ZSBldmVudCBsaXN0ZW5lcnMgaW50byBgbGlzdGVuZXJgIGluc3RydWN0aW9uLiBXZSdyZSB1c2luZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICAvLyB0byBwcmV2ZW50IHRoZSBmcmFtZSBkcm9wIGFuZCBhdm9pZCBgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvcmAgZXJyb3IuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmVtaXQodGhpcy5xdWlsbEVkaXRvcilcbiAgICB9KVxuICB9XG59XG4iXX0=