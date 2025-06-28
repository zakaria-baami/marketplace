import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, ClientProfile, ClientOrder } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';

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
    MatProgressBarModule
  ],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.css']
})
export class ClientDashboardComponent implements OnInit {
  activeTab = 0;
  user: ClientProfile | null = null;
  orders: ClientOrder[] = [];
  favorites: any[] = [];
  addresses: any[] = [];
  loading = false;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.loadUserData();
    this.loadOrders();
    this.loadFavorites();
    this.loadAddresses();
  }

  loadUserData() {
    this.loading = true;
    this.userService.getClientProfile().subscribe({
      next: (clientProfile: ClientProfile) => {
        this.user = clientProfile;
        console.log('✅ Profil client chargé:', clientProfile);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement profil client:', error);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadOrders() {
    this.userService.getClientOrders().subscribe({
      next: (response) => {
        if (response.success && response.commandes) {
          this.orders = response.commandes;
          console.log('✅ Commandes client chargées:', response.commandes);
        } else {
          this.orders = [];
          console.log('ℹ️ Aucune commande trouvée');
        }
      },
      error: (error) => {
        console.error('❌ Erreur chargement commandes:', error);
        this.orders = [];
        this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 3000 });
      }
    });
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
      case 'livre': return 'text-green-600';
      case 'expedie': return 'text-blue-600';
      case 'valide': return 'text-orange-600';
      case 'annule': return 'text-red-600';
      case 'actif': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  getOrderStatusIcon(status: string): string {
    switch (status) {
      case 'livre': return 'check_circle';
      case 'expedie': return 'local_shipping';
      case 'valide': return 'pending';
      case 'annule': return 'cancel';
      case 'actif': return 'shopping_cart';
      default: return 'help';
    }
  }

  getOrderStatusText(status: string): string {
    switch (status) {
      case 'livre': return 'Livrée';
      case 'expedie': return 'Expédiée';
      case 'valide': return 'Validée';
      case 'annule': return 'Annulée';
      case 'actif': return 'En cours';
      default: return 'Inconnu';
    }
  }

  getProgressValue(): number {
    if (!this.user?.statistiques?.total_depense) return 0;
    // Calculer une progression basée sur les dépenses (exemple: 1000€ = 100%)
    const maxValue = 1000; // 1000€ = 100%
    return Math.min((this.user.statistiques.total_depense / maxValue) * 100, 100);
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

  viewOrder(orderId: number) {
    // TODO: Navigate to order detail page
    console.log('View order:', orderId);
  }

  trackOrder(orderId: number) {
    // TODO: Navigate to tracking page
    console.log('Track order:', orderId);
  }

  editProfile() {
    this.router.navigate(['/client/edit-profile']);
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

  isClientConnected(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!token && role === 'client';
  }
} 