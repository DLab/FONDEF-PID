import { tileLayer } from 'leaflet';
export class LeafletTileLayerDefinition {
    constructor(type, url, options) {
        this.type = type;
        this.url = url;
        this.options = options;
    }
    /**
     * Creates a TileLayer from the provided definition. This is a convenience function
     * to help with generating layers from objects.
     *
     * @param layerDef The layer to create
     * @returns {TileLayer} The TileLayer that has been created
     */
    static createTileLayer(layerDef) {
        let layer;
        switch (layerDef.type) {
            case 'xyz':
                layer = tileLayer(layerDef.url, layerDef.options);
                break;
            case 'wms':
            default:
                layer = tileLayer.wms(layerDef.url, layerDef.options);
                break;
        }
        return layer;
    }
    /**
     * Creates a TileLayer for each key in the incoming map. This is a convenience function
     * for generating an associative array of layers from an associative array of objects
     *
     * @param layerDefs A map of key to tile layer definition
     * @returns {{[p: string]: TileLayer}} A new map of key to TileLayer
     */
    static createTileLayers(layerDefs) {
        const layers = {};
        for (const k in layerDefs) {
            if (layerDefs.hasOwnProperty(k)) {
                layers[k] = (LeafletTileLayerDefinition.createTileLayer(layerDefs[k]));
            }
        }
        return layers;
    }
    /**
     * Create a Tile Layer from the current state of this object
     *
     * @returns {TileLayer} A new TileLayer
     */
    createTileLayer() {
        return LeafletTileLayerDefinition.createTileLayer(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZmxldC10aWxlLWxheWVyLWRlZmluaXRpb24ubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbGVhZmxldC9zcmMvbGliL2xheWVycy9sZWFmbGV0LXRpbGUtbGF5ZXItZGVmaW5pdGlvbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFhLE1BQU0sU0FBUyxDQUFDO0FBRS9DLE1BQU0sT0FBTywwQkFBMEI7SUFFdEMsWUFDUSxJQUFZLEVBQ1osR0FBVyxFQUNYLE9BQVk7UUFGWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUNYLFlBQU8sR0FBUCxPQUFPLENBQUs7SUFBSSxDQUFDO0lBR3pCOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBb0M7UUFDMUQsSUFBSSxLQUFnQixDQUFDO1FBRXJCLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRTtZQUN0QixLQUFLLEtBQUs7Z0JBQ1QsS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkQsTUFBTTtZQUNQLEtBQUssS0FBSyxDQUFDO1lBQ1g7Z0JBQ0MsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU07U0FDUDtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUEwRDtRQUNqRixNQUFNLE1BQU0sR0FBbUMsRUFBRSxDQUFDO1FBRWxELEtBQUssTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQzFCLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkU7U0FDRDtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlO1FBQ2QsT0FBTywwQkFBMEIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGlsZUxheWVyLCBUaWxlTGF5ZXIgfSBmcm9tICdsZWFmbGV0JztcblxuZXhwb3J0IGNsYXNzIExlYWZsZXRUaWxlTGF5ZXJEZWZpbml0aW9uIHtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwdWJsaWMgdHlwZTogc3RyaW5nLFxuXHRcdHB1YmxpYyB1cmw6IHN0cmluZyxcblx0XHRwdWJsaWMgb3B0aW9uczogYW55KSB7IH1cblxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgVGlsZUxheWVyIGZyb20gdGhlIHByb3ZpZGVkIGRlZmluaXRpb24uIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBmdW5jdGlvblxuXHQgKiB0byBoZWxwIHdpdGggZ2VuZXJhdGluZyBsYXllcnMgZnJvbSBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcGFyYW0gbGF5ZXJEZWYgVGhlIGxheWVyIHRvIGNyZWF0ZVxuXHQgKiBAcmV0dXJucyB7VGlsZUxheWVyfSBUaGUgVGlsZUxheWVyIHRoYXQgaGFzIGJlZW4gY3JlYXRlZFxuXHQgKi9cblx0c3RhdGljIGNyZWF0ZVRpbGVMYXllcihsYXllckRlZjogTGVhZmxldFRpbGVMYXllckRlZmluaXRpb24pOiBUaWxlTGF5ZXIge1xuXHRcdGxldCBsYXllcjogVGlsZUxheWVyO1xuXG5cdFx0c3dpdGNoIChsYXllckRlZi50eXBlKSB7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRsYXllciA9IHRpbGVMYXllcihsYXllckRlZi51cmwsICBsYXllckRlZi5vcHRpb25zKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd3bXMnOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bGF5ZXIgPSB0aWxlTGF5ZXIud21zKGxheWVyRGVmLnVybCwgIGxheWVyRGVmLm9wdGlvbnMpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gbGF5ZXI7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIFRpbGVMYXllciBmb3IgZWFjaCBrZXkgaW4gdGhlIGluY29taW5nIG1hcC4gVGhpcyBpcyBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG5cdCAqIGZvciBnZW5lcmF0aW5nIGFuIGFzc29jaWF0aXZlIGFycmF5IG9mIGxheWVycyBmcm9tIGFuIGFzc29jaWF0aXZlIGFycmF5IG9mIG9iamVjdHNcblx0ICpcblx0ICogQHBhcmFtIGxheWVyRGVmcyBBIG1hcCBvZiBrZXkgdG8gdGlsZSBsYXllciBkZWZpbml0aW9uXG5cdCAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106IFRpbGVMYXllcn19IEEgbmV3IG1hcCBvZiBrZXkgdG8gVGlsZUxheWVyXG5cdCAqL1xuXHRzdGF0aWMgY3JlYXRlVGlsZUxheWVycyhsYXllckRlZnM6IHsgWyBrZXk6IHN0cmluZyBdOiBMZWFmbGV0VGlsZUxheWVyRGVmaW5pdGlvbiB9KTogeyBbIGtleTogc3RyaW5nIF06IFRpbGVMYXllciB9IHtcblx0XHRjb25zdCBsYXllcnM6IHsgWyBrZXk6IHN0cmluZyBdOiBUaWxlTGF5ZXIgfSA9IHt9O1xuXG5cdFx0Zm9yIChjb25zdCBrIGluIGxheWVyRGVmcykge1xuXHRcdFx0aWYgKGxheWVyRGVmcy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRsYXllcnNba10gPSAoTGVhZmxldFRpbGVMYXllckRlZmluaXRpb24uY3JlYXRlVGlsZUxheWVyKGxheWVyRGVmc1trXSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBsYXllcnM7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgVGlsZSBMYXllciBmcm9tIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgb2JqZWN0XG5cdCAqXG5cdCAqIEByZXR1cm5zIHtUaWxlTGF5ZXJ9IEEgbmV3IFRpbGVMYXllclxuXHQgKi9cblx0Y3JlYXRlVGlsZUxheWVyKCk6IFRpbGVMYXllciB7XG5cdFx0cmV0dXJuIExlYWZsZXRUaWxlTGF5ZXJEZWZpbml0aW9uLmNyZWF0ZVRpbGVMYXllcih0aGlzKTtcblx0fVxufVxuIl19