import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo';
import { Category, CategoryService } from '../../../core/services/category';
import { CartService } from '../../../core/services/cart';
import { AuthService, User } from '../../../core/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HttpClientModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule, 
    FormsModule,
    LogoComponent
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount = 0;
  isLoggedIn = false;
  username = '';
  userRole: string | null = null;
  private cartSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  categories: Category[] = [];
  loading = false;
  showMobileSearch = false;

  searchQuery = '';

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user ? user.nom : '';
      this.userRole = user ? user.role : null;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isClient(): boolean {
    return this.userRole === 'client';
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  // Optionnel : détecter la page d'accueil
  isHomePage(): boolean {
    return this.router.url === '/';
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loading = false;
        // Utiliser des catégories par défaut en cas d'erreur
        this.categories = [
          { id: 1, nom: 'Mode', description: '', image: '', couleur: '#007bff', slug: 'mode', ordre_affichage: 1, actif: true, statut: 'active' },
          { id: 2, nom: 'Maison & Décoration', description: '', image: '', couleur: '#28a745', slug: 'maison', ordre_affichage: 2, actif: true, statut: 'active' },
          { id: 3, nom: 'Bijoux & Accessoires', description: '', image: '', couleur: '#ffc107', slug: 'bijoux', ordre_affichage: 3, actif: true, statut: 'active' },
          { id: 4, nom: 'Art & Créations', description: '', image: '', couleur: '#dc3545', slug: 'art', ordre_affichage: 4, actif: true, statut: 'active' },
          { id: 5, nom: 'Vintage', description: '', image: '', couleur: '#6f42c1', slug: 'vintage', ordre_affichage: 5, actif: true, statut: 'active' },
          { id: 6, nom: 'Jouets & Enfants', description: '', image: '', couleur: '#fd7e14', slug: 'jouets', ordre_affichage: 6, actif: true, statut: 'active' }
        ];
      }
    });
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.showMobileSearch = false; // Hide mobile search after search
    }
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  onRegister() {
    this.router.navigate(['/auth/register/role']);
  }

  onCategories() {
    this.router.navigate(['/categories']);
  }

  onProfile() {
    console.log('Profile clicked');
    // TODO: Navigate to profile page
    this.router.navigate(['/client/profile']);
  }

  onLogout() {
    console.log('Logout clicked');
    this.isLoggedIn = false;
    // TODO: Implement logout logic
    this.router.navigate(['/auth/login']);
  }

  onCart() {
    console.log('Cart clicked');
    // TODO: Navigate to cart page
    this.router.navigate(['/cart']);
  }

  onCategoryClick(category: Category) {
    console.log('Category clicked:', category.nom);
    this.router.navigate(['/categories', category.id]);
  }

  // Méthode pour obtenir l'icône par défaut basée sur le nom de la catégorie
  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'mode': 'checkroom',
      'maison': 'home',
      'bijoux': 'diamond',
      'art': 'palette',
      'vintage': 'history',
      'jouets': 'toys',
      'beaute': 'spa',
      'papeterie': 'edit',
      'décoration': 'home',
      'accessoires': 'diamond',
      'créations': 'palette',
      'enfants': 'toys'
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return 'category'; // Icône par défaut
  }
}