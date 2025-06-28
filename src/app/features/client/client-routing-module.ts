import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard';
import { EditProfileComponent } from './edit-profile/edit-profile';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  { path: 'profile', component: ClientDashboardComponent },
  { path: 'edit-profile', component: EditProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(CLIENT_ROUTES)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
