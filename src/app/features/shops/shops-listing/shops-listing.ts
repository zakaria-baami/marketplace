import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-shops-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './shops-listing.html',
  styleUrls: ['./shops-listing.css']
})
export class ShopsListingComponent implements OnInit {
  shops: any[] = [];
  filteredShops: any[] = [];
  loading = false;
  
  // Filtering & Sorting
  searchQuery = '';
  sortBy = 'rating';
  
  // Pagination
  pageSize = 12;
  pageSizeOptions = [12, 24, 36];
  currentPage = 0;
  totalItems = 0;

  constructor() {}

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.loading = true;
    // Mock shops data - replace with service call
    setTimeout(() => {
      this.shops = [
        {
          id: 1,
          name: 'Marie Créations',
          slug: 'marie-creations',
          tagline: 'Bijoux artisanaux faits main avec amour',
          rating: 4.8,
          totalSales: 1250,
          productCount: 45,
          followers: 1200,
          memberSince: '2022',
          location: 'Paris, France',
          isVerified: true,
          grade: 'Premium',
          coverImage: 'assets/images/shop-cover-1.jpg',
          avatar: 'MC',
          products: [
            { name: 'Collier en argent', image: 'assets/images/product-thumb-1.jpg' },
            { name: 'Bracelet personnalisé', image: 'assets/images/product-thumb-2.jpg' },
            { name: 'Bague en or', image: 'assets/images/product-thumb-3.jpg' }
          ]
        },
        {
          id: 2,
          name: 'Atelier Poterie',
          slug: 'atelier-poterie',
          tagline: 'Céramique & Art de la table uniques',
          rating: 4.9,
          totalSales: 890,
          productCount: 32,
          followers: 850,
          memberSince: '2021',
          location: 'Lyon, France',
          isVerified: true,
          grade: 'Professionnel',
          coverImage: 'assets/images/shop-cover-2.jpg',
          avatar: 'AP',
          products: [
            { name: 'Vase en céramique', image: 'assets/images/product-thumb-4.jpg' },
            { name: 'Tasse faite main', image: 'assets/images/product-thumb-5.jpg' },
            { name: 'Assiette décorative', image: 'assets/images/product-thumb-6.jpg' }
          ]
        },
        {
          id: 3,
          name: 'Vintage Style',
          slug: 'vintage-style',
          tagline: 'Trouvailles vintage et pièces uniques',
          rating: 4.7,
          totalSales: 674,
          productCount: 120,
          followers: 2300,
          memberSince: '2020',
          location: 'Marseille, France',
          isVerified: false,
          grade: 'Premium',
          coverImage: 'assets/images/shop-cover-3.jpg',
          avatar: 'VS',
          products: [
            { name: 'Sac en cuir vintage', image: 'assets/images/product-thumb-7.jpg' },
            { name: 'Robe à fleurs', image: 'assets/images/product-thumb-8.jpg' },
            { name: 'Chapeau de paille', image: 'assets/images/product-thumb-9.jpg' }
          ]
        },
        // Add more shops as needed
      ];
      
      this.applyFilters();
      this.totalItems = this.filteredShops.length;
      this.loading = false;
    }, 1000);
  }

  applyFilters() {
    let shops = [...this.shops];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      shops = shops.filter(shop => 
        shop.name.toLowerCase().includes(query) || 
        shop.tagline.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'rating':
        shops.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        shops.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case 'newest':
        shops.sort((a, b) => new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime());
        break;
    }

    this.filteredShops = shops;
    this.totalItems = this.filteredShops.length;
    this.currentPage = 0;
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatedShops() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredShops.slice(startIndex, endIndex);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }
} 