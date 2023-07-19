import { control } from 'leaflet';
import { LeafletControlLayersChanges } from './leaflet-control-layers-changes.model';
export class LeafletControlLayersWrapper {
    constructor(zone, layersControlReady) {
        this.zone = zone;
        this.layersControlReady = layersControlReady;
    }
    getLayersControl() {
        return this.layersControl;
    }
    init(controlConfig, controlOptions) {
        const baseLayers = controlConfig.baseLayers || {};
        const overlays = controlConfig.overlays || {};
        // Create the control outside of angular to ensure events don't trigger change detection
        this.zone.runOutsideAngular(() => {
            this.layersControl = control.layers(baseLayers, overlays, controlOptions);
        });
        this.layersControlReady.emit(this.layersControl);
        return this.layersControl;
    }
    applyBaseLayerChanges(changes) {
        let results = new LeafletControlLayersChanges();
        if (null != this.layersControl) {
            results = this.applyChanges(changes, this.layersControl.addBaseLayer);
        }
        return results;
    }
    applyOverlayChanges(changes) {
        let results = new LeafletControlLayersChanges();
        if (null != this.layersControl) {
            results = this.applyChanges(changes, this.layersControl.addOverlay);
        }
        return results;
    }
    applyChanges(changes, addFn) {
        const results = new LeafletControlLayersChanges();
        if (null != changes) {
            // All layer management is outside angular to avoid layer events from triggering change detection
            this.zone.runOutsideAngular(() => {
                changes.forEachChangedItem((c) => {
                    this.layersControl.removeLayer(c.previousValue);
                    addFn.call(this.layersControl, c.currentValue, c.key);
                    results.layersChanged++;
                });
                changes.forEachRemovedItem((c) => {
                    this.layersControl.removeLayer(c.previousValue);
                    results.layersRemoved++;
                });
                changes.forEachAddedItem((c) => {
                    addFn.call(this.layersControl, c.currentValue, c.key);
                    results.layersAdded++;
                });
            });
        }
        return results;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZmxldC1jb250cm9sLWxheWVycy53cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWxlYWZsZXQvc3JjL2xpYi9sYXllcnMvY29udHJvbC9sZWFmbGV0LWNvbnRyb2wtbGF5ZXJzLndyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLE9BQU8sRUFBa0IsTUFBTSxTQUFTLENBQUM7QUFFbEQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFFckYsTUFBTSxPQUFPLDJCQUEyQjtJQVF2QyxZQUFvQixJQUFZLEVBQUUsa0JBQWdEO1FBQTlELFNBQUksR0FBSixJQUFJLENBQVE7UUFDL0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQzlDLENBQUM7SUFFRCxnQkFBZ0I7UUFDZixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksQ0FBQyxhQUFrQixFQUFFLGNBQW1CO1FBRTNDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBRTlDLHdGQUF3RjtRQUN4RixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWpELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUMzQixDQUFDO0lBRUQscUJBQXFCLENBQUMsT0FBdUM7UUFDNUQsSUFBSSxPQUFPLEdBQWdDLElBQUksMkJBQTJCLEVBQUUsQ0FBQztRQUU3RSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQy9CLE9BQU8sR0FBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUVELG1CQUFtQixDQUFDLE9BQXVDO1FBQzFELElBQUksT0FBTyxHQUFnQyxJQUFJLDJCQUEyQixFQUFFLENBQUM7UUFFN0UsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUMvQixPQUFPLEdBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyRTtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFTyxZQUFZLENBQUMsT0FBdUMsRUFBRSxLQUEyQztRQUN4RyxNQUFNLE9BQU8sR0FBZ0MsSUFBSSwyQkFBMkIsRUFBRSxDQUFDO1FBRS9FLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtZQUVwQixpR0FBaUc7WUFDakcsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBRWhDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEQsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN6QixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RELE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7WUFFSixDQUFDLENBQUMsQ0FBQztTQUVIO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztDQUVEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBLZXlWYWx1ZUNoYW5nZXMsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBjb250cm9sLCBDb250cm9sLCBMYXllciB9IGZyb20gJ2xlYWZsZXQnO1xuXG5pbXBvcnQgeyBMZWFmbGV0Q29udHJvbExheWVyc0NoYW5nZXMgfSBmcm9tICcuL2xlYWZsZXQtY29udHJvbC1sYXllcnMtY2hhbmdlcy5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBMZWFmbGV0Q29udHJvbExheWVyc1dyYXBwZXIge1xuXG5cdC8vIFRoZSBsYXllcnMgY29udHJvbCBvYmplY3Rcblx0cHJvdGVjdGVkIGxheWVyc0NvbnRyb2w6IENvbnRyb2wuTGF5ZXJzO1xuXG5cdC8vIEV2ZW50IEVtaXR0ZXIgZm9yIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVhZHlcblx0cHJvdGVjdGVkIGxheWVyc0NvbnRyb2xSZWFkeTogRXZlbnRFbWl0dGVyPENvbnRyb2wuTGF5ZXJzPjtcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSwgbGF5ZXJzQ29udHJvbFJlYWR5OiBFdmVudEVtaXR0ZXI8Q29udHJvbC5MYXllcnM+KSB7XG5cdFx0dGhpcy5sYXllcnNDb250cm9sUmVhZHkgPSBsYXllcnNDb250cm9sUmVhZHk7XG5cdH1cblxuXHRnZXRMYXllcnNDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLmxheWVyc0NvbnRyb2w7XG5cdH1cblxuXHRpbml0KGNvbnRyb2xDb25maWc6IGFueSwgY29udHJvbE9wdGlvbnM6IGFueSk6IENvbnRyb2wuTGF5ZXJzIHtcblxuXHRcdGNvbnN0IGJhc2VMYXllcnMgPSBjb250cm9sQ29uZmlnLmJhc2VMYXllcnMgfHwge307XG5cdFx0Y29uc3Qgb3ZlcmxheXMgPSBjb250cm9sQ29uZmlnLm92ZXJsYXlzIHx8IHt9O1xuXG5cdFx0Ly8gQ3JlYXRlIHRoZSBjb250cm9sIG91dHNpZGUgb2YgYW5ndWxhciB0byBlbnN1cmUgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvblxuXHRcdHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHR0aGlzLmxheWVyc0NvbnRyb2wgPSBjb250cm9sLmxheWVycyhiYXNlTGF5ZXJzLCBvdmVybGF5cywgY29udHJvbE9wdGlvbnMpO1xuXHRcdH0pO1xuXG5cblx0XHR0aGlzLmxheWVyc0NvbnRyb2xSZWFkeS5lbWl0KHRoaXMubGF5ZXJzQ29udHJvbCk7XG5cblx0XHRyZXR1cm4gdGhpcy5sYXllcnNDb250cm9sO1xuXHR9XG5cblx0YXBwbHlCYXNlTGF5ZXJDaGFuZ2VzKGNoYW5nZXM6IEtleVZhbHVlQ2hhbmdlczxzdHJpbmcsIExheWVyPik6IExlYWZsZXRDb250cm9sTGF5ZXJzQ2hhbmdlcyB7XG5cdFx0bGV0IHJlc3VsdHM6IExlYWZsZXRDb250cm9sTGF5ZXJzQ2hhbmdlcyA9IG5ldyBMZWFmbGV0Q29udHJvbExheWVyc0NoYW5nZXMoKTtcblxuXHRcdGlmIChudWxsICE9IHRoaXMubGF5ZXJzQ29udHJvbCkge1xuXHRcdFx0cmVzdWx0cyA9ICB0aGlzLmFwcGx5Q2hhbmdlcyhjaGFuZ2VzLCB0aGlzLmxheWVyc0NvbnRyb2wuYWRkQmFzZUxheWVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdGFwcGx5T3ZlcmxheUNoYW5nZXMoY2hhbmdlczogS2V5VmFsdWVDaGFuZ2VzPHN0cmluZywgTGF5ZXI+KTogTGVhZmxldENvbnRyb2xMYXllcnNDaGFuZ2VzIHtcblx0XHRsZXQgcmVzdWx0czogTGVhZmxldENvbnRyb2xMYXllcnNDaGFuZ2VzID0gbmV3IExlYWZsZXRDb250cm9sTGF5ZXJzQ2hhbmdlcygpO1xuXG5cdFx0aWYgKG51bGwgIT0gdGhpcy5sYXllcnNDb250cm9sKSB7XG5cdFx0XHRyZXN1bHRzID0gIHRoaXMuYXBwbHlDaGFuZ2VzKGNoYW5nZXMsIHRoaXMubGF5ZXJzQ29udHJvbC5hZGRPdmVybGF5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlDaGFuZ2VzKGNoYW5nZXM6IEtleVZhbHVlQ2hhbmdlczxzdHJpbmcsIExheWVyPiwgYWRkRm46IChsYXllcjogTGF5ZXIsIG5hbWU6IHN0cmluZykgPT4gdm9pZCk6IExlYWZsZXRDb250cm9sTGF5ZXJzQ2hhbmdlcyB7XG5cdFx0Y29uc3QgcmVzdWx0czogTGVhZmxldENvbnRyb2xMYXllcnNDaGFuZ2VzID0gbmV3IExlYWZsZXRDb250cm9sTGF5ZXJzQ2hhbmdlcygpO1xuXG5cdFx0aWYgKG51bGwgIT0gY2hhbmdlcykge1xuXG5cdFx0XHQvLyBBbGwgbGF5ZXIgbWFuYWdlbWVudCBpcyBvdXRzaWRlIGFuZ3VsYXIgdG8gYXZvaWQgbGF5ZXIgZXZlbnRzIGZyb20gdHJpZ2dlcmluZyBjaGFuZ2UgZGV0ZWN0aW9uXG5cdFx0XHR0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXG5cdFx0XHRcdGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKChjKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5sYXllcnNDb250cm9sLnJlbW92ZUxheWVyKGMucHJldmlvdXNWYWx1ZSk7XG5cdFx0XHRcdFx0YWRkRm4uY2FsbCh0aGlzLmxheWVyc0NvbnRyb2wsIGMuY3VycmVudFZhbHVlLCBjLmtleSk7XG5cdFx0XHRcdFx0cmVzdWx0cy5sYXllcnNDaGFuZ2VkKys7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgoYykgPT4ge1xuXHRcdFx0XHRcdHRoaXMubGF5ZXJzQ29udHJvbC5yZW1vdmVMYXllcihjLnByZXZpb3VzVmFsdWUpO1xuXHRcdFx0XHRcdHJlc3VsdHMubGF5ZXJzUmVtb3ZlZCsrO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChjKSA9PiB7XG5cdFx0XHRcdFx0YWRkRm4uY2FsbCh0aGlzLmxheWVyc0NvbnRyb2wsIGMuY3VycmVudFZhbHVlLCBjLmtleSk7XG5cdFx0XHRcdFx0cmVzdWx0cy5sYXllcnNBZGRlZCsrO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG59XG4iXX0=