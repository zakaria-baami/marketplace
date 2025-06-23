import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    HeaderComponent
  ],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  selectedItems: string[] = [];
  loading = false;
  
  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Livraison standard', price: 5.99, days: '3-5 jours' },
    { id: 'express', name: 'Livraison express', price: 12.99, days: '1-2 jours' },
    { id: 'free', name: 'Livraison gratuite', price: 0, days: '3-5 jours', minOrder: 50 }
  ];
  
  selectedShipping = 'standard';
  
  // Coupon
  couponCode = '';
  appliedCoupon: any = null;
  availableCoupons = [
    { code: 'WELCOME10', discount: 10, type: 'percentage', minOrder: 30 },
    { code: 'SAVE5', discount: 5, type: 'fixed', minOrder: 20 }
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    // Mock cart data - replace with service call
    this.cartItems = [
      {
        id: '1',
        productId: 1,
        name: 'Collier artisanal en argent',
        price: 45.99,
        originalPrice: 59.99,
        quantity: 1,
        image: 'assets/images/product1.jpg',
        seller: 'Marie Créations',
        sellerId: 1,
        available: true,
        maxQuantity: 10
      },
      {
        id: '2',
        productId: 2,
        name: 'Vase en céramique fait main',
        price: 35.00,
        originalPrice: 35.00,
        quantity: 2,
        image: 'assets/images/product2.jpg',
        seller: 'Atelier Poterie',
        sellerId: 2,
        available: true,
        maxQuantity: 5
      },
      {
        id: '3',
        productId: 3,
        name: 'Sac en cuir vintage',
        price: 89.99,
        originalPrice: 120.00,
        quantity: 1,
        image: 'assets/images/product3.jpg',
        seller: 'Vintage Style',
        sellerId: 3,
        available: false,
        maxQuantity: 0
      }
    ];
    
    // Select all available items by default
    this.selectedItems = this.cartItems
      .filter(item => item.available)
      .map(item => item.id);
  }

  updateQuantity(itemId: string, newQuantity: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item && newQuantity > 0 && newQuantity <= item.maxQuantity) {
      item.quantity = newQuantity;
      this.updateCart();
    }
  }

  removeItem(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.selectedItems = this.selectedItems.filter(id => id !== itemId);
    this.updateCart();
    this.snackBar.open('Produit retiré du panier', 'Fermer', { duration: 3000 });
  }

  toggleItemSelection(itemId: string) {
    const index = this.selectedItems.indexOf(itemId);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(itemId);
    }
  }

  toggleAllItems() {
    if (this.selectedItems.length === this.getAvailableItems().length) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.getAvailableItems().map(item => item.id);
    }
  }

  getAvailableItems() {
    return this.cartItems.filter(item => item.available);
  }

  getSelectedItems() {
    return this.cartItems.filter(item => this.selectedItems.includes(item.id));
  }

  getSubtotal() {
    return this.getSelectedItems().reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getShippingCost() {
    const subtotal = this.getSubtotal();
    const option = this.shippingOptions.find(opt => opt.id === this.selectedShipping);
    
    if (option?.id === 'free' && subtotal >= (option.minOrder || 0)) {
      return 0;
    }
    
    return option?.price || 0;
  }

  getDiscount() {
    if (!this.appliedCoupon) return 0;
    
    const subtotal = this.getSubtotal();
    if (subtotal < this.appliedCoupon.minOrder) return 0;
    
    if (this.appliedCoupon.type === 'percentage') {
      return (subtotal * this.appliedCoupon.discount) / 100;
    } else {
      return this.appliedCoupon.discount;
    }
  }

  getTotal() {
    return this.getSubtotal() + this.getShippingCost() - this.getDiscount();
  }

  getSavings() {
    return this.getSelectedItems().reduce((total, item) => {
      return total + ((item.originalPrice - item.price) * item.quantity);
    }, 0);
  }

  applyCoupon() {
    const coupon = this.availableCoupons.find(c => c.code === this.couponCode.toUpperCase());
    
    if (coupon) {
      const subtotal = this.getSubtotal();
      if (subtotal >= coupon.minOrder) {
        this.appliedCoupon = coupon;
        this.snackBar.open(`Code promo appliqué: -${coupon.discount}${coupon.type === 'percentage' ? '%' : '€'}`, 'Fermer', { duration: 3000 });
      } else {
        this.snackBar.open(`Commande minimum de ${coupon.minOrder}€ requise`, 'Fermer', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Code promo invalide', 'Fermer', { duration: 3000 });
    }
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponCode = '';
  }

  updateCart() {
    // TODO: Call cart service to update cart
    console.log('Cart updated:', this.cartItems);
  }

  proceedToCheckout() {
    if (this.selectedItems.length === 0) {
      this.snackBar.open('Veuillez sélectionner au moins un produit', 'Fermer', { duration: 3000 });
      return;
    }
    
    // TODO: Navigate to checkout page
    console.log('Proceeding to checkout with items:', this.selectedItems);
  }

  continueShopping() {
    // TODO: Navigate to products page
    console.log('Continue shopping');
  }

  getItemTotal(item: any) {
    return item.price * item.quantity;
  }

  getItemSavings(item: any) {
    return (item.originalPrice - item.price) * item.quantity;
  }

  removeSelectedItems() {
    this.cartItems = this.cartItems.filter(item => !this.selectedItems.includes(item.id));
    this.selectedItems = [];
    this.updateCart();
    this.snackBar.open('Produits retirés du panier', 'Fermer', { duration: 3000 });
  }
} 