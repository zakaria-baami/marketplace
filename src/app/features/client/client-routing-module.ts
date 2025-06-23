import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./client-dashboard/client-dashboard').then(m => m.ClientDashboardComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(CLIENT_ROUTES)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
