import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { ProductService, Product } from '../../../core/services/product';
import { CategoryService, Category } from '../../../core/services/category';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-products-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ProductCardComponent
  ],
  templateUrl: './products-listing.html',
  styleUrls: ['./products-listing.css']
})
export class ProductsListingComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  cartItemsCount = 0;
  
  // Filters
  selectedCategory: number | null = null;
  searchQuery = '';
  sortBy: 'nom' | 'prix_asc' | 'prix_desc' | 'popularite' | 'recent' = 'nom';
  priceRange = { min: 0, max: 1000 };
  showAvailableOnly = true;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  
  // Available tags
  availableTags = [
    'Handmade', 'Vintage', 'Custom', 'Eco-friendly', 'Personalized',
    'Gift', 'Home Decor', 'Jewelry', 'Clothing', 'Art'
  ];

  accountMenuOpen = false;
  helpMenuOpen = false;
  private hoveringAccountMenu = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.setupRouteParams();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  setupRouteParams() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategory = params['category'] ? +params['category'] : null;
      this.applyFilters();
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories({
      actives_uniquement: true,
      format: 'liste'
    }).subscribe({
      next: (response) => {
        this.categories = response.categories || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  public loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Vérifier l'authentification
    let token = null;
    let role = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token');
      role = localStorage.getItem('role');
    }

    if (this.selectedCategory) {
      // Affiche dynamiquement les produits de la catégorie sélectionnée
      this.productService.getProductsByCategory(this.selectedCategory, {
        page: this.currentPage,
        limit: this.itemsPerPage,
        disponibles_uniquement: this.showAvailableOnly,
        tri: this.sortBy
      }).subscribe({
        next: (response) => {
          const produits = response.data || response.produits || [];
          this.products = produits;
          this.totalItems = response.pagination?.total || produits.length || 0;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des produits';
          this.loading = false;
        }
      });
    } else {
      // Affiche tous les produits
      this.productService.getProducts({
        page: this.currentPage,
        limit: this.itemsPerPage,
        disponibles_uniquement: this.showAvailableOnly,
        tri: this.sortBy
      }).subscribe({
        next: (response) => {
          const produits = response.data || response.produits || [];
          this.products = produits;
          this.totalItems = response.pagination?.total || produits.length || 0;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des produits';
          this.loading = false;
        }
      });
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery) {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.nom.toLowerCase().includes(lowerCaseQuery) ||
        (product.boutique?.nom?.toLowerCase().includes(lowerCaseQuery) || false) ||
        (product.categorie?.nom?.toLowerCase().includes(lowerCaseQuery) || false)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categorie?.id === this.selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.prix >= this.priceRange.min && product.prix <= this.priceRange.max
    );

    // Sort
    this.sortProducts(filtered);

    this.filteredProducts = filtered;
  }

  sortProducts(products: Product[]) {
    switch (this.sortBy) {
      case 'prix_asc':
        products.sort((a, b) => a.prix - b.prix);
        break;
      case 'prix_desc':
        products.sort((a, b) => b.prix - a.prix);
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPriceRangeChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onAvailabilityChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  toggleFavorite(product: any) {
    product.isFavorite = !product.isFavorite;
    // TODO: Call API to update favorites
  }

  isClientConnected(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!token && role === 'client';
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleTag(tag: string) {
    // Tags filter - TODO: Add tags to Product model
    // if (this.selectedTags.length > 0) {
    //   filtered = filtered.filter(product => 
    //     this.selectedTags.some(tag => product.tags.includes(tag))
    //   );
    // }
  }

  clearFilters() {
    this.selectedCategory = null;
    this.searchQuery = '';
    this.sortBy = 'nom';
    this.priceRange = { min: 0, max: 1000 };
    this.showAvailableOnly = true;
    this.currentPage = 1;
    this.loadProducts();
  }

  getDiscountPercentage(product: any): number {
    if (!product.prix_original || product.prix_original <= product.prix) return 0;
    return Math.round(100 * (product.prix_original - product.prix) / product.prix_original);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  onProfile() {
    this.router.navigate(['/client/profile']);
  }

  onCart() {
    this.router.navigate(['/cart']);
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Téléphone & Tablette': 'smartphone',
      'TV & HIGH TECH': 'tv',
      'Informatique': 'computer',
      'Maison, cuisine & bureau': 'home',
      'Électroménager': 'kitchen',
      'Vêtements & Chaussures': 'checkroom',
      'Beauté & Santé': 'spa',
      'Jeux vidéos & Consoles': 'sports_esports',
      'Bricolage': 'build',
      'Sports & Loisirs': 'sports_soccer',
      'Bébé & Jouets': 'child_friendly',
      'Autres catégories': 'more_horiz'
    };
    return iconMap[categoryName] || 'category';
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + maxPages - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  onAccountMenuEnter() {
    this.hoveringAccountMenu = true;
  }

  onAccountMenuLeave() {
    setTimeout(() => {
      this.hoveringAccountMenu = false;
      if (!this.hoveringAccountMenu) this.accountMenuOpen = false;
    }, 150);
  }

  toggleHelpMenu() {
    this.helpMenuOpen = !this.helpMenuOpen;
  }

  closeHelpMenu() {
    setTimeout(() => this.helpMenuOpen = false, 150);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && this.accountMenuOpen) {
      this.accountMenuOpen = false;
    }
    if (!this.eRef.nativeElement.contains(event.target) && this.helpMenuOpen) {
      this.helpMenuOpen = false;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.accountMenuOpen = false;
  }

  logout() {
    // Ajoute ici la logique de déconnexion si besoin
    this.accountMenuOpen = false;
    this.router.navigate(['/login']);
  }
} 