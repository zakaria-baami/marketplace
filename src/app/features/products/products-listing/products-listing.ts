import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, Product } from '../../../core/services/product';
import { CategoryService, Category } from '../../../core/services/category';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { CartService } from '../../../core/services/cart';
import { RoleHeaderComponent } from '../../../shared/components/role-header/role-header';

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
    ProductCardComponent,
    RoleHeaderComponent
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
  selectedCategory = '';
  priceRange = [0, 1000];
  selectedRating = 0;
  selectedTags: string[] = [];
  searchQuery = '';
  sortBy = 'relevance';
  
  // Pagination - Temporarily disabled
  // currentPage = 1;
  // totalPages = 1;
  // totalItems = 0;
  // limit = 20;
  
  // Available tags
  availableTags = [
    'Handmade', 'Vintage', 'Custom', 'Eco-friendly', 'Personalized',
    'Gift', 'Home Decor', 'Jewelry', 'Clothing', 'Art'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit() {
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
      this.selectedCategory = params['category'] || '';
      this.applyFilters();
    });
  }

  loadCategories() {
    this.categoryService.getCategoriesWithStats().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        console.log('✅ Catégories chargées:', data);
      },
      error: (err: any) => {
        console.error('❌ Erreur chargement catégories:', err);
        // Fallback vers les catégories sans stats
        this.categoryService.getCategories().subscribe({
          next: (fallbackData: Category[]) => {
            this.categories = fallbackData;
            console.log('✅ Catégories chargées (fallback):', fallbackData);
          },
          error: (fallbackErr: any) => {
            this.error = 'Failed to load categories. Please try again later.';
            console.error('❌ Erreur fallback catégories:', fallbackErr);
          }
        });
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts({}).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data; // Initialize filtered products
        this.loading = false;
        // Re-apply filters after products are loaded
        this.applyFilters();
      },
      error: (err: any) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery) {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.nom.toLowerCase().includes(lowerCaseQuery) ||
        product.boutique.nom.toLowerCase().includes(lowerCaseQuery) ||
        product.categorie.nom.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categorie.nom === this.selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.prix >= this.priceRange[0] && product.prix <= this.priceRange[1]
    );

    // Rating filter - TODO: Add rating to Product model
    // if (this.selectedRating > 0) {
    //   filtered = filtered.filter(product => 
    //     product.rating >= this.selectedRating
    //   );
    // }

    // Tags filter - TODO: Add tags to Product model
    // if (this.selectedTags.length > 0) {
    //   filtered = filtered.filter(product => 
    //     this.selectedTags.some(tag => product.tags.includes(tag))
    //   );
    // }

    // Sort
    this.sortProducts(filtered);

    this.filteredProducts = filtered;
    // this.totalItems = filtered.length;
    // this.currentPage = 0;
  }

  sortProducts(products: Product[]) {
    switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-high':
        products.sort((a, b) => b.prix - a.prix);
        break;
      // case 'rating': // TODO: Add rating to Product model
      //   products.sort((a, b) => b.rating - a.rating);
      //   break;
      // case 'newest': // TODO: Add createdAt to Product model
      //   products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      //   break;
      // case 'popular': // TODO: Add reviewCount to Product model
      //   products.sort((a, b) => b.reviewCount - a.reviewCount);
      //   break;
      default: // relevance
        // Keep original order for relevance
        break;
    }
  }

  // onPageChange(page: number) {
  //   this.currentPage = page;
  //   this.loadProducts();
  // }

  toggleFavorite(product: any) {
    product.isFavorite = !product.isFavorite;
    // TODO: Call API to update favorites
  }

  isClientConnected(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!token && role === 'client';
  }

  selectCategory(categoryName: string) {
    if (this.selectedCategory === categoryName) {
      // Si la même catégorie est cliquée, on la désélectionne
      this.selectedCategory = '';
    } else {
      this.selectedCategory = categoryName;
    }
    
    // Trouver la catégorie par son nom pour obtenir son ID
    const category = this.categories.find(cat => cat.nom === categoryName);
    if (category) {
      // Naviguer vers la page de la catégorie avec l'ID
      this.router.navigate(['/categories', category.id], {
        queryParams: { 
          category: categoryName,
          q: this.searchQuery || undefined
        }
      });
    } else {
      // Fallback : naviguer avec le nom si l'ID n'est pas trouvé
      this.router.navigate(['/categories', categoryName], {
        queryParams: { 
          category: categoryName,
          q: this.searchQuery || undefined
        }
      });
    }
  }

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.priceRange = [0, 1000];
    this.selectedRating = 0;
    this.selectedTags = [];
    this.sortBy = 'relevance';
    this.applyFilters();
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
      'Électronique': 'devices',
      'Vêtements': 'checkroom',
      'Maison & Jardin': 'home',
      'Sports & Loisirs': 'sports_soccer',
      'Livres & Médias': 'book',
      'Beauté & Santé': 'spa',
      'Automobile': 'directions_car',
      'Alimentation': 'restaurant',
      'Jewelry & Accessories': 'diamond',
      'Clothing & Shoes': 'checkroom',
      'Home & Living': 'home',
      'Wedding & Party': 'celebration',
      'Toys & Entertainment': 'toys',
      'Art & Collectibles': 'palette',
      'Craft Supplies & Tools': 'build',
      'Vintage': 'history'
    };
    
    return iconMap[categoryName] || 'category';
  }
} 