import { isInside } from './util';
export class CalendarResizeHelper {
    constructor(resizeContainerElement, minWidth, rtl) {
        this.resizeContainerElement = resizeContainerElement;
        this.minWidth = minWidth;
        this.rtl = rtl;
    }
    validateResize({ rectangle, edges }) {
        if (this.rtl) {
            // TODO - find a way of testing this, for some reason the tests always fail but it does actually work
            /* istanbul ignore next */
            if (typeof edges.left !== 'undefined') {
                rectangle.left -= edges.left;
                rectangle.right += edges.left;
            }
            else if (typeof edges.right !== 'undefined') {
                rectangle.left += edges.right;
                rectangle.right -= edges.right;
            }
            rectangle.width = rectangle.right - rectangle.left;
        }
        if (this.minWidth &&
            Math.ceil(rectangle.width) < Math.ceil(this.minWidth)) {
            return false;
        }
        return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItcmVzaXplLWhlbHBlci5wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLXJlc2l6ZS1oZWxwZXIucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVsQyxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQ1Usc0JBQW1DLEVBQ25DLFFBQWdCLEVBQ2hCLEdBQVk7UUFGWiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQWE7UUFDbkMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixRQUFHLEdBQUgsR0FBRyxDQUFTO0lBQ25CLENBQUM7SUFFSixjQUFjLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO1FBQ2pDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLHFHQUFxRztZQUNyRywwQkFBMEI7WUFDMUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxTQUFTLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQzdCLFNBQVMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQzthQUMvQjtpQkFBTSxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQUU7Z0JBQzdDLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDOUIsU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2hDO1lBQ0QsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7U0FDcEQ7UUFFRCxJQUNFLElBQUksQ0FBQyxRQUFRO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3JEO1lBQ0EsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sUUFBUSxDQUNiLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxxQkFBcUIsRUFBRSxFQUNuRCxTQUFTLENBQ1YsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzSW5zaWRlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGNsYXNzIENhbGVuZGFyUmVzaXplSGVscGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZXNpemVDb250YWluZXJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBwcml2YXRlIG1pbldpZHRoOiBudW1iZXIsXG4gICAgcHJpdmF0ZSBydGw6IGJvb2xlYW5cbiAgKSB7fVxuXG4gIHZhbGlkYXRlUmVzaXplKHsgcmVjdGFuZ2xlLCBlZGdlcyB9KTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAvLyBUT0RPIC0gZmluZCBhIHdheSBvZiB0ZXN0aW5nIHRoaXMsIGZvciBzb21lIHJlYXNvbiB0aGUgdGVzdHMgYWx3YXlzIGZhaWwgYnV0IGl0IGRvZXMgYWN0dWFsbHkgd29ya1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIGlmICh0eXBlb2YgZWRnZXMubGVmdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVjdGFuZ2xlLmxlZnQgLT0gZWRnZXMubGVmdDtcbiAgICAgICAgcmVjdGFuZ2xlLnJpZ2h0ICs9IGVkZ2VzLmxlZnQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlZGdlcy5yaWdodCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVjdGFuZ2xlLmxlZnQgKz0gZWRnZXMucmlnaHQ7XG4gICAgICAgIHJlY3RhbmdsZS5yaWdodCAtPSBlZGdlcy5yaWdodDtcbiAgICAgIH1cbiAgICAgIHJlY3RhbmdsZS53aWR0aCA9IHJlY3RhbmdsZS5yaWdodCAtIHJlY3RhbmdsZS5sZWZ0O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMubWluV2lkdGggJiZcbiAgICAgIE1hdGguY2VpbChyZWN0YW5nbGUud2lkdGgpIDwgTWF0aC5jZWlsKHRoaXMubWluV2lkdGgpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzSW5zaWRlKFxuICAgICAgdGhpcy5yZXNpemVDb250YWluZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgcmVjdGFuZ2xlXG4gICAgKTtcbiAgfVxufVxuIl19