import { global } from 'src/globals/global';
import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {

  gl:any = global;
  listener:any;

  constructor() {
    super();
    global.load.addListener('loadok', this.listener = ()=>{
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = this.gl.screen['Items_por_pagina'];
    this.nextPageLabel = this.gl.screen['Pagina_siguiente'];
    this.previousPageLabel = this.gl.screen['Pagina_previa'];
  }
  getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.gl.screen['de']} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${
      this.gl.screen['de']
    } ${length}`;
  };
}
