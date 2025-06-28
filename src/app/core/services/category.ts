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
  statut: string;
  ordre_affichage: number;
  nombre_produits?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: Category[];
  total: number;
  message?: string;
}

export interface SingleCategoryResponse {
  success: boolean;
  categorie: Category;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categorie`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les catégories
  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          return response.categories;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération des catégories');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
      })
    );
  }

  // Récupérer les catégories avec statistiques (nombre de produits)
  getCategoriesWithStats(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/stats`).pipe(
      map(response => {
        if (response.success) {
          return response.categories;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération des statistiques');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw error;
      })
    );
  }

  // Récupérer une catégorie par son ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<SingleCategoryResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return response.categorie;
        } else {
          throw new Error(response.message || 'Catégorie non trouvée');
        }
      }),
      catchError(error => {
        console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
        throw error;
      })
    );
  }

  // Rechercher des catégories
  searchCategories(query: string, limit: number = 20): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/search`, {
      params: { q: query, limit: limit.toString() }
    }).pipe(
      map(response => {
        if (response.success) {
          return response.categories;
        } else {
          throw new Error(response.message || 'Erreur lors de la recherche');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la recherche de catégories:', error);
        throw error;
      })
    );
  }
} 