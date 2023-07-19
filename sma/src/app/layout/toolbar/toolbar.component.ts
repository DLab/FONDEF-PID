import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { LanguageComponent } from 'src/app/pages/components/language/language.component';
import { global } from 'src/globals/global';
import { ThemeService } from '../../../@fury/services/theme.service';

@Component({
  selector: 'fury-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  app:any = global;
  @Input()
  @HostBinding('class.no-box-shadow')
  hasNavigation: boolean;

  @Output() openSidenav = new EventEmitter();
  @Output() openQuickPanel = new EventEmitter();

  topNavigation$ = this.themeService.config$.pipe(map(config => config.navigation === 'top'));
  
  @ViewChild(LanguageComponent, { read: ElementRef, static: true }) private autocomplete: ElementRef;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() { }


}
