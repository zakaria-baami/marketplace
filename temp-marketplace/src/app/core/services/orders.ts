import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Order {
  id: number;
  date_creation: string;
  statut: string;
  total: number;
  adresse_livraison?: string;
  date_validation?: string;
  mode_paiement?: string;
  lignes?: OrderItem[];
}

export interface OrderItem {
  id: number;
  produit_id: number;
  quantite: number;
  sous_total: number;
  produit?: {
    id: number;
    nom: string;
    prix: number;
    images?: any[];
  };
}

export interface OrdersResponse {
  success: boolean;
  data?: Order[];
  commandes?: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Récupérer les commandes du client
  getClientOrders(page: number = 1, limit: number = 10): Observable<OrdersResponse> {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('accessToken');
    
    // Préparer les headers avec le token
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🔑 Token utilisé:', token ? 'Présent' : 'Absent');
    console.log('📡 URL appelée:', `${this.apiUrl}/client/commandes`);
    
    return this.http.get<OrdersResponse>(`${this.apiUrl}/client/commandes`, {
      params: { page: page.toString(), limit: limit.toString() },
      headers: headers
    }).pipe(
      map(response => {
        console.log('📦 Réponse API commandes:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Erreur récupération commandes:', error);
        console.error('❌ Détails erreur:', error.error || error.message);
        throw error;
      })
    );
  }

  // Récupérer une commande spécifique
  getOrderDetails(orderId: number): Observable<Order> {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('accessToken');
    
    // Préparer les headers avec le token
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.http.get<{ success: boolean; commande?: Order; message?: string }>(`${this.apiUrl}/client/commandes/${orderId}`, {
      headers: headers
    }).pipe(
      map(response => {
        if (response.success && response.commande) {
          return response.commande;
        } else {
          throw new Error(response.message || 'Commande non trouvée');
        }
      }),
      catchError(error => {
        console.error(`❌ Erreur récupération commande ${orderId}:`, error);
        console.error('❌ Détails erreur:', error.error || error.message);
        throw error;
      })
    );
  }
} 