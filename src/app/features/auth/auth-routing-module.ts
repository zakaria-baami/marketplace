import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { RoleChoiceComponent } from './role-choice/role-choice';
import { SellerPlansComponent } from './seller-plans/seller-plans';
import { TemplateSelectionComponent } from './template-selection/template-selection';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/vendeur', component: RegisterComponent },
  { path: 'register/role', component: RoleChoiceComponent },
  { path: 'register/plans', component: SellerPlansComponent },
  { path: 'register/template', component: TemplateSelectionComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
