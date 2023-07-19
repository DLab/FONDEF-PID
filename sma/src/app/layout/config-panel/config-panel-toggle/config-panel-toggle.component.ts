import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fury-config-panel-toggle',
  templateUrl: './config-panel-toggle.component.html',
  styleUrls: ['./config-panel-toggle.component.scss']
})
export class ConfigPanelToggleComponent implements OnInit {

  @Output() openConfig = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
