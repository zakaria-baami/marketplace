import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Import the four template components
import { TemplateClassicComponent } from '../../shops/templates/template-classic/template-classic';
import { TemplateModernComponent } from '../../shops/templates/template-modern/template-modern';
import { TemplateMinimalistComponent } from '../../shops/templates/template-minimalist/template-minimalist';
import { TemplateBoldComponent } from '../../shops/templates/template-bold/template-bold';

@Component({
  selector: 'app-template-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    // Add template components here to be used in the template
    TemplateClassicComponent,
    TemplateModernComponent,
    TemplateMinimalistComponent,
    TemplateBoldComponent
  ],
  templateUrl: './template-selection.html',
  styleUrl: './template-selection.css'
})
export class TemplateSelectionComponent implements OnInit {
  selectedPlan: string = '';
  availableTemplates: any[] = [];
  
  // New, richer mock data
  mockShopData = { 
    name: 'Bijoux de la Forêt', 
    tagline: 'Créations artisanales inspirées par la nature',
    logoUrl: '/assets/logo-placeholder.png', // Assuming you have a placeholder logo
    bannerUrl: '/assets/banner-placeholder.jpg', // And a placeholder banner
    description: 'Bienvenue chez Bijoux de la Forêt, où chaque pièce est fabriquée à la main avec amour et soin. Nous utilisons des matériaux naturels et durables pour créer des bijoux qui racontent une histoire. Explorez nos collections et trouvez le trésor qui vous correspond.',
    owner: {
      name: 'Elara Moon',
      avatarUrl: '/assets/owner-avatar.png'
    },
    rating: 4.8,
    reviewsCount: 124,
    categories: ['Colliers', 'Bracelets', 'Boucles d\'oreilles', 'Bagues']
  };

  mockProducts = [
    { id: '1', name: 'Collier Feuille d\'Argent', price: '45.00', imageUrl: '/assets/product1.jpg', category: 'Colliers' },
    { id: '2', name: 'Bracelet en Pierre de Lune', price: '35.50', imageUrl: '/assets/product2.jpg', category: 'Bracelets' },
    { id: '3', name: 'Boucles d\'oreilles Plume', price: '28.00', imageUrl: '/assets/product3.jpg', category: 'Boucles d\'oreilles' },
    { id: '4', name: 'Bague Branche Enchantée', price: '52.00', imageUrl: '/assets/product4.jpg', category: 'Bagues' },
    { id: '5', name: 'Collier Goutte de Rosée', price: '49.90', imageUrl: '/assets/product5.jpg', category: 'Colliers' },
    { id: '6', name: 'Bracelet de Jade', price: '42.00', imageUrl: '/assets/product6.jpg', category: 'Bracelets' },
  ];

  allTemplates = [
    { id: 'classic', name: 'Artisan', component: TemplateClassicComponent, requiredPlan: 'Individuel' },
    { id: 'modern', name: 'Galleria', component: TemplateModernComponent, requiredPlan: 'Pro' },
    { id: 'minimalist', name: 'Boutique', component: TemplateMinimalistComponent, requiredPlan: 'Pro' },
    { id: 'bold', name: 'Vogue', component: TemplateBoldComponent, requiredPlan: 'Entreprise' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedPlan = params['plan'];
      this.filterTemplatesByPlan();
    });
  }

  filterTemplatesByPlan(): void {
    if (this.selectedPlan === 'Entreprise') {
      this.availableTemplates = this.allTemplates;
    } else if (this.selectedPlan === 'Pro') {
      this.availableTemplates = this.allTemplates.filter(t => t.requiredPlan === 'Pro' || t.requiredPlan === 'Individuel');
    } else {
      this.availableTemplates = this.allTemplates.filter(t => t.requiredPlan === 'Individuel');
    }
  }

  selectTemplate(templateId: string) {
    console.log(`Selected template ${templateId} for plan ${this.selectedPlan}`);
    // Here, you would typically save this to the backend
    // and then navigate to the next step, e.g., the seller dashboard.
  }
} 