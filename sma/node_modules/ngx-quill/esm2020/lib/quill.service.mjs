import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { defaultModules } from './quill-defaults';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
export class QuillService {
    constructor(injector, config) {
        this.config = config;
        this.count = 0;
        this.document = injector.get(DOCUMENT);
        if (!this.config) {
            this.config = { modules: defaultModules };
        }
    }
    getQuill() {
        this.count++;
        if (!this.Quill && this.count === 1) {
            this.$importPromise = new Promise(async (resolve) => {
                // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
                // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
                // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
                const maybePatchedAddEventListener = this.document.addEventListener;
                // There're 2 types of Angular applications:
                // 1) zone-full (by default)
                // 2) zone-less
                // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
                // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
                // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
                // this means the `zone.js` is not imported.
                // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
                // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.document.addEventListener = this.document['__zone_symbol__addEventListener'] || this.document.addEventListener;
                const quillImport = await import('quill');
                this.document.addEventListener = maybePatchedAddEventListener;
                this.Quill = (quillImport.default ? quillImport.default : quillImport);
                // Only register custom options and modules once
                this.config.customOptions?.forEach((customOption) => {
                    const newCustomOption = this.Quill.import(customOption.import);
                    newCustomOption.whitelist = customOption.whitelist;
                    this.Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning);
                });
                this.config.customModules?.forEach(({ implementation, path }) => {
                    this.Quill.register(path, implementation, this.config.suppressGlobalRegisterWarning);
                });
                resolve(this.Quill);
            });
        }
        return this.$importPromise;
    }
}
QuillService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillService, deps: [{ token: i0.Injector }, { token: QUILL_CONFIG_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
QuillService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [QUILL_CONFIG_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFZLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUV0RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFlLE1BQU0sMkJBQTJCLENBQUE7O0FBSzNFLE1BQU0sT0FBTyxZQUFZO0lBT3ZCLFlBQ0UsUUFBa0IsRUFDNkIsTUFBbUI7UUFBbkIsV0FBTSxHQUFOLE1BQU0sQ0FBYTtRQUw1RCxVQUFLLEdBQUcsQ0FBQyxDQUFBO1FBT2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUE7U0FDMUM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNsRCx5R0FBeUc7Z0JBQ3pHLGtIQUFrSDtnQkFDbEgscUdBQXFHO2dCQUNyRyxNQUFNLDRCQUE0QixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUE7Z0JBQ25FLDRDQUE0QztnQkFDNUMsNEJBQTRCO2dCQUM1QixlQUFlO2dCQUNmLG1IQUFtSDtnQkFDbkgsbUhBQW1IO2dCQUNuSCxtSEFBbUg7Z0JBQ25ILDRDQUE0QztnQkFDNUMsNEhBQTRIO2dCQUM1SCxtSUFBbUk7Z0JBQ25JLDJEQUEyRDtnQkFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQTtnQkFDbkgsTUFBTSxXQUFXLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsNEJBQTRCLENBQUE7Z0JBRTdELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQVEsQ0FBQTtnQkFFN0UsZ0RBQWdEO2dCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtvQkFDbEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUM5RCxlQUFlLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUE7b0JBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO2dCQUN2RixDQUFDLENBQUMsQ0FBQTtnQkFFRixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFFO29CQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtnQkFDdEYsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNyQixDQUFDLENBQUMsQ0FBQTtTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFBO0lBQzVCLENBQUM7O3lHQXpEVSxZQUFZLDBDQVNELGtCQUFrQjs2R0FUN0IsWUFBWSxjQUZYLE1BQU07MkZBRVAsWUFBWTtrQkFIeEIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQVVJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbmltcG9ydCB7IGRlZmF1bHRNb2R1bGVzIH0gZnJvbSAnLi9xdWlsbC1kZWZhdWx0cydcbmltcG9ydCB7IFFVSUxMX0NPTkZJR19UT0tFTiwgUXVpbGxDb25maWcgfSBmcm9tICcuL3F1aWxsLWVkaXRvci5pbnRlcmZhY2VzJ1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBRdWlsbFNlcnZpY2Uge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG4gIHByaXZhdGUgUXVpbGwhOiBhbnlcbiAgcHJpdmF0ZSAkaW1wb3J0UHJvbWlzZSE6IFByb21pc2U8YW55PlxuICBwcml2YXRlIGNvdW50ID0gMFxuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFFVSUxMX0NPTkZJR19UT0tFTikgcHVibGljIGNvbmZpZzogUXVpbGxDb25maWdcbiAgKSB7XG4gICAgdGhpcy5kb2N1bWVudCA9IGluamVjdG9yLmdldChET0NVTUVOVClcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgIHRoaXMuY29uZmlnID0geyBtb2R1bGVzOiBkZWZhdWx0TW9kdWxlcyB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UXVpbGwoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gICAgaWYgKCF0aGlzLlF1aWxsICYmIHRoaXMuY291bnQgPT09IDEpIHtcbiAgICAgIHRoaXMuJGltcG9ydFByb21pc2UgPSBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAvLyBRdWlsbCBhZGRzIGV2ZW50cyBsaXN0ZW5lcnMgb24gaW1wb3J0IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlsbGpzL3F1aWxsL2Jsb2IvZGV2ZWxvcC9jb3JlL2VtaXR0ZXIuanMjTDhcbiAgICAgICAgLy8gV2UnZCB3YW50IHRvIHVzZSB0aGUgdW5wYXRjaGVkIGBhZGRFdmVudExpc3RlbmVyYCBtZXRob2QgdG8gaGF2ZSBhbGwgZXZlbnQgY2FsbGJhY2tzIHRvIGJlIHJ1biBvdXRzaWRlIG9mIHpvbmUuXG4gICAgICAgIC8vIFdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBgem9uZS5qc2AgaXMgdXNlZCBvciBub3QsIGp1c3Qgc2F2ZSB0aGUgdmFsdWUgdG8gcmVzdG9yZSBpdCBiYWNrIGZ1cnRoZXIuXG4gICAgICAgIGNvbnN0IG1heWJlUGF0Y2hlZEFkZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgLy8gVGhlcmUncmUgMiB0eXBlcyBvZiBBbmd1bGFyIGFwcGxpY2F0aW9uczpcbiAgICAgICAgLy8gMSkgem9uZS1mdWxsIChieSBkZWZhdWx0KVxuICAgICAgICAvLyAyKSB6b25lLWxlc3NcbiAgICAgICAgLy8gVGhlIGRldmVsb3BlciBjYW4gYXZvaWQgaW1wb3J0aW5nIHRoZSBgem9uZS5qc2AgcGFja2FnZSBhbmQgdGVsbHMgQW5ndWxhciB0aGF0IGhlL3NoZSBpcyByZXNwb25zaWJsZSBmb3IgcnVubmluZ1xuICAgICAgICAvLyB0aGUgY2hhbmdlIGRldGVjdGlvbiBieSBoaW1zZWxmLiBUaGlzIGlzIGRvbmUgYnkgXCJub29waW5nXCIgdGhlIHpvbmUgdGhyb3VnaCBgQ29tcGlsZXJPcHRpb25zYCB3aGVuIGJvb3RzdHJhcHBpbmdcbiAgICAgICAgLy8gdGhlIHJvb3QgbW9kdWxlLiBXZSBmYWxsYmFjayB0byBgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcmAgaWYgYF9fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXJgIGlzIG5vdCBkZWZpbmVkLFxuICAgICAgICAvLyB0aGlzIG1lYW5zIHRoZSBgem9uZS5qc2AgaXMgbm90IGltcG9ydGVkLlxuICAgICAgICAvLyBUaGUgYF9fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXJgIGlzIGJhc2ljYWxseSBhIG5hdGl2ZSBET00gQVBJLCB3aGljaCBpcyBub3QgcGF0Y2hlZCBieSB6b25lLmpzLCB0aHVzIG5vdCBldmVuIGdvaW5nXG4gICAgICAgIC8vIHRocm91Z2ggdGhlIGB6b25lLmpzYCB0YXNrIGxpZmVjeWNsZS4gWW91IGNhbiBhbHNvIGFjY2VzcyB0aGUgbmF0aXZlIERPTSBBUEkgYXMgZm9sbG93cyBgdGFyZ2V0W1pvbmUuX19zeW1ib2xfXygnbWV0aG9kTmFtZScpXWAuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvZG90LW5vdGF0aW9uXG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9IHRoaXMuZG9jdW1lbnRbJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInXSB8fCB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgY29uc3QgcXVpbGxJbXBvcnQgPSBhd2FpdCBpbXBvcnQoJ3F1aWxsJylcbiAgICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID0gbWF5YmVQYXRjaGVkQWRkRXZlbnRMaXN0ZW5lclxuXG4gICAgICAgIHRoaXMuUXVpbGwgPSAocXVpbGxJbXBvcnQuZGVmYXVsdCA/IHF1aWxsSW1wb3J0LmRlZmF1bHQgOiBxdWlsbEltcG9ydCkgYXMgYW55XG5cbiAgICAgICAgLy8gT25seSByZWdpc3RlciBjdXN0b20gb3B0aW9ucyBhbmQgbW9kdWxlcyBvbmNlXG4gICAgICAgIHRoaXMuY29uZmlnLmN1c3RvbU9wdGlvbnM/LmZvckVhY2goKGN1c3RvbU9wdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IHRoaXMuUXVpbGwuaW1wb3J0KGN1c3RvbU9wdGlvbi5pbXBvcnQpXG4gICAgICAgICAgbmV3Q3VzdG9tT3B0aW9uLndoaXRlbGlzdCA9IGN1c3RvbU9wdGlvbi53aGl0ZWxpc3RcbiAgICAgICAgICB0aGlzLlF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSwgdGhpcy5jb25maWcuc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmcpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jb25maWcuY3VzdG9tTW9kdWxlcz8uZm9yRWFjaCgoe2ltcGxlbWVudGF0aW9uLCBwYXRofSkgPT4ge1xuICAgICAgICAgIHRoaXMuUXVpbGwucmVnaXN0ZXIocGF0aCwgaW1wbGVtZW50YXRpb24sIHRoaXMuY29uZmlnLnN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJlc29sdmUodGhpcy5RdWlsbClcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLiRpbXBvcnRQcm9taXNlXG4gIH1cbn1cbiJdfQ==