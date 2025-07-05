// categories-listing.component.ts - Version corrigée
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { Category, CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-categories-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './categories-listing.html',
  styleUrls: ['./categories-listing.css']
})
export class CategoriesListingComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    // Récupérer toutes les catégories (même sans produits)
    this.categoryService.getCategories({
      actives_uniquement: true,
      format: 'liste'
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          console.log('✅ Catégories reçues du backend:', response.data);
          this.categories = response.data;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Erreur lors du chargement:', err);
        this.error = 'Impossible de charger les catégories. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }
}