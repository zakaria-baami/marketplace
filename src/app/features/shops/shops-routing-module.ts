import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const SHOPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shops-listing/shops-listing').then(m => m.ShopsListingComponent),
    pathMatch: 'full'
  },
  {
    path: ':slug',
    loadComponent: () => import('./shop-page/shop-page').then(m => m.ShopPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(SHOPS_ROUTES)],
  exports: [RouterModule]
})
export class ShopsRoutingModule { }
