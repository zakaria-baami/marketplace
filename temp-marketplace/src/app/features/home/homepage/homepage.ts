import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { HomeHeaderComponent } from '../../../shared/components/home-header/home-header';
import { CategoryService, Category } from '../../../core/services/category';
import { ProductService, Product } from '../../../core/services/product';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    FormsModule, 
    ProductCardComponent,
    HomeHeaderComponent
  ],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class HomepageComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    // Charger les catégories
    this.categoryService.getCategories({
      actives_uniquement: true,
      avec_produits_uniquement: true,
      format: 'liste'
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data.slice(0, 6); // Limiter à 6 catégories
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.error = 'Erreur lors du chargement des catégories';
      }
    });

    // Charger les produits en vedette (disponibles uniquement)
    this.productService.getProducts({
      disponibles_uniquement: true,
      limit: 8,
      tri: 'recent'
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.featuredProducts = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.error = 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Mode': 'checkroom',
      'Maison': 'home',
      'Bijoux': 'diamond',
      'Art': 'palette',
      'Vintage': 'history',
      'Jouets': 'toys',
      'Électronique': 'devices',
      'Livre': 'book',
      'Sport': 'sports_soccer',
      'Cuisine': 'restaurant',
      'Jardin': 'yard',
      'Automobile': 'directions_car'
    };
    
    return iconMap[categoryName] || 'category';
  }

  getCategoryColor(category: Category): string {
    return category.couleur || '#3f51b5';
  }
}