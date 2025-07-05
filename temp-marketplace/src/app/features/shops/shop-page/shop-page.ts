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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { TemplateModernComponent } from '../templates/template-modern/template-modern';
import { TemplateClassicComponent } from '../templates/template-classic/template-classic';
import { TemplateMinimalistComponent } from '../templates/template-minimalist/template-minimalist';
import { TemplateBoldComponent } from '../templates/template-bold/template-bold';
import { AddProductFormComponent } from '../add-product-form/add-product-form';

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
    MatSnackBarModule,
    TemplateModernComponent,
    TemplateClassicComponent,
    TemplateMinimalistComponent,
    TemplateBoldComponent,
    AddProductFormComponent
  ],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css']
})
export class ShopPageComponent implements OnInit {
  shop: any = null;
  products: any[] = [];
  filteredProducts: any[] = [];
  shopId = '';
  loading = true;
  isVendeurApercu = true; // Forcé pour test

  // Filtering & Sorting
  searchQuery = '';
  sortBy = 'popularity';
  
  // Pagination
  pageSize = 12;
  pageSizeOptions = [12, 24, 36];
  currentPage = 0;
  totalItems = 0;
  
  // Formulaire d'ajout de produit
  showAddProductForm = false;
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Vérifier que nous sommes côté client
    if (typeof window !== 'undefined' && window.localStorage) {
      // Détection du rôle vendeur connecté
      const role = localStorage.getItem('role');
      const vendeurId = localStorage.getItem('vendeur_id');
      if (role === 'vendeur') {
        this.isVendeurApercu = true;
      }
    }
    
    this.route.params.subscribe(params => {
      this.shopId = params['id'];
      if (this.shopId) {
        this.loadShopData();
        this.loadCategories();
      }
    });
  }

  loadShopData() {
    console.log('[ShopPage] Chargement des données de la boutique:', this.shopId);
    this.loading = true;

    this.http.get<any>(`/api/boutiques/${this.shopId}`).subscribe({
      next: (response) => {
        console.log('[ShopPage] Données boutique reçues:', response);
        
        if (!response.success) {
          throw new Error(response.message || 'Erreur lors du chargement');
        }

        // Mapper le template
        const templateMap: any = {
          1: 'Artisan',
          2: 'Galleria', 
          3: 'Boutique',
          4: 'Vogue'
        };
        
        const templateId = response.template?.id || response.template_id;
        const templateName = templateMap[templateId] || 'Artisan';
        
        this.shop = {
          ...response.boutique, // Utiliser response.boutique au lieu de response
          template: templateName,
          template_id: templateId
        };
        
        console.log('[ShopPage] shop.id disponible:', this.shop.id);
        
        // Gérer les produits
        if (response.boutique.produits && Array.isArray(response.boutique.produits)) {
          this.products = response.boutique.produits;
          this.filteredProducts = [...this.products];
          this.totalItems = this.products.length;
        } else {
          this.products = [];
          this.filteredProducts = [];
          this.totalItems = 0;
        }
        
        this.loading = false;
        console.log('[ShopPage] Données boutique chargées:', {
          shop: this.shop,
          productsCount: this.products.length,
          template: templateName
        });
      },
      error: (error) => {
        console.error('[ShopPage] Erreur lors de la récupération des données de la boutique:', error);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement de la boutique', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  loadCategories() {
    this.http.get<any>('/api/categorie').subscribe({
      next: (result) => {
        this.categories = result.categories || [];
        console.log('[ShopPage] Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('[ShopPage] Erreur lors du chargement des catégories:', error);
        this.categories = [];
      }
    });
  }

  onProductAdded(response: any) {
    console.log('[ShopPage] Produit ajouté:', response);
    this.showAddProductForm = false;
    this.loadShopData(); // Recharger les données de la boutique
  }

  // Méthodes de gestion des produits
  editProduct(product: any) {
    console.log('[ShopPage] Édition du produit:', product);
    // TODO: Implémenter l'édition de produit
    this.snackBar.open('Fonctionnalité d\'édition à venir', 'Fermer', {
      duration: 3000
    });
  }

  deleteProduct(product: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.nom}" ?`)) {
      console.log('[ShopPage] Suppression du produit:', product);
      this.http.delete(`/api/produits/${product.id}`).subscribe({
        next: (response) => {
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadShopData(); // Recharger les données
        },
        error: (error) => {
          console.error('[ShopPage] Erreur lors de la suppression:', error);
          this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  toggleProductStatus(product: any) {
    const newStatus = !product.actif;
    const action = newStatus ? 'activer' : 'désactiver';
    
    if (confirm(`Êtes-vous sûr de vouloir ${action} le produit "${product.nom}" ?`)) {
      console.log('[ShopPage] Changement de statut du produit:', product, 'Nouveau statut:', newStatus);
      
      this.http.patch(`/api/produits/${product.id}`, { actif: newStatus }).subscribe({
        next: (response) => {
          this.snackBar.open(`Produit ${action} avec succès`, 'Fermer', {
            duration: 3000
          });
          this.loadShopData(); // Recharger les données
        },
        error: (error) => {
          console.error('[ShopPage] Erreur lors du changement de statut:', error);
          this.snackBar.open(`Erreur lors de l'${action} du produit`, 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  // Méthodes de filtrage et tri
  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.totalItems = this.filteredProducts.length;
    this.currentPage = 0;
  }

  sortProducts() {
    switch (this.sortBy) {
      case 'price_asc':
        this.filteredProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'price_desc':
        this.filteredProducts.sort((a, b) => b.prix - a.prix);
        break;
      case 'name_asc':
        this.filteredProducts.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'name_desc':
        this.filteredProducts.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
      default:
        // Par défaut, garder l'ordre original
        break;
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedProducts() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  getProductImage(product: any): string {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.est_principale);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    if (product.image) {
      if (typeof product.image === 'string') {
        if (product.image.startsWith('/uploads/')) {
          return `http://localhost:3308${product.image}`;
        }
        return `http://localhost:3308/uploads/products/${product.image}`;
      }
    }
    return 'assets/images/placeholder-product.jpg';
  }
}