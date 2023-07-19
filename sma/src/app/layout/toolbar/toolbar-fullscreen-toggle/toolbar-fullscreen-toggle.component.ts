import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { default as screenfull } from 'screenfull';

@Component({
  selector: 'fury-toolbar-fullscreen-toggle',
  templateUrl: './toolbar-fullscreen-toggle.component.html',
  styleUrls: ['./toolbar-fullscreen-toggle.component.scss']
})
export class ToolbarFullscreenToggleComponent implements OnInit {

  isFullscreen = false;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    screenfull.on('change', () => this.setFullscreen(screenfull.isFullscreen));
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
      this.setFullscreen(screenfull.isFullscreen);
    }
  }

  setFullscreen(isFullscreen: boolean) {
    this.isFullscreen = isFullscreen;
    this.cd.markForCheck();
  }
}
