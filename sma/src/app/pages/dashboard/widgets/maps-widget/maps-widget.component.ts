import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fury-maps-widget',
  templateUrl: './maps-widget.component.html',
  styleUrls: ['./maps-widget.component.scss']
})
export class MapsWidgetComponent implements OnInit {

  @Input() height = '450px';
  @Input() options: google.maps.MapOptions = {
    center: {
      lat: 40.7143528,
      lng: -74.0059731
    },
    draggable: false,
    scrollwheel: false,
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
    zoomControl: false
  };

  constructor() {
  }

  ngOnInit() {
  }

}
