import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header';

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
    HeaderComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent {
  selectedQuantity = 1;
  selectedImageIndex = 0;
  isFavorite = false;

  product = {
    id: 1,
    name: 'Collier artisanal en argent avec pendentif lune',
    price: 45.99,
    originalPrice: 59.99,
    description: 'Un magnifique collier artisanal en argent 925 avec un pendentif en forme de lune. Chaque pièce est unique et fabriquée à la main par nos artisans expérimentés.',
    rating: 4.8,
    reviewCount: 23,
    stock: 12,
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
    ],
    category: 'Bijoux & Accessoires',
    tags: ['Artisanal', 'Argent 925', 'Fait main', 'Unique'],
    seller: {
      name: 'Marie Créations',
      avatar: 'MC',
      rating: 4.9,
      totalSales: 1250,
      memberSince: '2020',
      grade: 'Premium',
      isVerified: true,
      responseTime: '< 2h',
      location: 'Paris, France'
    },
    features: [
      'Argent 925 certifié',
      'Livraison gratuite',
      'Emballage cadeau inclus',
      'Garantie 2 ans'
    ],
    specifications: {
      'Matériau': 'Argent 925',
      'Longueur chaîne': '45 cm (ajustable)',
      'Taille pendentif': '2.5 x 1.8 cm',
      'Poids': '8.5 g',
      'Style': 'Moderne minimaliste',
      'Entretien': 'Nettoyer avec un chiffon doux'
    }
  };

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
