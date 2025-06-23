import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule, 
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  cartItemsCount = 3; // Simulated cart items
  isLoggedIn = false; // Simulated login state
  username = 'Marie Créations'; // Simulated username

  categories = [
    { name: 'Mode', icon: 'checkroom', path: '/categories/mode' },
    { name: 'Maison & Décoration', icon: 'home', path: '/categories/maison' },
    { name: 'Bijoux & Accessoires', icon: 'diamond', path: '/categories/bijoux' },
    { name: 'Art & Créations', icon: 'palette', path: '/categories/art' },
    { name: 'Vintage', icon: 'history', path: '/categories/vintage' },
    { name: 'Jouets & Enfants', icon: 'toys', path: '/categories/jouets' },
    { name: 'Beauté & Bien-être', icon: 'spa', path: '/categories/beaute' },
    { name: 'Papeterie', icon: 'edit', path: '/categories/papeterie' },
  ];

  searchQuery = '';

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Implement search navigation
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onLogin() {
    console.log('Login clicked');
    // TODO: Navigate to login page
    // this.router.navigate(['/auth/login']);
  }

  onRegister() {
    console.log('Register clicked');
    // TODO: Navigate to register page
    // this.router.navigate(['/auth/register']);
  }

  onProfile() {
    console.log('Profile clicked');
    // TODO: Navigate to profile page
  }

  onLogout() {
    console.log('Logout clicked');
    this.isLoggedIn = false;
    // TODO: Implement logout logic
  }

  onCart() {
    console.log('Cart clicked');
    // TODO: Navigate to cart page
    // this.router.navigate(['/cart']);
  }

  onCategoryClick(category: any) {
    console.log('Category clicked:', category.name);
    // TODO: Navigate to category page
    // If you want to support dynamic navigation:
    // this.router.navigate(['/categories', category.slug]);
  }
}