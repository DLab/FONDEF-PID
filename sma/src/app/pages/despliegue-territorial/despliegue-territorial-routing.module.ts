import { DespliegueTerritorialComponent } from './despliegue-territorial.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DespliegueTerritorialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespliegueTerritorialRoutingModule {
}
