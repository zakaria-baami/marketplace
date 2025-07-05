import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { SellerRegisterComponent } from './seller-register/seller-register';
import { RoleChoiceComponent } from './role-choice/role-choice';
import { SellerPlansComponent } from './seller-plans/seller-plans';
import { TemplateSelectionComponent } from './template-selection/template-selection';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'register', component: RegisterComponent },
  { path: 'register/vendeur', component: SellerRegisterComponent },
  { path: 'register/role', component: RoleChoiceComponent },
  // { path: 'register/plans', component: SellerPlansComponent }, // Supprimé : sélection de plan désactivée
  { path: 'register/template', loadComponent: () => import('./template-selection/template-selection').then(m => m.TemplateSelectionComponent) }, // Sélection du template
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
