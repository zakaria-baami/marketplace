import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ProductCardComponent
  ],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css']
})
export class ShopPageComponent implements OnInit {
  shop: any = null;
  products: any[] = [];
  filteredProducts: any[] = [];
  shopSlug = '';
  loading = true;

  // Filtering & Sorting
  searchQuery = '';
  sortBy = 'popularity';
  
  // Pagination
  pageSize = 12;
  pageSizeOptions = [12, 24, 36];
  currentPage = 0;
  totalItems = 0;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadShopData();
  }

  loadShopData() {
    this.loading = true;
    // Mock shop and products data - replace with API call
    setTimeout(() => {
      this.shop = {
        id: 1,
        name: 'Marie Créations',
        slug: 'marie-creations',
        tagline: 'Bijoux artisanaux faits main avec amour',
        description: 'Bienvenue chez Marie Créations, où chaque bijou est une pièce unique, confectionnée avec passion et des matériaux de haute qualité. Découvrez nos collections et trouvez le bijou qui vous ressemble.',
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
        policies: {
          shipping: 'Expédition sous 2-3 jours ouvrés. Livraison gratuite pour les commandes de plus de 50€.',
          returns: 'Retours acceptés sous 14 jours. Contactez-nous pour toute question.',
        },
        reviews: [
          { author: 'Sophie M.', rating: 5, content: 'Absolument magnifique ! Le collier est encore plus beau en vrai. Envoi rapide et soigné.' },
          { author: 'Julien L.', rating: 5, content: 'Très content de mon achat. Le bracelet est de grande qualité. Je recommande cette boutique !' }
        ]
      };

      this.products = Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        name: `Bijou artisanal n°${i + 1}`,
        price: 20 + Math.random() * 100,
        originalPrice: 0,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50),
        image: `assets/images/product-placeholder.jpg`,
        seller: this.shop.name,
        isFavorite: false,
      }));
      
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  applyFilters() {
    let products = [...this.products];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(query));
    }

    switch (this.sortBy) {
      case 'popularity':
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming higher ID is newer
        products.sort((a, b) => b.id - a.id);
        break;
    }

    this.filteredProducts = products;
    this.totalItems = this.filteredProducts.length;
    this.currentPage = 0;
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
  
  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  isClientConnected(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!token && role === 'client';
  }
} 