import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// App Services and Models
import { Product, ProductService } from '../../../../core/services/product';
import { AuthService, User } from '../../../../core/services/auth';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagementComponent implements OnInit {
  
  displayedColumns: string[] = ['image', 'nom', 'categorie', 'prix', 'stock', 'statut', 'actions'];
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  
  private currentUser: User | null;
  private boutiqueId: number | undefined;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser && this.currentUser.role === 'vendeur' && this.currentUser.vendeur?.boutique) {
      this.boutiqueId = this.currentUser.vendeur.boutique.id;
      this.loadProducts();
    } else {
      this.loading = false;
      this.error = "Could not find your boutique information. Please ensure you are logged in as a seller.";
      console.error("Boutique ID not found for current user or user is not a seller.");
    }
  }

  loadProducts(): void {
    if(!this.boutiqueId) return;

    this.loading = true;
    this.error = null;
    this.productService.getProducts({ boutiqueId: this.boutiqueId }).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          this.loadProducts(); // Refresh the list
        },
        error: (err) => {
          this.snackBar.open('Failed to delete product', 'Close', { duration: 3000, panelClass: ['bg-red-500', 'text-white'] });
          console.error(err);
        }
      });
    }
  }
}
