import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, Product } from '../../core/services/product';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: '',
  styleUrls: []
})
export class ClientHomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  cartItemsCount = 0;

  // Filtres
  selectedCategory = '';
  priceRange = [0, 1000];
  selectedTags: string[] = [];
  searchQuery = '';
  availableTags = [
    'Handmade', 'Vintage', 'Custom', 'Eco-friendly', 'Personalized',
    'Gift', 'Home Decor', 'Jewelry', 'Clothing', 'Art'
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadCartCount();
  }

  loadCategories() {
    this.categories = [
      { id: 1, nom: 'Bijoux & Accessoires', count: 1250 },
      { id: 2, nom: 'Vêtements & Chaussures', count: 890 },
      { id: 3, nom: 'Maison & Déco', count: 2100 },
      { id: 4, nom: 'Mariage & Fête', count: 450 },
      { id: 5, nom: 'Jouets & Loisirs', count: 780 },
      { id: 6, nom: 'Art & Collections', count: 1200 },
      { id: 7, nom: 'Fournitures & Outils', count: 650 },
      { id: 8, nom: 'Vintage', count: 320 }
    ];
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getProducts({}).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
        this.applyFilters();
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des produits.';
        this.loading = false;
      }
    });
  }

  loadCartCount() {
    this.cartItemsCount = Number(localStorage.getItem('cartCount')) || 0;
  }

  onSearch() {
    this.applyFilters();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.priceRange = [0, 1000];
    this.selectedTags = [];
    this.searchQuery = '';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(prod => prod.nom.toLowerCase().includes(q));
    }
    if (this.selectedCategory) {
      filtered = filtered.filter(prod => prod.categorie && prod.categorie.nom === this.selectedCategory);
    }
    filtered = filtered.filter(prod => prod.prix >= this.priceRange[0] && prod.prix <= this.priceRange[1]);
    this.filteredProducts = filtered;
  }

  onProfile() {
    // Rediriger vers la page profil client
  }

  onCart() {
    // Rediriger vers la page panier client
  }
} 