import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from './category'; // Assuming you have a category interface

export interface ProductImage {
  id: number;
  url: string;
  est_principale: boolean;
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
  description: string;
  prix: number;
  stock: number;
  statut: 'actif' | 'inactif';
  images: ProductImage[];
  categorie: Category;
  boutique: Boutique;
  prix_original?: number;
  // Add any other fields from your model, e.g., originalPrice, rating, etc.
}

export interface ProductResponse {
  success: boolean;
  produits: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  categorie?: {
    id: number;
    nom: string;
    description: string;
  };
  message?: string;
}

export interface SingleProductResponse {
  success: boolean;
  produit: Product;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) { }

  // --- Read Operations ---

  getProducts(params: { categoryId?: number; boutiqueId?: number; } = {}): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params.categoryId) {
      httpParams = httpParams.set('categoryId', params.categoryId.toString());
    }
    if (params.boutiqueId) {
      httpParams = httpParams.set('boutiqueId', params.boutiqueId.toString());
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        if (response.success) {
          return response.produits;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération des produits');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Récupérer les produits d'une catégorie spécifique
  getProductsByCategory(categoryId: number, options: any = {}): Observable<ProductResponse> {
    let httpParams = new HttpParams();
    
    // Ajouter les options de filtrage et pagination
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined && options[key] !== null) {
        httpParams = httpParams.set(key, options[key].toString());
      }
    });

    return this.http.get<ProductResponse>(`${environment.apiUrl}/categorie/${categoryId}/produits`, { 
      params: httpParams 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: string | number): Observable<Product> {
    return this.http.get<SingleProductResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return response.produit;
        } else {
          throw new Error(response.message || 'Produit non trouvé');
        }
      }),
      catchError(this.handleError)
    );
  }

  // --- Write Operations for Sellers ---

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<SingleProductResponse>(this.apiUrl, product).pipe(
      map(response => {
        if (response.success) {
          return response.produit;
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
          return response.produit;
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
