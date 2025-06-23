import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { VendeurRoutingModule } from './vendeur-routing-module';
import { VendeurDashboardComponent } from './vendeur-dashboard/vendeur-dashboard';
import { ProductManagementComponent } from './vendeur-dashboard/product-management/product-management.component';
import { ProductFormComponent } from './vendeur-dashboard/product-form/product-form.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    // All components are standalone and loaded via router
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    VendeurRoutingModule,
    // Material Modules
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
  ]
})
export class VendeurModule { }
