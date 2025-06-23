import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Category, CategoryService } from '../../../core/services/category';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-categories-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent
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
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
} 