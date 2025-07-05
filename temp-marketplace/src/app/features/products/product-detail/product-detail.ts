import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService, Product, SingleProductResponse } from '../../../core/services/product';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';
import { CartService } from '../../../core/services/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  searchQuery = '';
  userMenuOpen = false;
  userName = 'ZAK'; // À remplacer par le nom du client connecté
  similarProducts: any[] = [];
  cartCount = 0;
  cartSubscription: any;
  productRouteSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.productRouteSub = this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      this.loadProduct(productId);
    });
    this.userService.getClientProfile().subscribe({
      next: (profile) => {
        this.userName = profile.nom;
      },
      error: () => {
        this.userName = 'Utilisateur';
      }
    });
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      const count = this.cartService.getItemCount();
      this.cartCount = isNaN(count) || typeof count !== 'number' ? 0 : count;
    });
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.productRouteSub) {
      this.productRouteSub.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  handleClickOutside(event: MouseEvent) {
    const menu = document.querySelector('.user-menu-wrapper');
    if (menu && !menu.contains(event.target as Node)) {
      this.userMenuOpen = false;
    }
  }

  goToProfile() {
    this.userMenuOpen = false;
    this.router.navigate(['/client/profile']);
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadProduct(productIdParam?: string | null) {
    const productId = productIdParam || this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.error = 'ID du produit manquant';
      this.loading = false;
      return;
    }

    this.productService.getProductById(parseInt(productId)).subscribe({
      next: (response: SingleProductResponse) => {
        console.log('Réponse API produit (détail):', response, JSON.stringify(response));
        this.product = response.produit ?? null;
        this.loading = false;
        // Charger les produits similaires de la même catégorie
        if (this.product && this.product.categorie && this.product.categorie.id) {
          this.productService.getProductsByCategory(this.product.categorie.id, { limit: 10 }).subscribe({
            next: (res: any) => {
              const currentProductId = this.product ? this.product.id : null;
              const produits = (res.data || res.produits || []).filter((p: any) => currentProductId !== null && p.id !== currentProductId);
              this.similarProducts = produits.map((p: any) => ({
                id: p.id,
                nom: p.nom,
                image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/90x90?text=Image',
                prix: p.prix
              }));
            },
            error: (err: any) => {
              this.similarProducts = [];
            }
          });
        } else {
          this.similarProducts = [];
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit:', err);
        this.error = 'Erreur lors du chargement du produit';
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  addToCartAndGoToCart() {
    if (this.product) {
      this.cartService.addToBackendCart(this.product.id, 1).subscribe({
        next: () => {
          this.snackBar.open('Produit ajouté au panier (synchronisé)', 'Fermer', { duration: 2000 });
          this.router.navigate(['/cart']);
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 2000 });
        }
      });
    }
  }

  addToCartOnly() {
    if (this.product) {
      this.cartService.addToBackendCart(this.product.id, 1).subscribe({
        next: () => {
          this.snackBar.open('Produit ajouté au panier (synchronisé)', 'Fermer', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 2000 });
        }
      });
    }
  }

  buyNow() {
    if (this.product) {
      const cartProduct = {
        ...this.product,
        name: this.product.nom,
        price: this.product.prix,
        image: this.product.images && this.product.images.length > 0 ? this.product.images[0].url : undefined,
        seller: this.product.boutique ? this.product.boutique.nom : 'Vendeur',
        sellerId: this.product.boutique ? this.product.boutique.id : 1,
        maxQuantity: this.product.stock || 10,
        available: this.product.stock > 0
      };
      this.cartService.addToCart(cartProduct, 1);
      this.router.navigate(['/cart']);
    }
  }

  getProductImage(): string {
    if (this.product) {
      // Cas 1 : images[] (ancienne logique)
      if (this.product.images && this.product.images.length > 0) {
        const mainImage = this.product.images.find(img => img.est_principale);
        return mainImage ? mainImage.url : this.product.images[0].url;
      }
      // Cas 2 : champ image (string)
      if (this.product.image) {
        if (typeof this.product.image === 'string') {
          if (this.product.image.startsWith('/uploads/')) {
            return `http://localhost:3308${this.product.image}`;
          }
          return `http://localhost:3308/uploads/products/${this.product.image}`;
        }
      }
    }
    return 'assets/images/placeholder-product.jpg';
  }
}
