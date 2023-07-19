import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentacionComponent } from './presentacion.component';

const routes: Routes = [
  {
    path: '',
    component: PresentacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentacionRoutingModule {
}
