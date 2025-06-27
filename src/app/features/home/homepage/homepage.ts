import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    FormsModule, 
    HeaderComponent,
    ProductCardComponent
  ],
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
      nom: 'Collier artisanal en argent',
      prix: 45,
      rating: 4.8,
      reviews: 23,
      boutique: { nom: 'Marie Créations', grade: 'Premium' },
      images: [],
      available: true,
      maxQuantity: 10
    },
    {
      id: 2,
      nom: 'Vase en céramique fait main',
      prix: 35,
      rating: 4.9,
      reviews: 15,
      boutique: { nom: 'Atelier Poterie', grade: 'Professionnel' },
      images: [],
      available: true,
      maxQuantity: 5
    },
    {
      id: 3,
      nom: 'Sac en cuir vintage',
      prix: 89,
      rating: 4.7,
      reviews: 31,
      boutique: { nom: 'Vintage Style', grade: 'Premium' },
      images: [],
      available: true,
      maxQuantity: 3
    },
    {
      id: 4,
      nom: 'Tableau aquarelle original',
      prix: 120,
      rating: 5.0,
      reviews: 8,
      boutique: { nom: 'Art & Couleurs', grade: 'Amateur' },
      images: [],
      available: true,
      maxQuantity: 1
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