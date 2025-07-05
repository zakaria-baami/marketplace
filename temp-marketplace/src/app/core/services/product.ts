import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from './category'; // Assuming you have a category interface

export interface ProductImage {
  id: number;
  produit_id: number;
  url: string;
  est_principale: boolean;
  created_at: string;
}

export interface Seller {
    id: number;
    nom: string;
    // Add other seller properties as needed
}

export interface Boutique {
    id: number;
    nom: string;
    grade: string;
}

export interface Product {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  boutique_id: number;
  categorie_id: number;
  statut: 'actif' | 'inactif' | 'suspendu';
  tags?: string[];
  created_at: string;
  updated_at: string;
  boutique?: {
    id: number;
    nom: string;
    vendeur?: {
      id: number;
      utilisateur?: {
        nom: string;
        email: string;
      };
    };
  };
  categorie?: {
    id: number;
    nom: string;
    slug: string;
  };
  images?: ProductImage[];
  image?: string; // <-- Ajouté pour compatibilité backend
  statut_stock?: string;
  disponible?: boolean;
  est_en_rupture?: boolean;
  est_stock_critique?: boolean;
}

export interface ProductResponse {
  success: boolean;
  data?: Product[];
  produits?: Product[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  data?: Product;
  produit?: Product;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer tous les produits avec filtres
   */
  getProducts(options: {
    page?: number;
    limit?: number;
    nom?: string;
    prix_min?: number;
    prix_max?: number;
    categorie_id?: number;
    boutique_id?: number;
    disponibles_uniquement?: boolean;
    tri?: 'nom' | 'prix_asc' | 'prix_desc' | 'popularite' | 'recent';
    vendeur_id?: number;
  } = {}): Observable<ProductResponse> {
    const params: any = {};
    
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();
    if (options.nom) params.nom = options.nom;
    if (options.prix_min) params.prix_min = options.prix_min.toString();
    if (options.prix_max) params.prix_max = options.prix_max.toString();
    if (options.categorie_id) params.categorie_id = options.categorie_id.toString();
    if (options.boutique_id) params.boutique_id = options.boutique_id.toString();
    if (options.disponibles_uniquement !== undefined) {
      params.disponibles_uniquement = options.disponibles_uniquement.toString();
    }
    if (options.tri) params.tri = options.tri;
    if (options.vendeur_id) params.vendeur_id = options.vendeur_id.toString();

    return this.http.get<ProductResponse>(`${this.apiUrl}`, { params });
  }

  /**
   * Récupérer un produit par son ID
   */
  getProductById(id: number): Observable<SingleProductResponse> {
    return this.http.get<SingleProductResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les produits d'une catégorie
   */
  getProductsByCategory(categoryId: number, options: {
    page?: number;
    limit?: number;
    disponibles_uniquement?: boolean;
    prix_min?: number;
    prix_max?: number;
    recherche?: string;
    tri?: string;
    vendeur_id?: number;
  } = {}): Observable<ProductResponse> {
    const params: any = {};
    
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();
    if (options.disponibles_uniquement !== undefined) {
      params.disponibles_uniquement = options.disponibles_uniquement.toString();
    }
    if (options.prix_min) params.prix_min = options.prix_min.toString();
    if (options.prix_max) params.prix_max = options.prix_max.toString();
    if (options.recherche) params.recherche = options.recherche;
    if (options.tri) params.tri = options.tri;
    if (options.vendeur_id) params.vendeur_id = options.vendeur_id.toString();

    return this.http.get<ProductResponse>(`${environment.apiUrl}/categorie/${categoryId}/produits`, { params });
  }

  /**
   * Rechercher des produits
   */
  searchProducts(query: string, options: {
    page?: number;
    limit?: number;
    categorie_id?: number;
    prix_min?: number;
    prix_max?: number;
    tri?: string;
  } = {}): Observable<ProductResponse> {
    const params: any = { q: query };
    
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();
    if (options.categorie_id) params.categorie_id = options.categorie_id.toString();
    if (options.prix_min) params.prix_min = options.prix_min.toString();
    if (options.prix_max) params.prix_max = options.prix_max.toString();
    if (options.tri) params.tri = options.tri;

    return this.http.get<ProductResponse>(`${this.apiUrl}/recherche`, { params });
  }

  /**
   * Vérifier la disponibilité d'un produit
   */
  checkAvailability(productId: number, quantity: number = 1): Observable<{ disponible: boolean; stock_disponible: number }> {
    return this.http.get<{ disponible: boolean; stock_disponible: number }>(`${this.apiUrl}/${productId}/disponibilite`, {
      params: { quantite: quantity.toString() }
    });
  }

  /**
   * Méthode utilitaire pour extraire les produits d'une réponse
   */
  static extractProducts(response: ProductResponse): Product[] {
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }

  /**
   * Méthode utilitaire pour extraire un produit d'une réponse
   */
  static extractProduct(response: SingleProductResponse): Product | null {
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  }

  // --- Write Operations for Sellers ---

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<SingleProductResponse>(this.apiUrl, product).pipe(
      map(response => {
        if (response.success) {
          const productData = response.data;
          if (productData) {
            return productData;
          }
          throw new Error('Données produit manquantes dans la réponse');
        } else {
          throw new Error(response.message || 'Erreur lors de la création du produit');
        }
      }),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<SingleProductResponse>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => {
        if (response.success) {
          const productData = response.data;
          if (productData) {
            return productData;
          }
          throw new Error('Données produit manquantes dans la réponse');
        } else {
          throw new Error(response.message || 'Erreur lors de la mise à jour du produit');
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Error Handling ---

  private handleError(error: HttpErrorResponse) {
    console.error(`API Error on ${error.url}:`, error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
