import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'marketplace-frontend';

  constructor(private router: Router, private authService: AuthService) {}

  isClientConnected(): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && user.role === 'client';
  }

  shouldShowHeader(): boolean {
    // Masquer le header sur les pages d'accueil client, panier client et profil client
    const url = this.router.url;
    const clientPages = [
      '/client/home',
      '/client/cart',
      '/client/profile',
      '/client/account',
      '/client/dashboard',
      '/client/orders',
      '/client/favorites'
    ];
    // Masque le header si l'URL commence par une des routes client
    return !clientPages.some(route => url.startsWith(route));
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
