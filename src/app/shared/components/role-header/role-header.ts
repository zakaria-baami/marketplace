import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo';
import { AuthService, User } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-role-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, FormsModule, LogoComponent, MatMenuModule],
  templateUrl: './role-header.html',
  styleUrls: ['./role-header.css']
})
export class RoleHeaderComponent implements OnInit {
  searchQuery = '';
  username = '';
  userRole: string | null = null;
  cartItemsCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.nom : '';
    this.userRole = user ? user.role : null;
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onProfile() {
    if (this.userRole === 'client') {
      this.router.navigate(['/client/profile']);
    } else if (this.userRole === 'vendeur') {
      this.router.navigate(['/vendeur/dashboard']);
    } else if (this.userRole === 'admin') {
      this.router.navigate(['/admin']);
    }
  }

  onCart() {
    this.router.navigate(['/cart']);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 