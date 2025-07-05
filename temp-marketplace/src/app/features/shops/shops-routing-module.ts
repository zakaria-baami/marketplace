import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopProfileComponent } from './shop-create/shop-create';
import { ShopPageComponent } from './shop-page/shop-page';

export const SHOPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shops-listing/shops-listing').then(m => m.ShopsListingComponent),
    pathMatch: 'full'
  },
  {
    path: ':slug',
    loadComponent: () => import('./shop-page/shop-page').then(m => m.ShopPageComponent)
  },
  { path: 'create', component: ShopProfileComponent },
  { path: 'profil', component: ShopProfileComponent },
  {
    path: 'shop/boutique/:id',
    component: ShopPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(SHOPS_ROUTES)],
  exports: [RouterModule]
})
export class ShopsRoutingModule { }
