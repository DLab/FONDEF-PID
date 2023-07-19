import { formatNumber } from '@angular/common';
import { SidenavItem } from './../../../layout/sidenav/sidenav-item/sidenav-item.interface';
import { Component, ElementRef, LOCALE_ID, OnInit, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { global, initConstants } from 'src/globals/global';

export function setMenuLanguage(items: SidenavItem[]){
  if (items){
    items.forEach(item=>{
      if (item.id){
        global.hasIdMenu[item.id] = true;
      }
      if (item.crumbs){
        var langMenues:string[] = [];
        item.crumbs.forEach(menu=>{
          langMenues.push(global.screen[menu]);
        });
        item.lang_crumbs = langMenues;
        if (item.subItems){
          setMenuLanguage(item.subItems);
        }
      }
    });
  }
}

@Component({
  selector: 'darta-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageComponent implements OnInit, OnDestroy {

    selectedLanguage: string;
    listener:any;

    langSwitcherOptions = [
      {title: 'English', value: 'us', icon:'flag-US', locale: 'en-US'},
      {title: 'Spanish', value: 'cl', icon:'flag-CL', locale: 'es-CL'},
      {title: 'Portuguese', value: 'br', icon:'flag-BR', locale: 'es-BR'}
    ];

    constructor(private elem: ElementRef,
      private service: BaseService) {
    }
    ngOnInit() {
      this.selectedLanguage = global.currentLanguage;
      global.load.addListener('loadok', this.listener = ()=>{
        this.selectedLanguage = global.currentLanguage;
        global.currentLocale = this.langSwitcherOptions.find(a=>a.value == global.currentLanguage).locale;
        let s:string = "1.000,0";//formatNumber(1000, global.currentLocale, '0.1-1');
        global.numberCleanRegExp = s.slice(1, 2) == '.' ? /\./gi : /\,/gi;
        global.sepDecimal = s.slice(5, 6);
      });
    }
    ngOnDestroy(): void {
      global.load.removeListener('loadok', this.listener);
    }
    changeLanguage()
    {
      this.service.getScreen(this.selectedLanguage).subscribe(data=> {
        global.screen = data;
        global.currentLanguage = data['CURRENT_LANGUAGE'];
        global.currentLocale = this.langSwitcherOptions.find(a=>a.value == global.currentLanguage).locale;
        setMenuLanguage(global.menues);
        initConstants();
        global.load.emit('loadok');
      });
    }


}
