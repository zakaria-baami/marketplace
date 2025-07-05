import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  couleur?: string;
  slug: string;
  parent_id?: number;
  ordre_affichage: number;
  actif: boolean;
  statut?: 'active' | 'inactive';
  nombre_produits?: number;
  enfants?: Category[];
  parent?: Category;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category[];
  categories?: Category[];
  message?: string;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categorie`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les catégories
   */
  getCategories(options: {
    actives_uniquement?: boolean;
    avec_produits_uniquement?: boolean;
    format?: 'liste' | 'arbre';
    niveau_max?: number;
    parent_id?: number | null;
  } = {}): Observable<CategoryResponse> {
    const params: any = {};
    
    if (options.actives_uniquement !== undefined) {
      params.actives_uniquement = options.actives_uniquement.toString();
    }
    if (options.avec_produits_uniquement !== undefined) {
      params.avec_produits_uniquement = options.avec_produits_uniquement.toString();
    }
    if (options.format) {
      params.format = options.format;
    }
    if (options.niveau_max) {
      params.niveau_max = options.niveau_max.toString();
    }
    if (options.parent_id !== undefined) {
      params.parent_id = options.parent_id === null ? 'null' : options.parent_id.toString();
    }

    return this.http.get<CategoryResponse>(`${this.apiUrl}`, { params });
  }

  /**
   * Récupérer une catégorie par son ID
   */
  getCategoryById(id: number, avec_statistiques: boolean = false): Observable<CategoryResponse> {
    const params = { avec_statistiques: avec_statistiques.toString() };
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`, { params });
  }

  /**
   * Récupérer une catégorie par son slug
   */
  getCategoryBySlug(slug: string, avec_statistiques: boolean = false): Observable<CategoryResponse> {
    const params = { avec_statistiques: avec_statistiques.toString() };
    return this.http.get<CategoryResponse>(`${this.apiUrl}/slug/${slug}`, { params });
  }

  /**
   * Récupérer les catégories d'une boutique
   */
  getCategoriesByShop(shopId: number, options: {
    actives_uniquement?: boolean;
    avec_produits_uniquement?: boolean;
    format?: 'liste' | 'arbre';
  } = {}): Observable<CategoryResponse> {
    const params: any = {};
    
    if (options.actives_uniquement !== undefined) {
      params.actives_uniquement = options.actives_uniquement.toString();
    }
    if (options.avec_produits_uniquement !== undefined) {
      params.avec_produits_uniquement = options.avec_produits_uniquement.toString();
    }
    if (options.format) params.format = options.format;

    return this.http.get<CategoryResponse>(`${environment.apiUrl}/boutique/${shopId}/categories`, { params });
  }

  /**
   * Rechercher des catégories
   */
  searchCategories(query: string, options: {
    actives_uniquement?: boolean;
    limit?: number;
  } = {}): Observable<CategoryResponse> {
    const params: any = { q: query };
    
    if (options.actives_uniquement !== undefined) {
      params.actives_uniquement = options.actives_uniquement.toString();
    }
    if (options.limit) params.limit = options.limit.toString();

    return this.http.get<CategoryResponse>(`${this.apiUrl}/recherche`, { params });
  }

  /**
   * Méthode utilitaire pour extraire les catégories d'une réponse
   */
  static extractCategories(response: CategoryResponse): Category[] {
    return response.success && response.data ? response.data : [];
  }

  /**
   * Méthode utilitaire pour extraire une catégorie d'une réponse
   */
  static extractCategory(response: CategoryResponse): Category | null {
    return response.success && response.data && response.data.length > 0 ? response.data[0] : null;
  }
} 