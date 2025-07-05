import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Boutique } from './product'; // Re-using from product service

export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'client' | 'vendeur' | 'admin';
  vendeur?: {
    id: number;
    boutique: Boutique | null;
    // other vendeur properties
  };
  // other user properties
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SellerRegistrationData {
  nom: string;
  email: string;
  password: string;
  role: 'vendeur';
  numero_fiscal?: string | null;
  shopName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isBrowser: boolean = typeof window !== 'undefined' && !!window.localStorage;

  constructor(private http: HttpClient) {
  let storedUser: string | null = null;
  if (this.isBrowser) {
    storedUser = localStorage.getItem('currentUser');
  }
  
  // ✅ Version courte
  let parsedUser: User | null = null;
  if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      // Si erreur de parsing, nettoyer le localStorage
      if (this.isBrowser) {
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  this.currentUserSubject = new BehaviorSubject<User | null>(parsedUser);
  this.currentUser = this.currentUserSubject.asObservable();
}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(credentials: {email: string, password: string}): Observable<User> {
    console.log('🚀 Tentative de connexion vers:', `${this.apiUrl}/login`);
    console.log('📤 Données envoyées:', credentials);
    
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        console.log('🔍 Réponse brute du backend:', response);
        
        // ✅ Correction : Le backend retourne directement { success, user, tokens }
        // Pas de response.data, la réponse est directe
        console.log('🔍 Données utilisateur (response.user):', response.user);
        
        // Vérifier que les données nécessaires existent
        if (!response.user) {
          console.error('❌ Données utilisateur manquantes:', response.user);
          throw new Error('Réponse invalide du serveur: données utilisateur manquantes');
        }
        
        if (!response.tokens || !response.tokens.accessToken) {
          console.error('❌ Tokens manquants:', response.tokens);
          throw new Error('Réponse invalide du serveur: token d\'accès manquant');
        }
        
        console.log('✅ Données valides, stockage en cours...');
        console.log('👤 Utilisateur:', response.user);
        console.log('🔑 Tokens:', response.tokens);
        
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('accessToken', response.tokens.accessToken);
        }
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(error => {
        // Handle login errors
        console.error('💥 Erreur HTTP détaillée:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        throw error;
      })
    );
  }

  logout(): void {
    // Remove user from local storage to log user out
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
    }
    this.currentUserSubject.next(null);
  }

  // Helper to get the current user synchronously
  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  registerClient(data: { name: string; email: string; password: string; phone?: string }) {
    return this.http.post(`${this.apiUrl}/register`, {
      nom: data.name,
      email: data.email,
      password: data.password,
      telephone: data.phone,
      role: 'client'
    });
  }

  registerSeller(data: SellerRegistrationData) {
    return this.http.post(`${this.apiUrl}/register`, {
      ...data,
      nom_boutique: data.shopName
    });
  }

  public hasValidToken(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      return !!token;
    }
    return false;
  }
}
