import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

// App Components & Services
import { HeaderComponent } from '../../../shared/components/header/header';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Category, CategoryService } from '../../../core/services/category';
import { Product, ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
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
    // App Components
    HeaderComponent,
    ProductCardComponent
  ],
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.css']
})
export class CategoryPageComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  
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

        forkJoin({
          category: this.categoryService.getCategoryById(id),
          products: this.productService.getProducts({ categoryId: id })
        }).subscribe({
          next: ({ category, products }) => {
            this.category = category;
            this.products = products;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading category data:', err);
            this.error = 'Failed to load category details. Please try again later.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'Category ID not found in URL.';
        this.loading = false;
      }
    });
  }
} 