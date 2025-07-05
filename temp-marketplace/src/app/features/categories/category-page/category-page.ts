import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

// App Components & Services
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Category, CategoryService } from '../../../core/services/category';
import { Product, ProductService } from '../../../core/services/product';

interface Filters {
  prix_min: number | null;
  prix_max: number | null;
  disponibles_seulement: boolean;
  tri: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // Material Modules
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    // App Components
    ProductCardComponent
  ],
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.css']
})
export class CategoryPageComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];
  loading = true;
  loadingProducts = false;
  error: string | null = null;
  
  // Filters and pagination
  filters: Filters = {
    prix_min: null,
    prix_max: null,
    disponibles_seulement: false,
    tri: 'recent'
  };
  
  pagination: Pagination = {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  };
  
  sortOptions: SortOption[] = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name_asc', label: 'Nom A-Z' },
    { value: 'name_desc', label: 'Nom Z-A' }
  ];
  
  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // Using switchMap to handle route parameter changes gracefully
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      if (categoryId) {
        this.loading = true;
        this.error = null;
        const id = +categoryId;

        // Charger d'abord la catégorie
        this.categoryService.getCategoryById(id).subscribe({
          next: (response) => {
            if (response.success && response.data && response.data.length > 0) {
              this.category = response.data[0];
            }
            this.loading = false;
            
            // Ensuite charger les produits de cette catégorie
            this.loadProductsByCategory(id);
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la catégorie:', err);
            this.error = 'Impossible de charger les détails de la catégorie. Veuillez réessayer plus tard.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'ID de catégorie non trouvé dans l\'URL.';
        this.loading = false;
      }
    });
  }

  private loadProductsByCategory(categoryId: number): void {
    this.loadingProducts = true;
    // Utiliser l'endpoint spécifique pour les produits d'une catégorie
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
        // Handle ProductResponse structure
        if (response.success && response.data) {
          this.products = response.data;
          
          // Handle pagination if available
          if (response.pagination) {
            this.pagination = {
              page: response.pagination.page || 1,
              limit: response.pagination.limit || 12,
              total: response.pagination.total || 0,
              totalPages: response.pagination.total_pages || 0
            };
          } else {
            // If no pagination, calculate from products array
            this.pagination.total = this.products.length;
            this.pagination.totalPages = Math.ceil(this.products.length / this.pagination.limit);
          }
        } else {
          this.products = [];
          this.pagination.total = 0;
          this.pagination.totalPages = 0;
        }
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
        // Ne pas afficher d'erreur si c'est juste qu'il n'y a pas de produits
        this.products = [];
        this.pagination.total = 0;
        this.pagination.totalPages = 0;
        this.loadingProducts = false;
      }
    });
  }

  // Filter methods
  onPriceFilterChange(): void {
    this.applyFilters();
  }

  onAvailabilityChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      prix_min: null,
      prix_max: null,
      disponibles_seulement: false,
      tri: 'recent'
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.prix_min !== null || 
           this.filters.prix_max !== null || 
           this.filters.disponibles_seulement || 
           this.filters.tri !== 'recent';
  }

  getSortLabel(): string {
    const option = this.sortOptions.find(opt => opt.value === this.filters.tri);
    return option ? option.label : 'Plus récents';
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (!this.category) return;
    
    this.loadingProducts = true;
    // Reset to first page when applying filters
    this.pagination.page = 1;
    
    // Here you would typically call the API with filters
    // For now, we'll just reload the products
    this.loadProductsByCategory(this.category.id);
  }
} 