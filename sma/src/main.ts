import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { global } from './globals/global';

let link = document.getElementById('favicon');
link['href'] = environment.customers[environment.selectedCustomer].favicon;

global.title = environment.customers[environment.selectedCustomer].title;

let title = document.getElementById('title');
title.innerText = global.title;

let style = document.getElementById('defineStyle');
style.innerText = ":root{--primary-background: " + environment.customers[environment.selectedCustomer].background
                   + ";--primary-bgcolor: " + environment.customers[environment.selectedCustomer].backgroundColor
                   + ";--primary-btn-bgcolor: " + environment.customers[environment.selectedCustomer].backgroundPrimaryBtnColor
                   + ";--sidenav-width: " + environment.customers[environment.selectedCustomer].sideNaveWidth + ";}";


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
