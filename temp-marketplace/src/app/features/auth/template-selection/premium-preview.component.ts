import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full rounded-xl overflow-hidden border" [ngStyle]="{'background': config?.background || '#fff'}">
      <div class="h-16 flex items-center px-4" [ngStyle]="{'background': (config?.gradients?.hero || config?.primary || '#7c3aed'), 'color': config?.text_primary || '#fff'}">
        <span class="font-bold text-lg">Premium Store</span>
      </div>
      <div class="p-4 grid grid-cols-2 gap-4">
        <div *ngFor="let p of products" class="rounded-lg shadow p-2 flex flex-col items-center" [ngStyle]="{'background': config?.surface || '#fefefe'}">
          <div class="w-16 h-16 rounded mb-2" [ngStyle]="{'background': config?.gradients?.cards || config?.accent || '#ec4899'}"></div>
          <div class="font-semibold text-sm mb-1">{{p.name}}</div>
          <div class="text-xs text-gray-500">{{p.price}} €</div>
        </div>
      </div>
      <div class="h-10 flex items-center justify-center text-xs" [ngStyle]="{'background': config?.surface_secondary || '#f8fafc', 'color': config?.text_secondary || '#64748b'}">
        <span class="italic">Expérience Premium</span>
      </div>
    </div>
  `
})
export class PremiumPreviewComponent {
  @Input() config: any;
  @Input() products = [
    { name: 'Produit Luxe 1', price: 199.99 },
    { name: 'Produit Luxe 2', price: 299.99 },
    { name: 'Produit Luxe 3', price: 159.00 },
    { name: 'Produit Luxe 4', price: 249.00 }
  ];
} 