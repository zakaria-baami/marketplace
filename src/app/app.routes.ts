import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/homepage/homepage').then(m => m.HomepageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];