import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart-page/cart-page').then(m => m.CartPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(CART_ROUTES)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
