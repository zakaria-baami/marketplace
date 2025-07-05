import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
import { OrdersService } from '../../../core/services/orders';
import { AddressService, Address } from '../../../core/services/addresses';
import { filter } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.css']
})
export class ClientDashboardComponent implements OnInit {
  activeTab = 0;
  user: ClientProfile | null = null;
  orders: ClientOrder[] = [];
  addresses: string[] = [];
  loading = false;
  showAddAddressForm = false;
  newAddress = '';
  nbCommandes: number = 0;
  montantTotal: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private ordersService: OrdersService,
    private addressService: AddressService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.loadAllData();

    // Écouter les changements de navigation pour recharger les données
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Recharger les données quand l'utilisateur revient sur cette page
      console.log('🔄 Navigation détectée, rechargement des données...');
      this.loadAllData();
    });

    // Écouter les paramètres de route pour forcer le rechargement
    this.route.queryParams.subscribe(params => {
      if (params['refresh'] === 'true') {
        console.log('🔄 Rechargement forcé détecté...');
        this.loadAllData();
        // Nettoyer le paramètre
        this.router.navigate([], { 
          relativeTo: this.route, 
          queryParams: {}, 
          replaceUrl: true 
        });
      }
    });
  }

  loadAllData() {
    this.loadUserData();
    this.loadOrders();
    this.loadAddressFromProfile();
  }

  loadUserData() {
    this.loading = true;
    this.userService.getClientProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.loadAddressFromProfile();
        console.log('✅ Profil client chargé:', profile);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement profil client:', error);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
        this.user = null;
        this.addresses = [];
        this.loading = false;
      }
    });
  }

  loadOrders() {
    console.log('🔄 Chargement des commandes...');
    this.userService.getClientOrders().subscribe({
      next: (response: any) => {
        console.log('📦 Réponse API commandes:', response);
        if (response.success && response.commandes) {
          this.orders = response.commandes;
          this.nbCommandes = response.nbCommandes || response.commandes.length;
          this.montantTotal = response.montantTotal || 0;
          console.log('✅ Commandes client chargées:', response.commandes);
        } else {
          this.orders = [];
          this.nbCommandes = 0;
          this.montantTotal = 0;
          console.log('ℹ️ Aucune commande trouvée ou réponse invalide');
        }
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement commandes:', error);
        console.error('❌ Détails erreur:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        this.orders = [];
        this.nbCommandes = 0;
        this.montantTotal = 0;
        this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadAddressFromProfile() {
    if (this.user && this.user.adresse) {
      this.addresses = [this.user.adresse];
    } else {
      this.addresses = [];
    }
  }

  // Méthode pour rafraîchir toutes les données manuellement
  refreshData() {
    console.log('🔄 Rafraîchissement manuel des données...');
    this.loading = true;
    this.loadAllData();
    this.snackBar.open('Données actualisées', 'Fermer', { duration: 2000 });
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
    // TODO: Open address form dialog
    console.log('Add address');
    this.snackBar.open('Fonctionnalité à venir', 'Fermer', { duration: 2000 });
  }

  editAddress(addressId: number) {
    // TODO: Open address form dialog with existing data
    console.log('Edit address:', addressId);
    this.snackBar.open('Fonctionnalité à venir', 'Fermer', { duration: 2000 });
  }

  deleteAddress(addressId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      this.addressService.deleteAddress(addressId).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Adresse supprimée avec succès', 'Fermer', { duration: 3000 });
            this.loadAddressFromProfile();
          } else {
            this.snackBar.open(response.message || 'Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('❌ Erreur suppression adresse:', error);
          this.snackBar.open('Erreur lors de la suppression de l\'adresse', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  setDefaultAddress(addressId: number) {
    this.addressService.setDefaultAddress(addressId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Adresse définie par défaut avec succès', 'Fermer', { duration: 3000 });
          this.loadAddressFromProfile();
        } else {
          this.snackBar.open(response.message || 'Erreur lors de la définition', 'Fermer', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('❌ Erreur définition adresse par défaut:', error);
        this.snackBar.open('Erreur lors de la définition de l\'adresse par défaut', 'Fermer', { duration: 3000 });
      }
    });
  }

  isClientConnected(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.authService.isLoggedIn && currentUser?.role === 'client';
  }

  openAddAddressForm() {
    this.showAddAddressForm = true;
    this.newAddress = '';
  }

  closeAddAddressForm() {
    this.showAddAddressForm = false;
    this.newAddress = '';
  }

  submitNewAddress() {
    if (!this.newAddress.trim()) {
      this.snackBar.open('Veuillez saisir une adresse.', 'Fermer', { duration: 2000 });
      return;
    }
    this.addressService.addAddress({ address: this.newAddress }).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Adresse ajoutée avec succès', 'Fermer', { duration: 3000 });
          this.loadAddressFromProfile();
          this.closeAddAddressForm();
        } else {
          this.snackBar.open(response.message || 'Erreur lors de l\'ajout', 'Fermer', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('❌ Erreur ajout adresse:', error);
        this.snackBar.open('Erreur lors de l\'ajout de l\'adresse', 'Fermer', { duration: 3000 });
      }
    });
  }
} 