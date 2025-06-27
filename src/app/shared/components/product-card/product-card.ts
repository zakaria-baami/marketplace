import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart';

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
  @Input() product: any;
  
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
    this.cartService.addToCart(this.product, 1);
    this.snackBar.open(`${this.product.nom} ajouté au panier`, 'Fermer', { duration: 2000 });
  }

  removeFromCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const cartItems = this.cartService.getCartItems();
    const cartItem = cartItems.find((item: any) => item.productId === this.product.id);
    if (cartItem) {
      this.cartService.removeFromCart(cartItem.id);
      this.snackBar.open(`${this.product.nom} retiré du panier`, 'Fermer', { duration: 2000 });
    }
  }
}
