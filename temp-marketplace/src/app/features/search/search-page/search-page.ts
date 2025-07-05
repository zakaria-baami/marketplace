import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ProductCardComponent
  ],
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.css']
})
export class SearchPageComponent implements OnInit {
  searchQuery: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = false;
  activeTab = 0;
  
  // Search suggestions
  searchSuggestions: string[] = [];
  recentSearches: string[] = [];
  popularSearches = [
    'handmade jewelry', 'vintage furniture', 'custom gifts', 
    'eco-friendly products', 'personalized items', 'art prints'
  ];

  // Pagination
  pageSize = 12;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadProducts();
    });
    this.loadRecentSearches();
  }

  loadRecentSearches() {
    // Load from localStorage
    const recent = localStorage.getItem('recentSearches');
    this.recentSearches = recent ? JSON.parse(recent) : [];
  }

  saveSearchToHistory(query: string) {
    if (!query.trim()) return;
    
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(s => s !== query);
    
    // Add to beginning
    this.recentSearches.unshift(query);
    
    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  loadProducts() {
    // Mock data, replace with actual search API call
    this.products = Array.from({ length: 25 }).map((_, i) => ({
      id: i + 1,
      name: `Résultat de recherche ${i + 1} pour "${this.searchQuery}"`,
      price: Math.floor(Math.random() * 200) + 10,
      rating: (Math.random() * 4 + 1).toFixed(1),
      reviewCount: Math.floor(Math.random() * 150),
      image: `assets/images/product-placeholder.png`,
      seller: `Vendeur ${i % 4 + 1}`,
      isFavorite: Math.random() > 0.9
    }));
    this.filteredProducts = this.products;
    this.totalItems = this.filteredProducts.length;
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatedProducts() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }

  onSuggestionClick(suggestion: string) {
    this.searchQuery = suggestion;
    this.onSearch();
  }

  onRecentSearchClick(search: string) {
    this.searchQuery = search;
    this.onSearch();
  }

  onPopularSearchClick(search: string) {
    this.searchQuery = search;
    this.onSearch();
  }

  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getMatchScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  }
} 