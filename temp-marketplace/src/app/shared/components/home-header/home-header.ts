import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, FormsModule, LogoComponent],
  templateUrl: './home-header.html',
  styleUrls: ['./home-header.css']
})
export class HomeHeaderComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  onRegister() {
    this.router.navigate(['/auth/register/role']);
  }

  onCart() {
    this.router.navigate(['/cart']);
  }
} 