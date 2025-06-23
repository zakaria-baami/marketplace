import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    HeaderComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  users: any[] = [];
  products: any[] = [];
  categories: any[] = [];

  // Table columns
  userColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'actions'];
  productColumns: string[] = ['id', 'name', 'seller', 'price', 'status', 'actions'];
  categoryColumns: string[] = ['id', 'name', 'productCount', 'actions'];
  
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadProducts();
    this.loadCategories();
  }

  loadStats() {
    this.stats = {
      totalUsers: 1350,
      totalSellers: 350,
      totalProducts: 12500,
      totalOrders: 4580,
      monthlyRevenue: 125000,
      growth: 15
    };
  }

  loadUsers() {
    this.users = [
      { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Client', status: 'Active' },
      { id: 2, name: 'Pierre Dubois', email: 'pierre.dubois@email.com', role: 'Vendeur', status: 'Active' },
      { id: 3, name: 'Sophie Martin', email: 'sophie.martin@email.com', role: 'Client', status: 'Inactive' }
    ];
  }

  loadProducts() {
    this.products = [
      { id: 1, name: 'Collier artisanal', seller: 'Marie Créations', price: 45.99, status: 'Active' },
      { id: 2, name: 'Vase en céramique', seller: 'Atelier Poterie', price: 35.00, status: 'Active' },
      { id: 3, name: 'Sac en cuir vintage', seller: 'Vintage Style', price: 89.99, status: 'Inactive' }
    ];
  }

  loadCategories() {
    this.categories = [
      { id: 1, name: 'Bijoux & Accessoires', productCount: 1250 },
      { id: 2, name: 'Vêtements & Chaussures', productCount: 890 },
      { id: 3, name: 'Maison & Déco', productCount: 2100 }
    ];
  }

  editUser(userId: number) {
    console.log('Edit user:', userId);
    this.snackBar.open(`Modification de l'utilisateur ${userId}`, 'Fermer', { duration: 3000 });
  }

  toggleUserStatus(userId: number) {
    console.log('Toggle user status:', userId);
    this.snackBar.open(`Statut de l'utilisateur ${userId} modifié`, 'Fermer', { duration: 3000 });
  }

  editProduct(productId: number) {
    console.log('Edit product:', productId);
    this.snackBar.open(`Modification du produit ${productId}`, 'Fermer', { duration: 3000 });
  }
  
  toggleProductStatus(productId: number) {
    console.log('Toggle product status:', productId);
    this.snackBar.open(`Statut du produit ${productId} modifié`, 'Fermer', { duration: 3000 });
  }

  editCategory(categoryId: number) {
    console.log('Edit category:', categoryId);
    this.snackBar.open(`Modification de la catégorie ${categoryId}`, 'Fermer', { duration: 3000 });
  }

  deleteCategory(categoryId: number) {
    console.log('Delete category:', categoryId);
    this.snackBar.open(`Catégorie ${categoryId} supprimée`, 'Fermer', { duration: 3000 });
  }
  
  getGrowthColor(growth: number): string {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'trending_up' : 'trending_down';
  }
} 