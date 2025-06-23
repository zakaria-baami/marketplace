import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-seller-plans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './seller-plans.html',
  styleUrl: './seller-plans.css'
})
export class SellerPlansComponent {
  plans = [
    {
      name: 'Individuel',
      price: '0',
      description: 'Idéal pour les créateurs qui débutent.',
      features: [
        'Jusqu\'à 10 produits',
        'Frais de transaction de 6.5%',
        'Outils de base pour la boutique',
        'Support standard'
      ],
      buttonText: 'Commencer gratuitement',
      recommended: false,
      link: '/auth/register/vendeur'
    },
    {
      name: 'Pro',
      price: '19.99',
      description: 'Pour les vendeurs établis qui veulent grandir.',
      features: [
        'Produits illimités',
        'Frais de transaction de 4.5%',
        'Statistiques avancées',
        'Support prioritaire',
        'Personnalisation de la boutique'
      ],
      buttonText: 'Choisir le plan Pro',
      recommended: true,
      link: '/auth/register/vendeur'
    },
    {
      name: 'Entreprise',
      price: '49.99',
      description: 'Des outils puissants pour développer votre marque.',
      features: [
        'Tous les avantages du plan Pro',
        'Gestionnaire de compte dédié',
        'API d\'intégration',
        'Outils marketing avancés'
      ],
      buttonText: 'Contacter les ventes',
      recommended: false,
      link: '/contact-sales'
    }
  ];
} 