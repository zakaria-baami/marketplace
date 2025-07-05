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
import { HttpClient } from '@angular/common/http';
import { AddProductFormComponent } from '../../shops/add-product-form/add-product-form';

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
    MatMenuModule,
    AddProductFormComponent
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

  newOrdersCount = 0;
  showAddProductForm = false;
  categories: any[] = [];

  salesDataByMonth = [
    { month: 'Janvier', revenue: 8500, orders: 89 },
    { month: 'Février', revenue: 7550, orders: 78 },
    { month: 'Mars', revenue: 9100, orders: 95 },
    { month: 'Avril', revenue: 10200, orders: 110 },
    { month: 'Mai', revenue: 9800, orders: 105 }
  ];

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.loadCategories();
    this.http.get<any>('/api/vendeur/profil').subscribe({
      next: (profil) => {
        const p = profil.data?.profil || profil.profil || profil.vendeur || profil;
        this.shop = {
          vendeurId: p.id,
          name: p.utilisateur?.nom || 'Nom non défini',
          email: p.utilisateur?.email || 'Email non défini',
          grade: p.grade?.nom || 'Grade inconnu',
          description: '', // sera mis à jour après la requête boutique
          avatar: p.utilisateur?.nom ? p.utilisateur.nom[0].toUpperCase() : '?',
          rating: 5, // valeur fictive, à remplacer si tu as une API d'avis
          totalSales: 0, // sera mis à jour après la requête stats
          totalProducts: 0, // sera mis à jour après la requête boutique
          followers: 0, // à remplacer si tu as une API d'abonnés
          isVerified: false // à remplacer si tu as une info de vérification
        };
        this.http.get<any>('/api/vendeur/boutiques').subscribe({
          next: (boutiquesRes) => {
            const boutiques = boutiquesRes.data?.boutiques || boutiquesRes.boutiques || boutiquesRes;
            if (boutiques && boutiques.length > 0) {
              const mainBoutique = boutiques[0];
              this.shop.boutique = mainBoutique;
              this.shop.description = mainBoutique.description || '';
              this.shop.totalProducts = mainBoutique.nombre_produits || 0;
              this.loadProducts();
              this.loadOrders();
              this.loadSalesData();
            } else {
              this.snackBar.open('Aucune boutique trouvée pour ce vendeur', 'Fermer', { duration: 4000 });
              this.loading = false;
            }
          },
          error: () => {
            this.loading = false;
            this.snackBar.open('Erreur lors du chargement des boutiques', 'Fermer', { duration: 4000 });
          }
        });
        // Charger les stats de ventes pour totalSales
        this.http.get<any>('/api/vendeur/statistiques').subscribe({
          next: (statsRes) => {
            const stats = statsRes.statistiques || statsRes;
            this.shop.totalSales = stats?.total_ventes || 0;
          },
          error: () => {
            this.shop.totalSales = 0;
          }
        });
      },
      error: () => {
        this.loading = false;
        this.shop = null;
        this.snackBar.open('Erreur lors du chargement du profil vendeur', 'Fermer', { duration: 4000 });
      }
    });
    this.loadRecentActivity();
    this.refreshNewOrdersCount();
  }

  loadProducts() {
    this.http.get<any[]>('/api/vendeur/produits').subscribe({
      next: (products) => {
        this.products = products;
        this.totalItems = products.length;
      },
      error: () => {
        this.products = [];
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 4000 });
      }
    });
  }

  loadOrders() {
    this.http.get<any[]>('/api/vendeur/commandes').subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: () => {
        this.orders = [];
        this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 4000 });
      }
    });
  }

  loadSalesData() {
    this.http.get<any>('/api/vendeur/statistiques').subscribe({
      next: (stats) => {
        this.salesData = stats;
      },
      error: () => {
        this.salesData = null;
        this.snackBar.open('Erreur lors du chargement des statistiques', 'Fermer', { duration: 4000 });
      }
    });
  }

  loadCategories() {
    this.http.get<any>('/api/categorie').subscribe({
      next: (response) => {
        this.categories = response.categories || response || [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
        this.categories = [];
      }
    });
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
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    this.http.delete(`/api/produits/${productId}`).subscribe({
      next: () => {
        this.snackBar.open('Produit supprimé', 'Fermer', { duration: 3000 });
        this.loadProducts();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', { duration: 4000 });
      }
    });
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

  onProductAdded(product: any) {
    this.showAddProductForm = false;
    this.loadProducts();
    this.snackBar.open('Produit ajouté avec succès!', 'Fermer', { duration: 3000 });
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

  refreshNewOrdersCount() {
    // Charger les nouvelles commandes depuis le stockage local
    let orders = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      orders = JSON.parse(localStorage.getItem('vendeur_new_orders') || '[]');
    }
    this.newOrdersCount = orders.length;
  }
} 