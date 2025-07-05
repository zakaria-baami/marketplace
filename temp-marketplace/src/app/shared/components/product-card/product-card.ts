import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../core/services/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  
  isInCart = false;
  cartQuantity = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.updateCartStatus();
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.updateCartStatus();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateCartStatus() {
    this.isInCart = this.cartService.isInCart(this.product.id);
    this.cartQuantity = this.cartService.getItemQuantity(this.product.id);
  }

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.product.disponible || this.product.est_en_rupture) {
      this.snackBar.open('Ce produit n\'est pas disponible', 'Fermer', { duration: 2000 });
      return;
    }
    this.cartService.addToBackendCart(this.product.id, 1).subscribe({
      next: () => {
        this.snackBar.open(`${this.product.nom} ajouté au panier (synchronisé)`, 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 2000 });
      }
    });
  }

  removeFromCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.removeFromBackendCart(this.product.id).subscribe({
      next: () => {
        this.snackBar.open(`${this.product.nom} retiré du panier (synchronisé)`, 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du retrait du panier', 'Fermer', { duration: 2000 });
      }
    });
  }

  getProductImage(): string {
    // Cas 1 : images[] (ancienne logique)
    if (this.product.images && this.product.images.length > 0) {
      const mainImage = this.product.images.find(img => img.est_principale);
      return mainImage ? mainImage.url : this.product.images[0].url;
    }
    // Cas 2 : champ image (string)
    if (this.product.image) {
      // Si l'image commence déjà par /uploads, on la préfixe juste par le host
      if (typeof this.product.image === 'string') {
        if (this.product.image.startsWith('/uploads/')) {
          return `http://localhost:3308${this.product.image}`;
        }
        // Sinon, on suppose que c'est juste le nom du fichier
        return `http://localhost:3308/uploads/products/${this.product.image}`;
      }
    }
    return 'assets/images/placeholder-product.jpg'; // Image par défaut
  }

  getStockStatus(): string {
    if (this.product.est_en_rupture) return 'Rupture de stock';
    if (this.product.est_stock_critique) return 'Stock limité';
    if (this.product.stock > 0) return 'En stock';
    return 'Indisponible';
  }

  getStockStatusColor(): string {
    if (this.product.est_en_rupture) return 'text-red-600';
    if (this.product.est_stock_critique) return 'text-orange-600';
    if (this.product.stock > 0) return 'text-green-600';
    return 'text-gray-600';
  }
}
