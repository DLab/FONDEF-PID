import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuillEditorComponent } from './quill-editor.component';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
import { QuillViewHTMLComponent } from './quill-view-html.component';
import { QuillViewComponent } from './quill-view.component';
import * as i0 from "@angular/core";
export class QuillModule {
    static forRoot(config) {
        return {
            ngModule: QuillModule,
            providers: [
                {
                    provide: QUILL_CONFIG_TOKEN,
                    useValue: config
                }
            ]
        };
    }
}
QuillModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
QuillModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillModule, declarations: [QuillEditorComponent,
        QuillViewComponent,
        QuillViewHTMLComponent], imports: [CommonModule], exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent] });
QuillModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: QuillModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        QuillEditorComponent,
                        QuillViewComponent,
                        QuillViewHTMLComponent
                    ],
                    exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXF1aWxsL3NyYy9saWIvcXVpbGwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUM5QyxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUU3RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQWUsTUFBTSwyQkFBMkIsQ0FBQTtBQUMzRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUNwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTs7QUFXM0QsTUFBTSxPQUFPLFdBQVc7SUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFvQjtRQUNqQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFdBQVc7WUFDckIsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLFFBQVEsRUFBRSxNQUFNO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQTtJQUNILENBQUM7O3dHQVhVLFdBQVc7eUdBQVgsV0FBVyxpQkFQcEIsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixzQkFBc0IsYUFHZCxZQUFZLGFBRFosb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCO3lHQUcvRCxXQUFXLFlBRmIsQ0FBQyxZQUFZLENBQUM7MkZBRVosV0FBVztrQkFUdkIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQixrQkFBa0I7d0JBQ2xCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7b0JBQzNFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbmltcG9ydCB7IFF1aWxsRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuY29tcG9uZW50J1xuaW1wb3J0IHsgUVVJTExfQ09ORklHX1RPS0VOLCBRdWlsbENvbmZpZyB9IGZyb20gJy4vcXVpbGwtZWRpdG9yLmludGVyZmFjZXMnXG5pbXBvcnQgeyBRdWlsbFZpZXdIVE1MQ29tcG9uZW50IH0gZnJvbSAnLi9xdWlsbC12aWV3LWh0bWwuY29tcG9uZW50J1xuaW1wb3J0IHsgUXVpbGxWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9xdWlsbC12aWV3LmNvbXBvbmVudCdcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgUXVpbGxFZGl0b3JDb21wb25lbnQsXG4gICAgUXVpbGxWaWV3Q29tcG9uZW50LFxuICAgIFF1aWxsVmlld0hUTUxDb21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1F1aWxsRWRpdG9yQ29tcG9uZW50LCBRdWlsbFZpZXdDb21wb25lbnQsIFF1aWxsVmlld0hUTUxDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBRdWlsbENvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UXVpbGxNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFF1aWxsTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBRVUlMTF9DT05GSUdfVE9LRU4sXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9XG59XG4iXX0=