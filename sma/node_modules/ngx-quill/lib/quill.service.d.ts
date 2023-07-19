import { Injector } from '@angular/core';
import { QuillConfig } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
export declare class QuillService {
    config: QuillConfig;
    private Quill;
    private $importPromise;
    private count;
    private document;
    constructor(injector: Injector, config: QuillConfig);
    getQuill(): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<QuillService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<QuillService>;
}
