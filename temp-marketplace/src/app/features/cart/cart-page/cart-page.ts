import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { CartService, CartItem } from '../../../core/services/cart';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    ReactiveFormsModule
  ],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  selectedItems: string[] = [];
  loading = false;
  private cartSubscription: Subscription = new Subscription();
  
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

  showOrderForm = false;
  orderForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      adresse_livraison: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      methode_paiement: ['CB', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    // Redirige vers le login si pas de token valide
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/login']);
      return;
    }
    // Synchronise le panier avec le backend à chaque chargement de la page
    this.cartService.getBackendCart().subscribe();

    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      // Select all available items by default
      this.selectedItems = this.cartItems
        .filter(item => item.available)
        .map(item => item.id);
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateQuantity(itemId: string, newQuantity: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (!item) return;
    console.log('item', item);
    if (typeof item.ligneId !== 'number') {
      this.snackBar.open('Impossible de modifier la quantité : identifiant de ligne manquant.', 'Fermer', { duration: 3000 });
      return;
    }
    this.cartService.updateBackendCartLineQuantity(item.ligneId, newQuantity).subscribe({
      next: () => {
        this.snackBar.open('Quantité mise à jour (synchronisé)', 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la modification de la quantité', 'Fermer', { duration: 2000 });
      }
    });
  }

  removeItem(itemId: string) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (!item) return;
    if (typeof item.ligneId !== 'number') {
      this.snackBar.open('Impossible de retirer l\'article : identifiant de ligne manquant.', 'Fermer', { duration: 3000 });
      return;
    }
    this.cartService.removeFromBackendCartLine(item.ligneId).subscribe({
      next: () => {
        this.snackBar.open('Produit retiré du panier (synchronisé)', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du retrait du panier', 'Fermer', { duration: 3000 });
      }
    });
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
    return this.cartService.getSubtotal(this.selectedItems);
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
    return this.cartService.getTotalSavings ? this.cartService.getTotalSavings(this.selectedItems) : 0;
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
    this.snackBar.open('Code promo retiré', 'Fermer', { duration: 2000 });
  }

  updateCart() {
    // Cart is automatically updated via the service
  }

  proceedToCheckout() {
    console.log('proceedToCheckout called');
    const user = this.authService.getCurrentUser();
    console.log('user:', user);
    if (this.selectedItems.length === 0) {
      this.snackBar.open('Veuillez sélectionner au moins un article', 'Fermer', { duration: 3000 });
      return;
    }
    if (user && user.role === 'client') {
      this.orderForm.patchValue({
        name: user.nom || '',
        adresse_livraison: '',
        phone: ''
      });
      this.showOrderForm = true;
    } else {
      this.snackBar.open('Veuillez vous inscrire comme client pour passer une commande.', 'Fermer', { duration: 4000 });
      this.router.navigate(['/auth/register'], { queryParams: { returnUrl: '/cart' } });
    }
  }

  closeOrderForm() {
    this.showOrderForm = false;
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs du formulaire.', 'Fermer', { duration: 3000 });
      return;
    }
    const user = this.authService.getCurrentUser();
    this.cartService.validerPanier(
      this.orderForm.value.adresse_livraison,
      this.orderForm.value.methode_paiement,
      this.orderForm.value.notes
    ).subscribe({
      next: (res: any) => {
        this.snackBar.open('Commande passée avec succès !', 'Fermer', { duration: 4000 });
        this.showOrderForm = false;
        this.cartService.clearCart();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement de la commande.', 'Fermer', { duration: 4000 });
      }
    });
  }

  continueShopping() {
    // Navigate to products page
    window.history.back();
  }

  getItemTotal(item: CartItem) {
    return (item.price * item.quantity).toFixed(2);
  }

  getItemSavings(item: CartItem) {
    const originalPrice = item.originalPrice || item.price;
    return (originalPrice - item.price) * item.quantity;
  }

  removeSelectedItems() {
    if (this.selectedItems.length === 0) {
      this.snackBar.open('Aucun article sélectionné', 'Fermer', { duration: 2000 });
      return;
    }
    this.cartService.removeMultipleItems(this.selectedItems);
    this.selectedItems = [];
    this.snackBar.open(`${this.selectedItems.length} article(s) retiré(s) du panier`, 'Fermer', { duration: 3000 });
  }

  getProductImage(item: any): string {
    // Cas 1 : images[] (ancienne logique)
    if (item.images && item.images.length > 0) {
      const mainImage = item.images.find((img: any) => img.est_principale);
      return mainImage ? mainImage.url : item.images[0].url;
    }
    // Cas 2 : champ image (string)
    if (item.image) {
      if (typeof item.image === 'string') {
        if (item.image.startsWith('/uploads/')) {
          return `http://localhost:3308${item.image}`;
        }
        return `http://localhost:3308/uploads/products/${item.image}`;
      }
    }
    return 'assets/images/placeholder-product.jpg';
  }
} 