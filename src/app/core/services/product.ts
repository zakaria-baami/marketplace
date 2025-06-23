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
    vendeur: Seller;
    // Add other boutique properties
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
  // Add any other fields from your model, e.g., originalPrice, rating, etc.
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

    return this.http.get<{data: Product[]}>(this.apiUrl, { params: httpParams }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getProductById(id: string | number): Observable<Product> {
    return this.http.get<{data: Product}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // --- Write Operations for Sellers ---

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<{data: Product}>(this.apiUrl, product).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<{data: Product}>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => response.data),
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
