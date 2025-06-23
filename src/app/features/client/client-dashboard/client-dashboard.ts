import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
    HeaderComponent
  ],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.css']
})
export class ClientDashboardComponent implements OnInit {
  activeTab = 0;
  user: any = null;
  orders: any[] = [];
  favorites: any[] = [];
  addresses: any[] = [];
  loading = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadUserData();
    this.loadOrders();
    this.loadFavorites();
    this.loadAddresses();
  }

  loadUserData() {
    // Mock user data - replace with service call
    this.user = {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      avatar: 'MD',
      memberSince: '2023',
      totalOrders: 15,
      totalSpent: 1250.50,
      loyaltyPoints: 1250,
      nextLevel: 2000,
      level: 'Bronze',
      levelProgress: 62.5
    };
  }

  loadOrders() {
    // Mock orders data - replace with service call
    this.orders = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        statusText: 'Livrée',
        total: 89.99,
        items: [
          { name: 'Collier artisanal en argent', quantity: 1, price: 45.99 },
          { name: 'Vase en céramique fait main', quantity: 1, price: 44.00 }
        ],
        seller: 'Marie Créations',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-18'
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'shipped',
        statusText: 'Expédiée',
        total: 156.50,
        items: [
          { name: 'Sac en cuir vintage', quantity: 1, price: 89.99 },
          { name: 'Tableau aquarelle original', quantity: 1, price: 66.51 }
        ],
        seller: 'Vintage Style',
        trackingNumber: 'TRK987654321',
        estimatedDelivery: '2024-01-13'
      },
      {
        id: 'ORD-003',
        date: '2024-01-05',
        status: 'processing',
        statusText: 'En cours',
        total: 35.00,
        items: [
          { name: 'Bracelet personnalisé', quantity: 1, price: 35.00 }
        ],
        seller: 'PersonalizedGifts',
        trackingNumber: null,
        estimatedDelivery: '2024-01-12'
      }
    ];
  }

  loadFavorites() {
    // Mock favorites data - replace with service call
    this.favorites = [
      {
        id: 1,
        name: 'Bague en or 18 carats',
        price: 299.99,
        originalPrice: 399.99,
        image: 'assets/images/product1.jpg',
        seller: 'LuxuryJewelry',
        rating: 4.9,
        reviewCount: 45,
        inStock: true
      },
      {
        id: 2,
        name: 'Lampe de table design',
        price: 89.99,
        originalPrice: 89.99,
        image: 'assets/images/product2.jpg',
        seller: 'ModernHome',
        rating: 4.7,
        reviewCount: 23,
        inStock: true
      },
      {
        id: 3,
        name: 'Écharpe en soie naturelle',
        price: 45.00,
        originalPrice: 60.00,
        image: 'assets/images/product3.jpg',
        seller: 'SilkAccessories',
        rating: 4.8,
        reviewCount: 67,
        inStock: false
      }
    ];
  }

  loadAddresses() {
    // Mock addresses data - replace with service call
    this.addresses = [
      {
        id: 1,
        type: 'home',
        name: 'Domicile',
        firstName: 'Marie',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33 6 12 34 56 78',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        name: 'Bureau',
        firstName: 'Marie',
        lastName: 'Dupont',
        address: '456 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        isDefault: false
      }
    ];
  }

  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'processing': return 'text-orange-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getOrderStatusIcon(status: string): string {
    switch (status) {
      case 'delivered': return 'check_circle';
      case 'shipped': return 'local_shipping';
      case 'processing': return 'pending';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-600';
      case 'Gold': return 'text-yellow-600';
      case 'Platinum': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }

  removeFromFavorites(productId: number) {
    this.favorites = this.favorites.filter(fav => fav.id !== productId);
    this.snackBar.open('Produit retiré des favoris', 'Fermer', { duration: 3000 });
  }

  addToCart(productId: number) {
    // TODO: Add to cart logic
    this.snackBar.open('Produit ajouté au panier', 'Fermer', { duration: 3000 });
  }

  viewOrder(orderId: string) {
    // TODO: Navigate to order detail page
    console.log('View order:', orderId);
  }

  trackOrder(orderId: string) {
    // TODO: Navigate to tracking page
    console.log('Track order:', orderId);
  }

  editProfile() {
    // TODO: Navigate to profile edit page
    console.log('Edit profile');
  }

  addAddress() {
    // TODO: Navigate to address form
    console.log('Add address');
  }

  editAddress(addressId: number) {
    // TODO: Navigate to address edit form
    console.log('Edit address:', addressId);
  }

  deleteAddress(addressId: number) {
    this.addresses = this.addresses.filter(addr => addr.id !== addressId);
    this.snackBar.open('Adresse supprimée', 'Fermer', { duration: 3000 });
  }

  setDefaultAddress(addressId: number) {
    this.addresses.forEach(addr => addr.isDefault = addr.id === addressId);
    this.snackBar.open('Adresse par défaut mise à jour', 'Fermer', { duration: 3000 });
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }
} 