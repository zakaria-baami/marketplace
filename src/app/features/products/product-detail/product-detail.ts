import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/services/product';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ProductCardComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  selectedQuantity = 1;
  selectedImageIndex = 0;
  isFavorite = false;
  product: any = null;
  loading = true;
  error: string | null = null;
  isInCart = false;
  cartQuantity = 0;
  private cartSubscription: Subscription = new Subscription();
  similarProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
        this.loading = false;
        this.error = "Product ID is missing."
    }

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.updateCartStatus();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        this.updateCartStatus();
        // Charger les produits similaires de la même catégorie
        this.loadSimilarProducts();
      },
      error: (err) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadSimilarProducts(): void {
    this.similarProducts = [];
    if (this.product && this.product.categorie && this.product.categorie.id) {
      const catId = this.product.categorie.id;
      this.productService.getProductsByCategory(catId, { limit: 12 }).subscribe({
        next: (res) => {
          // On s'assure que chaque produit a bien un objet categorie
          const produits = (res.produits || []).map(p => ({
            ...p,
            categorie: p.categorie || { id: (p as any).categorie_id }
          }));

          this.similarProducts = produits.filter(p =>
            p.id !== this.product.id &&
            p.categorie &&
            this.product.categorie &&
            p.categorie.id === this.product.categorie.id
          );
          console.log('Produits similaires:', this.similarProducts);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des produits similaires:', err);
          this.similarProducts = [];
        }
      });
    } else {
      this.similarProducts = [];
    }
  }

  updateCartStatus() {
    if (this.product) {
      this.isInCart = this.cartService.isInCart(this.product.id);
      this.cartQuantity = this.cartService.getItemQuantity(this.product.id);
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  addToCart() {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product, this.selectedQuantity);
    this.snackBar.open(`${this.selectedQuantity} ${this.selectedQuantity > 1 ? 'articles ajoutés' : 'article ajouté'} au panier`, 'Fermer', { duration: 2000 });
  }

  removeFromCart() {
    if (!this.product) return;
    
    const cartItems = this.cartService.getCartItems();
    const cartItem = cartItems.find(item => item.productId === this.product.id);
    if (cartItem) {
      this.cartService.removeFromCart(cartItem.id);
      this.snackBar.open('Produit retiré du panier', 'Fermer', { duration: 2000 });
    }
  }

  buyNow() {
    if (this.authService.hasValidToken()) {
      // Rediriger vers le panier
      this.router.navigate(['/cart']);
    } else {
      // Rediriger vers la page de login
      this.router.navigate(['/auth/login']);
    }
  }

  contactSeller() {
    console.log('Contacting seller');
    // TODO: Implement contact seller functionality
  }

  visitShop() {
    console.log('Visiting shop');
    // TODO: Navigate to seller's shop
  }

  incrementQuantity() {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  decrementQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  getStockStatus() {
    if (this.product.stock === 0) {
      return { text: 'Rupture de stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (this.product.stock <= 5) {
      return { text: `Plus que ${this.product.stock} en stock`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else {
      return { text: 'En stock', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  getSavingsPercentage(): number {
    if (!this.product || !this.product.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  getDiscount(product: any): number {
    if (!product.prix_original || product.prix_original <= product.prix) return 0;
    return Math.round(100 * (product.prix_original - product.prix) / product.prix_original);
  }

  getStockPercent(product: any): number {
    // Suppose que le stock max est 100 pour l'exemple, adapte selon ta logique
    const maxStock = 100;
    return product.stock ? Math.min(100, Math.round((product.stock / maxStock) * 100)) : 0;
  }

  getStars(product: any): number[] {
    // Suppose que product.note_moyenne est sur 5
    const rating = Math.round(product.note_moyenne || 0);
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
