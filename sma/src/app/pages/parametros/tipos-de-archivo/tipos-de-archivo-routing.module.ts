import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiposDeArchivoComponent } from './tipos-de-archivo.component';

const routes: Routes = [
  {
    path: '',
    component: TiposDeArchivoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposDeArchivoRoutingModule {
}
