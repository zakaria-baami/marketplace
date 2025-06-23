import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule, HeaderComponent],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class HomepageComponent {
  categories = [
    { name: 'Mode', icon: 'checkroom' },
    { name: 'Maison', icon: 'home' },
    { name: 'Bijoux', icon: 'diamond' },
    { name: 'Art', icon: 'palette' },
    { name: 'Vintage', icon: 'history' },
    { name: 'Jouets', icon: 'toys' },
  ];

  featuredProducts = [
    {
      id: 1,
      name: 'Collier artisanal en argent',
      price: 45,
      rating: 4.8,
      reviews: 23,
      seller: { name: 'Marie Créations', grade: 'Premium' }
    },
    {
      id: 2,
      name: 'Vase en céramique fait main',
      price: 35,
      rating: 4.9,
      reviews: 15,
      seller: { name: 'Atelier Poterie', grade: 'Professionnel' }
    },
    {
      id: 3,
      name: 'Sac en cuir vintage',
      price: 89,
      rating: 4.7,
      reviews: 31,
      seller: { name: 'Vintage Style', grade: 'Premium' }
    },
    {
      id: 4,
      name: 'Tableau aquarelle original',
      price: 120,
      rating: 5.0,
      reviews: 8,
      seller: { name: 'Art & Couleurs', grade: 'Amateur' }
    },
  ];

  topSellers = [
    {
      name: 'Marie Créations',
      initials: 'MC',
      specialty: 'Bijoux artisanaux',
      rating: 4.9,
      sales: 1250
    },
    {
      name: 'Atelier Poterie',
      initials: 'AP',
      specialty: 'Céramique & Art de la table',
      rating: 4.8,
      sales: 890
    },
    {
      name: 'Vintage Style',
      initials: 'VS',
      specialty: 'Mode vintage',
      rating: 4.7,
      sales: 674
    },
    {
      name: 'Art & Couleurs',
      initials: 'AC',
      specialty: 'Peinture & Illustration',
      rating: 5.0,
      sales: 423
    },
  ];
}