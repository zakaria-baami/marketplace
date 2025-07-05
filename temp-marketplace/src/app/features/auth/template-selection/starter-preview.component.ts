import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starter-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full rounded-xl overflow-hidden border" [ngStyle]="{'background': config?.background || '#fff'}">
      <div class="h-12 flex items-center px-4" [ngStyle]="{'background': config?.primary || '#2563eb', 'color': config?.text_primary || '#fff'}">
        <span class="font-bold text-lg">Starter Boutique</span>
      </div>
      <div class="p-4 grid grid-cols-2 gap-4">
        <div *ngFor="let p of products" class="bg-white rounded-lg shadow p-2 flex flex-col items-center">
          <div class="w-16 h-16 bg-gray-200 rounded mb-2"></div>
          <div class="font-semibold text-sm mb-1">{{p.name}}</div>
          <div class="text-xs text-gray-500">{{p.price}} €</div>
        </div>
      </div>
      <div class="h-10 flex items-center justify-center text-xs" [ngStyle]="{'background': config?.surface || '#f8fafc', 'color': config?.text_secondary || '#64748b'}">
        © 2024 Starter Theme
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class StarterPreviewComponent {
  @Input() config: any;
  @Input() products = [
    { name: 'Produit 1', price: 19.99 },
    { name: 'Produit 2', price: 29.99 },
    { name: 'Produit 3', price: 15.00 },
    { name: 'Produit 4', price: 9.99 }
  ];
} 