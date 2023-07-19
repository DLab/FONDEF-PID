import { Injectable } from '@angular/core';
import * as SimpleBar from 'simplebar';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  scrollbar: SimpleBar;

  constructor() {
  }
}
