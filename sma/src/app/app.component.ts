import { MessageBox, MessageBoxType } from 'src/app/pages/message-box/message.box';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SidenavService } from './layout/sidenav/sidenav.service';
import { ThemeService } from '../@fury/services/theme.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { SplashScreenService } from '../@fury/services/splash-screen.service';
import { BaseService } from './base.service';
import { global, initConstants } from 'src/globals/global';

@Component({
  selector: 'fury-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private sidenavService: SidenavService,
              private iconRegistry: MatIconRegistry,
              private renderer: Renderer2,
              private themeService: ThemeService,
              @Inject(DOCUMENT) private document: Document,
              private platform: Platform,
              private route: ActivatedRoute,
              private splashScreenService: SplashScreenService,
              private baseService: BaseService,
              private router: Router,
              private messageBox: MessageBox) {

    baseService.obtieneCondicionesIniciales().subscribe(data=>{
      global.screen = data['SCREEN'];
      global.properties = data['properties'];
      global.currentLanguage = data['currentLanguage'];
      global.acciones = data['acciones'];
      global.cliente = data['cliente'];
      global.constants = data;
      global.load.emit('loadok');

      initConstants();
    });

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event as NavigationEnd).url != '/' && global.user == null)
      {
        baseService.getCurrentUser().subscribe(data=>{
          global.user = data;
          if (data == null)
          {
            messageBox.showMessageBox(MessageBoxType.Warning, global.screen['UsuarioNoConectado']);
            router.navigate(['']);
          }
        });
      }
    });
    this.themeService.setTheme('fury-light');
    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.themeService.setStyle(queryParamMap.get('style')));

    this.iconRegistry.setDefaultFontSetClass('material-icons-outlined');
    this.themeService.theme$.subscribe(theme => {
      if (theme[0]) {
        this.renderer.removeClass(this.document.body, theme[0]);
      }

      this.renderer.addClass(this.document.body, theme[1]);
    });

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }


  }
}
