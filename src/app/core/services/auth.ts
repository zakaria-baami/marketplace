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
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(credentials: {email: string, password: string}): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // Store user details and jwt token in local storage
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('accessToken', response.tokens.accessToken);
        }
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(error => {
        // Handle login errors
        console.error('Login failed:', error);
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
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
