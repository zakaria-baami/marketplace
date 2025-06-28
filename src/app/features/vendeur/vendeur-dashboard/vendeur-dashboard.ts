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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-vendeur-dashboard',
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
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule
  ],
  templateUrl: './vendeur-dashboard.html',
  styleUrls: ['./vendeur-dashboard.css']
})
export class VendeurDashboardComponent implements OnInit {
  activeTab = 0;
  shop: any = null;
  products: any[] = [];
  orders: any[] = [];
  salesData: any = null;
  recentActivity: any[] = [];
  loading = false;

  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalItems = 0;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadShopData();
    this.loadProducts();
    this.loadOrders();
    this.loadSalesData();
    this.loadRecentActivity();
  }

  loadShopData() {
    // Mock shop data - replace with service call
    this.shop = {
      id: 1,
      name: 'Marie Créations',
      description: 'Bijoux artisanaux faits main avec amour',
      avatar: 'MC',
      grade: 'Premium',
      rating: 4.8,
      totalSales: 1250,
      totalProducts: 45,
      followers: 1200,
      memberSince: '2022',
      location: 'Paris, France',
      responseTime: '2h',
      isVerified: true,
      monthlyRevenue: 8500,
      monthlyOrders: 89,
      monthlyGrowth: 12.5
    };
  }

  loadProducts() {
    // Mock products data - replace with service call
    this.products = [
      {
        id: 1,
        name: 'Collier artisanal en argent',
        price: 45.99,
        stock: 15,
        status: 'active',
        sales: 23,
        rating: 4.8,
        reviewCount: 12,
        image: 'assets/images/product1.jpg',
        category: 'Bijoux'
      },
      {
        id: 2,
        name: 'Bracelet personnalisé',
        price: 32.00,
        stock: 8,
        status: 'active',
        sales: 18,
        rating: 4.9,
        reviewCount: 8,
        image: 'assets/images/product2.jpg',
        category: 'Bijoux'
      },
      {
        id: 3,
        name: 'Bague en or 18 carats',
        price: 299.99,
        stock: 3,
        status: 'active',
        sales: 5,
        rating: 5.0,
        reviewCount: 3,
        image: 'assets/images/product3.jpg',
        category: 'Bijoux'
      },
      {
        id: 4,
        name: 'Écharpe en soie naturelle',
        price: 45.00,
        stock: 0,
        status: 'inactive',
        sales: 12,
        rating: 4.7,
        reviewCount: 6,
        image: 'assets/images/product4.jpg',
        category: 'Accessoires'
      }
    ];
    this.totalItems = this.products.length;
  }

  loadOrders() {
    // Mock orders data - replace with service call
    this.orders = [
      {
        id: 'ORD-001',
        customer: 'Sophie Martin',
        date: '2024-01-15',
        status: 'pending',
        statusText: 'En attente',
        total: 89.99,
        items: [
          { name: 'Collier artisanal en argent', quantity: 1, price: 45.99 },
          { name: 'Bracelet personnalisé', quantity: 1, price: 44.00 }
        ],
        shippingAddress: '123 Rue de la Paix, Paris'
      },
      {
        id: 'ORD-002',
        customer: 'Pierre Dubois',
        date: '2024-01-14',
        status: 'shipped',
        statusText: 'Expédiée',
        total: 156.50,
        items: [
          { name: 'Bague en or 18 carats', quantity: 1, price: 156.50 }
        ],
        shippingAddress: '456 Avenue des Champs-Élysées, Paris',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-003',
        customer: 'Marie Leroy',
        date: '2024-01-13',
        status: 'delivered',
        statusText: 'Livrée',
        total: 35.00,
        items: [
          { name: 'Bracelet personnalisé', quantity: 1, price: 35.00 }
        ],
        shippingAddress: '789 Boulevard Saint-Germain, Paris'
      }
    ];
  }

  loadSalesData() {
    // Mock sales data - replace with service call
    this.salesData = {
      currentMonth: {
        revenue: 8500,
        orders: 89,
        growth: 12.5
      },
      previousMonth: {
        revenue: 7550,
        orders: 78,
        growth: 8.2
      },
      topProducts: [
        { name: 'Collier artisanal en argent', sales: 23, revenue: 1057.77 },
        { name: 'Bracelet personnalisé', sales: 18, revenue: 576.00 },
        { name: 'Bague en or 18 carats', sales: 5, revenue: 1499.95 }
      ],
      recentSales: [
        { date: '2024-01-15', revenue: 89.99, orders: 1 },
        { date: '2024-01-14', revenue: 156.50, orders: 1 },
        { date: '2024-01-13', revenue: 35.00, orders: 1 },
        { date: '2024-01-12', revenue: 245.99, orders: 3 },
        { date: '2024-01-11', revenue: 67.50, orders: 2 }
      ]
    };
  }

  loadRecentActivity() {
    // Mock activity data - replace with service call
    this.recentActivity = [
      {
        id: 1,
        type: 'order',
        message: 'Nouvelle commande reçue',
        details: 'ORD-001 - Sophie Martin',
        time: '2h ago',
        icon: 'shopping_cart'
      },
      {
        id: 2,
        type: 'review',
        message: 'Nouvel avis reçu',
        details: '5 étoiles pour "Collier artisanal"',
        time: '4h ago',
        icon: 'star'
      },
      {
        id: 3,
        type: 'product',
        message: 'Produit mis à jour',
        details: 'Stock mis à jour pour "Bracelet personnalisé"',
        time: '6h ago',
        icon: 'inventory'
      },
      {
        id: 4,
        type: 'sale',
        message: 'Vente réalisée',
        details: 'Bague en or 18 carats vendue',
        time: '1d ago',
        icon: 'payments'
      }
    ];
  }

  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'pending': return 'text-orange-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getOrderStatusIcon(status: string): string {
    switch (status) {
      case 'delivered': return 'check_circle';
      case 'shipped': return 'local_shipping';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getProductStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'draft': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  getProductStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'draft': return 'Brouillon';
      default: return 'Inconnu';
    }
  }

  getActivityIconColor(type: string): string {
    switch (type) {
      case 'order': return 'text-blue-600';
      case 'review': return 'text-yellow-600';
      case 'product': return 'text-green-600';
      case 'sale': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  editProduct(productId: number) {
    // TODO: Navigate to product edit page
    console.log('Edit product:', productId);
  }

  deleteProduct(productId: number) {
    this.products = this.products.filter(p => p.id !== productId);
    this.totalItems = this.products.length;
    this.snackBar.open('Produit supprimé', 'Fermer', { duration: 3000 });
  }

  toggleProductStatus(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.status = product.status === 'active' ? 'inactive' : 'active';
      this.snackBar.open(`Produit ${product.status === 'active' ? 'activé' : 'désactivé'}`, 'Fermer', { duration: 3000 });
    }
  }

  viewOrder(orderId: string) {
    // TODO: Navigate to order detail page
    console.log('View order:', orderId);
  }

  updateOrderStatus(orderId: string, status: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      const statusMap: { [key: string]: string } = {
        'pending': 'En attente',
        'processing': 'En cours',
        'shipped': 'Expédiée',
        'delivered': 'Livrée',
        'cancelled': 'Annulée'
      };
      order.statusText = statusMap[status] || 'Inconnu';
      this.snackBar.open('Statut de commande mis à jour', 'Fermer', { duration: 3000 });
    }
  }

  addProduct() {
    // TODO: Navigate to product creation page
    console.log('Add product');
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getGrowthColor(growth: number): string {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'trending_up' : 'trending_down';
  }
} 