import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  nom: string;
  description: string;
  image: string;
  couleur: string;
  productCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les catégories
  getCategories(): Observable<Category[]> {
    return this.http.get<{data: Category[]}>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
      })
    );
  }

  // Récupérer une catégorie par son ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<{data: Category}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
        throw error;
      })
    );
  }
} 