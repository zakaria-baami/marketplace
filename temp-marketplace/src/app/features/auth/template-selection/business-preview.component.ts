import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full rounded-xl overflow-hidden border" [ngStyle]="{'background': config?.background || '#fff'}">
      <div class="h-14 flex items-center px-4 shadow" [ngStyle]="{'background': config?.primary || '#1e40af', 'color': config?.text_primary || '#fff'}">
        <span class="font-bold text-lg">Business Shop</span>
      </div>
      <div class="flex">
        <div class="w-20 bg-gray-100 flex flex-col items-center py-4" [ngStyle]="{'background': config?.surface_secondary || '#f1f5f9'}">
          <div class="w-8 h-8 bg-gray-300 rounded mb-2"></div>
          <div class="w-8 h-8 bg-gray-300 rounded mb-2"></div>
          <div class="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
        <div class="flex-1 p-4 grid grid-cols-2 gap-4">
          <div *ngFor="let p of products" class="bg-white rounded-lg shadow p-2 flex flex-col items-center">
            <div class="w-16 h-16 bg-gray-200 rounded mb-2"></div>
            <div class="font-semibold text-sm mb-1">{{p.name}}</div>
            <div class="text-xs text-gray-500">{{p.price}} €</div>
          </div>
        </div>
      </div>
      <div class="h-10 flex items-center justify-center text-xs" [ngStyle]="{'background': config?.surface || '#f8fafc', 'color': config?.text_secondary || '#475569'}">
        © 2024 Business Theme
      </div>
    </div>
  `
})
export class BusinessPreviewComponent {
  @Input() config: any;
  @Input() products = [
    { name: 'Produit Pro 1', price: 49.99 },
    { name: 'Produit Pro 2', price: 89.99 },
    { name: 'Produit Pro 3', price: 120.00 },
    { name: 'Produit Pro 4', price: 35.00 }
  ];
} 