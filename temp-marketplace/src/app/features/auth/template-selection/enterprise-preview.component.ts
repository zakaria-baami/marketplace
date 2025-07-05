import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enterprise-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full rounded-xl overflow-hidden border" [ngStyle]="{'background': config?.background || '#fff'}">
      <div class="h-20 flex items-center px-6" [ngStyle]="{'background': (config?.gradients?.hero || config?.primary || '#0f172a'), 'color': config?.luxury || '#d4af37'}">
        <span class="font-extrabold text-2xl">Enterprise Suite</span>
      </div>
      <div class="p-4 grid grid-cols-2 gap-4">
        <div *ngFor="let p of products" class="rounded-lg shadow p-2 flex flex-col items-center" [ngStyle]="{'background': config?.surface || '#fefefe'}">
          <div class="w-16 h-16 rounded mb-2" [ngStyle]="{'background': config?.gradients?.cards || config?.accent || '#f59e0b'}"></div>
          <div class="font-semibold text-sm mb-1">{{p.name}}</div>
          <div class="text-xs text-gray-500">{{p.price}} €</div>
        </div>
      </div>
      <div class="h-12 flex items-center justify-center text-xs" [ngStyle]="{'background': config?.surface_secondary || '#f8fafc', 'color': config?.text_secondary || '#475569'}">
        <span class="font-bold">Fonctionnalités Enterprise & Analytics</span>
      </div>
    </div>
  `
})
export class EnterprisePreviewComponent {
  @Input() config: any;
  @Input() products = [
    { name: 'Produit Entreprise 1', price: 499.99 },
    { name: 'Produit Entreprise 2', price: 899.99 },
    { name: 'Produit Entreprise 3', price: 1200.00 },
    { name: 'Produit Entreprise 4', price: 350.00 }
  ];
} 