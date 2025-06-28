import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  seller: string;
  sellerId: number;
  available: boolean;
  maxQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'marketplace_cart';

  constructor() {
    this.loadCartFromStorage();
  }

  // Observable to watch cart changes
  get cartItems$(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Add item to cart
  addToCart(product: any, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.maxQuantity || product.maxQuantity === 0) {
        existingItem.quantity = newQuantity;
      } else {
        existingItem.quantity = product.maxQuantity;
      }
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: this.generateItemId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        quantity: quantity,
        image: product.image,
        seller: product.seller || 'Vendeur',
        sellerId: product.sellerId || 1,
        available: product.available !== false,
        maxQuantity: product.maxQuantity || 10
      };
      this.cartItems.push(cartItem);
    }
    
    this.saveCartToStorage();
    this.cartSubject.next([...this.cartItems]);
  }

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): boolean {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item && quantity > 0 && quantity <= item.maxQuantity) {
      item.quantity = quantity;
      this.saveCartToStorage();
      this.cartSubject.next([...this.cartItems]);
      return true;
    }
    return false;
  }

  // Remove item from cart
  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCartToStorage();
    this.cartSubject.next([...this.cartItems]);
  }

  // Remove multiple items
  removeMultipleItems(itemIds: string[]): void {
    this.cartItems = this.cartItems.filter(item => !itemIds.includes(item.id));
    this.saveCartToStorage();
    this.cartSubject.next([...this.cartItems]);
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.cartSubject.next([]);
  }

  // Get cart item count
  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart subtotal for selected items
  getSubtotal(selectedItemIds: string[]): number {
    return this.cartItems
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get total savings
  getTotalSavings(selectedItemIds: string[]): number {
    return this.cartItems
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((total, item) => {
        const originalPrice = item.originalPrice || item.price;
        return total + ((originalPrice - item.price) * item.quantity);
      }, 0);
  }

  // Check if item is in cart
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.productId === productId);
  }

  // Get item quantity in cart
  getItemQuantity(productId: number): number {
    const item = this.cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
  try {
    // Vérifier si localStorage est disponible (côté navigateur)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.cartSubject.next([...this.cartItems]);
      }
    } else {
      // Côté serveur - initialiser avec un tableau vide
      this.cartItems = [];
      this.cartSubject.next([...this.cartItems]);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    this.cartItems = [];
    this.cartSubject.next([...this.cartItems]);
  }
}

  // Save cart to localStorage
 private saveCartToStorage(): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
    }
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

  // Generate unique item ID
  private generateItemId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
