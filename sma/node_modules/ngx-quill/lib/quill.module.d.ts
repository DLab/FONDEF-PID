import { ModuleWithProviders } from '@angular/core';
import { QuillConfig } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
import * as i1 from "./quill-editor.component";
import * as i2 from "./quill-view.component";
import * as i3 from "./quill-view-html.component";
import * as i4 from "@angular/common";
export declare class QuillModule {
    static forRoot(config?: QuillConfig): ModuleWithProviders<QuillModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<QuillModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<QuillModule, [typeof i1.QuillEditorComponent, typeof i2.QuillViewComponent, typeof i3.QuillViewHTMLComponent], [typeof i4.CommonModule], [typeof i1.QuillEditorComponent, typeof i2.QuillViewComponent, typeof i3.QuillViewHTMLComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<QuillModule>;
}
