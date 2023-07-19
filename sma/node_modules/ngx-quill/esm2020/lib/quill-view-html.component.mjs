import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./quill.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/platform-browser";
export class QuillViewHTMLComponent {
    constructor(sanitizer, service) {
        this.sanitizer = sanitizer;
        this.service = service;
        this.content = '';
        this.sanitize = false;
        this.innerHTML = '';
        this.themeClass = 'ql-snow';
    }
    ngOnChanges(changes) {
        if (changes.theme) {
            const theme = changes.theme.currentValue || (this.service.config.theme ? this.service.config.theme : 'snow');
            this.themeClass = `ql-${theme} ngx-quill-view-html`;
        }
        else if (!this.theme) {
            const theme = this.service.config.theme ? this.service.config.theme : 'snow';
            this.themeClass = `ql-${theme} ngx-quill-view-html`;
        }
        if (changes.content) {
            const content = changes.content.currentValue;
            this.innerHTML = this.sanitize ? content : this.sanitizer.bypassSecurityTrustHtml(content);
        }
    }
}
QuillViewHTMLComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillViewHTMLComponent, deps: [{ token: DomSanitizer }, { token: i1.QuillService }], target: i0.ɵɵFactoryTarget.Component });
QuillViewHTMLComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: QuillViewHTMLComponent, selector: "quill-view-html", inputs: { content: "content", theme: "theme", sanitize: "sanitize" }, usesOnChanges: true, ngImport: i0, template: `
  <div class="ql-container" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`, isInline: true, styles: [".ql-container.ngx-quill-view-html{border:0}\n"], directives: [{ type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillViewHTMLComponent, decorators: [{
            type: Component,
            args: [{
                    encapsulation: ViewEncapsulation.None,
                    selector: 'quill-view-html',
                    styles: [`
.ql-container.ngx-quill-view-html {
  border: 0;
}
`],
                    template: `
  <div class="ql-container" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`
                }]
        }], ctorParameters: function () { return [{ type: i3.DomSanitizer, decorators: [{
                    type: Inject,
                    args: [DomSanitizer]
                }] }, { type: i1.QuillService }]; }, propDecorators: { content: [{
                type: Input
            }], theme: [{
                type: Input
            }], sanitize: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy1odG1sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLXZpZXctaHRtbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBWSxNQUFNLDJCQUEyQixDQUFBO0FBR2xFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFHTCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUE7Ozs7O0FBaUJ0QixNQUFNLE9BQU8sc0JBQXNCO0lBUWpDLFlBQ2dDLFNBQXVCLEVBQzNDLE9BQXFCO1FBREQsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMzQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBVHhCLFlBQU8sR0FBRyxFQUFFLENBQUE7UUFFWixhQUFRLEdBQUcsS0FBSyxDQUFBO1FBRXpCLGNBQVMsR0FBYSxFQUFFLENBQUE7UUFDeEIsZUFBVSxHQUFHLFNBQVMsQ0FBQTtJQUtuQixDQUFDO0lBRUosV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNqQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1RyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sS0FBSyxzQkFBc0IsQ0FBQTtTQUNwRDthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7WUFDNUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLEtBQUssc0JBQXNCLENBQUE7U0FDcEQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUE7WUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDM0Y7SUFDSCxDQUFDOzttSEF6QlUsc0JBQXNCLGtCQVN2QixZQUFZO3VHQVRYLHNCQUFzQixrSkFQdkI7Ozs7O0NBS1g7MkZBRVksc0JBQXNCO2tCQWZsQyxTQUFTO21CQUFDO29CQUNULGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixNQUFNLEVBQUUsQ0FBQzs7OztDQUlWLENBQUM7b0JBQ0EsUUFBUSxFQUFFOzs7OztDQUtYO2lCQUNBOzswQkFVSSxNQUFNOzJCQUFDLFlBQVk7dUVBUmIsT0FBTztzQkFBZixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5pbXBvcnQgeyBRdWlsbFNlcnZpY2UgfSBmcm9tICcuL3F1aWxsLnNlcnZpY2UnXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdxdWlsbC12aWV3LWh0bWwnLFxuICBzdHlsZXM6IFtgXG4ucWwtY29udGFpbmVyLm5neC1xdWlsbC12aWV3LWh0bWwge1xuICBib3JkZXI6IDA7XG59XG5gXSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInFsLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cInRoZW1lQ2xhc3NcIj5cbiAgICA8ZGl2IGNsYXNzPVwicWwtZWRpdG9yXCIgW2lubmVySFRNTF09XCJpbm5lckhUTUxcIj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsVmlld0hUTUxDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBjb250ZW50ID0gJydcbiAgQElucHV0KCkgdGhlbWU/OiBzdHJpbmdcbiAgQElucHV0KCkgc2FuaXRpemUgPSBmYWxzZVxuXG4gIGlubmVySFRNTDogU2FmZUh0bWwgPSAnJ1xuICB0aGVtZUNsYXNzID0gJ3FsLXNub3cnXG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChEb21TYW5pdGl6ZXIpIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLnRoZW1lKSB7XG4gICAgICBjb25zdCB0aGVtZSA9IGNoYW5nZXMudGhlbWUuY3VycmVudFZhbHVlIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcbiAgICAgIHRoaXMudGhlbWVDbGFzcyA9IGBxbC0ke3RoZW1lfSBuZ3gtcXVpbGwtdmlldy1odG1sYFxuICAgIH0gZWxzZSBpZiAoIXRoaXMudGhlbWUpIHtcbiAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdydcbiAgICAgIHRoaXMudGhlbWVDbGFzcyA9IGBxbC0ke3RoZW1lfSBuZ3gtcXVpbGwtdmlldy1odG1sYFxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jb250ZW50KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gY2hhbmdlcy5jb250ZW50LmN1cnJlbnRWYWx1ZVxuICAgICAgdGhpcy5pbm5lckhUTUwgPSB0aGlzLnNhbml0aXplID8gY29udGVudCA6IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGNvbnRlbnQpXG4gICAgfVxuICB9XG59XG4iXX0=