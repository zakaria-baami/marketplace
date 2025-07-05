import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendeurDashboardComponent } from './vendeur-dashboard/vendeur-dashboard';
import { ProductManagementComponent } from './vendeur-dashboard/product-management/product-management.component';
import { ProductFormComponent } from './vendeur-dashboard/product-form/product-form.component';
import { StoreDesignerComponent } from './store-designer/store-designer';

const routes: Routes = [
  { path: 'designer', component: StoreDesignerComponent },
  {
    path: '',
    component: VendeurDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: VendeurDashboardComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      // Other seller dashboard routes can go here
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendeurRoutingModule { }
