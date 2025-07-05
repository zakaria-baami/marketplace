import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../../core/services/template';

// Import the four template components
// import { TemplateClassicComponent } from '../../shops/templates/template-classic/template-classic';
// import { TemplateModernComponent } from '../../shops/templates/template-modern/template-modern';
// import { TemplateMinimalistComponent } from '../../shops/templates/template-minimalist/template-minimalist';
// import { TemplateBoldComponent } from '../../shops/templates/template-bold/template-bold';
import { StarterPreviewComponent } from './starter-preview.component';
import { BusinessPreviewComponent } from './business-preview.component';
import { PremiumPreviewComponent } from './premium-preview.component';
import { EnterprisePreviewComponent } from './enterprise-preview.component';

@Component({
  selector: 'app-template-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    // Retirer les composants inutilisés ici
    StarterPreviewComponent,
    BusinessPreviewComponent,
    PremiumPreviewComponent,
    EnterprisePreviewComponent
  ],
  templateUrl: './template-selection.html',
  styleUrl: './template-selection.css'
})
export class TemplateSelectionComponent implements OnInit {
  selectedPlan: string = '';
  templates: any[] = [];
  filteredTemplates: any[] = [];
  selectedTemplateId: number | null = null;

  planTemplates: { [plan: string]: number[] } = {
    Individuel: [10],
    PRO: [11, 12],
    Entreprise: [13]
  };
  
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

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private templateService: TemplateService) {}

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.filteredTemplates = this.templates;
        this.selectedTemplateId = this.filteredTemplates.length > 0 ? this.filteredTemplates[0].id : null;
        if (this.templates.length === 0) {
          this.snackBar.open('Aucun template disponible.', 'Fermer', { duration: 4000 });
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des templates.', 'Fermer', { duration: 4000 });
      }
    });
  }

  filterTemplates() {
    const allowedIds = this.planTemplates[this.selectedPlan] || [];
    this.filteredTemplates = this.templates.filter(tpl => allowedIds.includes(tpl.id));
    this.selectedTemplateId = this.filteredTemplates.length > 0 ? this.filteredTemplates[0].id : null;
  }

  selectTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    // Charger les infos du vendeur depuis le localStorage
    const vendeurDataStr = localStorage.getItem('vendeurRegisterData');
    if (!vendeurDataStr) {
      this.snackBar.open('Erreur : informations vendeur manquantes.', 'Fermer', { duration: 4000 });
      return;
    }
    const vendeurData = JSON.parse(vendeurDataStr);
    // Construire le payload
    const payload = {
      nom: vendeurData.name,
      email: vendeurData.email,
      password: vendeurData.password,
      numero_fiscal: vendeurData.numero_fiscal,
      role: 'vendeur' as const,
      shopName: vendeurData.shopName,
      plan: this.selectedPlan,
      template_id: templateId
    };
    // Ajout du log pour diagnostic
    console.log('Payload envoyé à l\'API :', payload);
    this.authService.registerSeller(payload).subscribe({
      next: () => {
        localStorage.removeItem('vendeurRegisterData');
        this.snackBar.open('Compte vendeur créé avec succès !', 'Fermer', { duration: 4000 });
        window.location.href = '/auth/login';
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Erreur lors de la création du compte vendeur', 'Fermer', { duration: 4000 });
      }
    });
  }

  chooseTemplate(templateId: number) {
    localStorage.setItem('selectedTemplateId', templateId.toString());
    this.router.navigate(['/vendeur/profil']); // Redirige vers la page de profil vendeur
  }
} 