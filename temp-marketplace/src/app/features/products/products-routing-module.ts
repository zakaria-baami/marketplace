import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products-listing/products-listing').then(m => m.ProductsListingComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
