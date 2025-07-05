import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth';

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
  ligneId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'marketplace_cart';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
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

  // Récupérer les paniers (commandes) du client depuis le backend
  getClientOrders(): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>('/api/client/commandes', { headers }).pipe(
      map(response => response.commandes || [])
    );
  }

  // Valider le panier (passer commande)
  validerPanier(adresse_livraison: string, methode_paiement: string, notes: string = '') {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const body = { adresse_livraison, methode_paiement, notes };
    console.log('[CartService] POST /api/panier/valider', body, headers);
    return this.http.post<any>('/api/panier/valider', body, { headers }).pipe(
      tap({
        next: (res) => console.log('[CartService] Réponse validerPanier:', res),
        error: (err) => console.error('[CartService] Erreur validerPanier:', err)
      })
    );
  }

  // Récupérer le panier du client depuis le backend et mapper les lignes avec l'ID backend
  getBackendCart() {
    // Supprime le panier local pour forcer l'utilisation du backend
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('marketplace_cart');
    }
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>('/api/panier', { headers }).pipe(
      tap(response => {
        console.log('[CartService] Réponse brute backend /api/panier:', response);
      }),
      map(response => {
        // Adapter selon la structure réelle de la réponse backend
        const lignes = response.data?.lignes || response.data?.lignesPanier || response.lignes || response.lignesPanier || response.data || response;
        console.log('[CartService] Lignes extraites pour mapping:', lignes);
        if (!Array.isArray(lignes)) return [];
        return lignes.map((ligne: any) => {
          console.log('[CartService] Mapping ligne:', ligne);
          return {
            id: String(ligne.id), // pour satisfaire CartItem
            ligneId: ligne.id, // ID backend de la ligne de panier
            productId: ligne.produit_id || ligne.productId,
            name: ligne.nom_produit || ligne.name || '',
            price: ligne.prix_unitaire || ligne.price || 0,
            originalPrice: ligne.prix_original || ligne.prix_unitaire || ligne.price || 0,
            quantity: ligne.quantite || ligne.quantity,
            image: ligne.image || '',
            seller: ligne.nom_boutique || ligne.seller || '',
            sellerId: ligne.boutique_id || ligne.sellerId || 0,
            available: ligne.disponible !== false,
            maxQuantity: ligne.max_quantite || ligne.maxQuantity || 10
          };
        });
      }),
      tap(items => {
        this.cartItems = items;
        this.cartSubject.next([...this.cartItems]);
        console.log('[CartService] CartItems finaux:', this.cartItems);
      })
    );
  }

  // Ajouter un produit au panier côté backend et synchroniser le panier local
  addToBackendCart(productId: number, quantite: number = 1) {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const body = { produit_id: productId, quantite };
    console.log('[CartService] POST /api/panier/ajouter', body, headers);
    return this.http.post<any>('/api/panier/ajouter', body, { headers }).pipe(
      switchMap(() => this.getBackendCart()),
      tap({
        next: (backendCart) => console.log('[CartService] Panier backend après ajout:', backendCart),
        error: (err) => console.error('[CartService] Erreur ajout panier:', err)
      })
    );
  }

  // Supprimer un produit du panier côté backend et synchroniser le panier local
  removeFromBackendCart(productId: number) {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('[CartService] DELETE /api/panier/retirer/' + productId, headers);
    return this.http.delete<any>(`/api/panier/retirer/${productId}`, { headers }).pipe(
      switchMap(() => this.getBackendCart()),
      tap({
        next: (backendCart) => console.log('[CartService] Panier backend après suppression:', backendCart),
        error: (err) => console.error('[CartService] Erreur suppression panier:', err)
      })
    );
  }

  // Modifier la quantité d'un produit dans le panier côté backend et synchroniser le panier local
  updateBackendCartQuantity(productId: number, quantite: number) {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const body = { produit_id: productId, quantite };
    console.log('[CartService] PUT /api/panier/modifier-quantite', body, headers);
    return this.http.put<any>('/api/panier/modifier-quantite', body, { headers }).pipe(
      switchMap(() => this.getBackendCart()),
      tap({
        next: (backendCart) => console.log('[CartService] Panier backend après modif quantité:', backendCart),
        error: (err) => console.error('[CartService] Erreur modif quantité panier:', err)
      })
    );
  }

  // Supprimer une ligne du panier côté backend et synchroniser le panier local
  removeFromBackendCartLine(ligneId: number) {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete<any>(`/api/panier/retirer-ligne/${ligneId}`, { headers }).pipe(
      switchMap(() => this.getBackendCart()),
      tap({
        next: (backendCart) => console.log('[CartService] Panier backend après suppression ligne:', backendCart),
        error: (err) => console.error('[CartService] Erreur suppression ligne panier:', err)
      })
    );
  }

  // Modifier la quantité d'une ligne du panier côté backend et synchroniser le panier local
  updateBackendCartLineQuantity(ligneId: number, quantite: number) {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put<any>(`/api/panier/modifier-ligne/${ligneId}`, { quantite }, { headers }).pipe(
      switchMap(() => this.getBackendCart()),
      tap({
        next: (backendCart) => console.log('[CartService] Panier backend après modif ligne:', backendCart),
        error: (err) => console.error('[CartService] Erreur modif ligne panier:', err)
      })
    );
  }
}
