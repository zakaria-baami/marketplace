import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ProductCardComponent
  ],
  templateUrl: './favorites-page.html',
  styleUrls: ['./favorites-page.css']
})
export class FavoritesPageComponent implements OnInit {
  favorites: any[] = [];
  loading = true;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    // Mock favorites data - replace with API call
    setTimeout(() => {
      this.favorites = [
        {
          id: 1,
          name: 'Bague en or 18 carats',
          price: 299.99,
          originalPrice: 399.99,
          rating: 4.9,
          reviewCount: 45,
          seller: 'LuxuryJewelry',
          isFavorite: true
        },
        {
          id: 2,
          name: 'Lampe de table design',
          price: 89.99,
          originalPrice: 89.99,
          rating: 4.7,
          reviewCount: 23,
          seller: 'ModernHome',
          isFavorite: true
        },
        {
          id: 3,
          name: 'Écharpe en soie naturelle',
          price: 45.00,
          originalPrice: 60.00,
          rating: 4.8,
          reviewCount: 67,
          seller: 'SilkAccessories',
          isFavorite: true
        }
      ];
      this.loading = false;
    }, 1000);
  }

  removeFromFavorites(productId: number) {
    this.favorites = this.favorites.filter(p => p.id !== productId);
    this.snackBar.open('Produit retiré des favoris', 'Fermer', { duration: 3000 });
  }
} 