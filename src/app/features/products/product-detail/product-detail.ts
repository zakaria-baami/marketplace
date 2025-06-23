import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header';
import { ProductService } from '../../../core/services/product';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    HeaderComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  selectedQuantity = 1;
  selectedImageIndex = 0;
  isFavorite = false;
  product: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
        this.loading = false;
        this.error = "Product ID is missing."
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        // ... maybe call other methods to load related products, etc.
      },
      error: (err) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  reviews = [
    {
      id: 1,
      author: 'Sophie M.',
      avatar: 'SM',
      rating: 5,
      date: '2024-06-15',
      title: 'Magnifique collier !',
      content: 'Exactement comme sur les photos. La qualité est au rendez-vous et l\'expédition a été très rapide. Je recommande vivement !',
      helpful: 12,
      images: ['/api/placeholder/100/100']
    },
    {
      id: 2,
      author: 'Emma L.',
      avatar: 'EL',
      rating: 5,
      date: '2024-06-10',
      title: 'Parfait pour un cadeau',
      content: 'J\'ai offert ce collier à ma sœur et elle l\'adore. L\'emballage était très soigné.',
      helpful: 8,
      images: []
    },
    {
      id: 3,
      author: 'Claire D.',
      avatar: 'CD',
      rating: 4,
      date: '2024-06-05',
      title: 'Très joli',
      content: 'Le collier est très beau, juste un peu plus petit que je ne l\'imaginais mais c\'est parfait finalement.',
      helpful: 5,
      images: []
    }
  ];

  relatedProducts = [
    {
      id: 2,
      name: 'Boucles d\'oreilles assorties',
      price: 29.99,
      image: '/api/placeholder/200/200',
      rating: 4.7,
      seller: 'Marie Créations'
    },
    {
      id: 3,
      name: 'Bracelet argent minimaliste',
      price: 35.99,
      image: '/api/placeholder/200/200',
      rating: 4.6,
      seller: 'Marie Créations'
    },
    {
      id: 4,
      name: 'Pendentif étoile',
      price: 39.99,
      image: '/api/placeholder/200/200',
      rating: 4.9,
      seller: 'Art & Bijoux'
    },
    {
      id: 5,
      name: 'Chaîne argent premium',
      price: 42.99,
      image: '/api/placeholder/200/200',
      rating: 4.8,
      seller: 'Silver Dreams'
    }
  ];

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  addToCart() {
    console.log(`Adding ${this.selectedQuantity} item(s) to cart`);
    // TODO: Implement add to cart functionality
  }

  buyNow() {
    console.log('Buying now');
    // TODO: Implement buy now functionality
  }

  contactSeller() {
    console.log('Contacting seller');
    // TODO: Implement contact seller functionality
  }

  visitShop() {
    console.log('Visiting shop');
    // TODO: Navigate to seller's shop
  }

  incrementQuantity() {
    if (this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  decrementQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  reportReviewHelpful(reviewId: number) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) {
      review.helpful++;
    }
  }

  getStockStatus() {
    if (this.product.stock === 0) {
      return { text: 'Rupture de stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (this.product.stock <= 5) {
      return { text: `Plus que ${this.product.stock} en stock`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else {
      return { text: 'En stock', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.floor(rating));
  }

  getSavingsPercentage(): number {
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}
