import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Client {
  id: number;
  nom: string;
  email: string;
  adresse?: string;
  telephone?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: number;
  nom: string;
  email: string;
  adresse?: string;
  telephone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  statistiques?: {
    total_commandes: number;
    total_depense: number;
    commandes_ce_mois: number;
    paniers_actifs: number;
  };
}

export interface ClientOrder {
  id: number;
  date_creation: string;
  statut: string;
  total: number;
  adresse_livraison?: string;
  date_validation?: string;
  mode_paiement?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  produit_id: number;
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
  boutique_nom: string;
}

export interface ClientResponse {
  success: boolean;
  client?: Client;
  message?: string;
}

export interface ClientProfileResponse {
  success: boolean;
  client?: ClientProfile;
  message?: string;
}

export interface ClientOrdersResponse {
  success: boolean;
  commandes?: ClientOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/client`;

  constructor(private http: HttpClient) { }

  // Récupérer le profil complet du client
  getClientProfile(): Observable<ClientProfile> {
    return this.http.get<{success: boolean, profil: any, message?: string}>(`${this.apiUrl}/profile`).pipe(
      map(response => {
        if (response.success && response.profil) {
          // Adapter la structure de réponse du backend à l'interface ClientProfile
          const clientProfile: ClientProfile = {
            id: response.profil.id,
            nom: response.profil.nom,
            email: response.profil.email,
            adresse: response.profil.adresse,
            telephone: response.profil.telephone,
            avatar: response.profil.nom ? response.profil.nom.substring(0, 2).toUpperCase() : 'U',
            created_at: response.profil.date_creation,
            updated_at: response.profil.date_creation, // Le backend ne retourne pas updated_at
            statistiques: {
              total_commandes: 0, // À calculer depuis les commandes
              total_depense: 0,   // À calculer depuis les commandes
              commandes_ce_mois: 0, // À calculer depuis les commandes
              paniers_actifs: 0   // À calculer depuis les paniers
            }
          };
          return clientProfile;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération du profil');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du profil client:', error);
        // Si c'est une erreur 401, on la laisse remonter pour que l'intercepteur la gère
        if (error.status === 401) {
          throw error;
        }
        // Pour les autres erreurs, on peut afficher un message plus spécifique
        throw new Error('Impossible de récupérer le profil. Veuillez vous reconnecter.');
      })
    );
  }

  // Mettre à jour le profil client
  updateClientProfile(profileData: Partial<Client>): Observable<any> {
    return this.http.put<ClientResponse>(`${this.apiUrl}/profile`, profileData).pipe(
      map(response => {
        if (response.success) {
          // On accepte la réponse même sans objet client
          return response;
        } else {
          throw new Error(response.message || 'Erreur lors de la mise à jour du profil');
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  // Changer le mot de passe
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    // Adapter les noms de champs pour le backend
    const body = {
      ancienPassword: passwordData.currentPassword,
      nouveauPassword: passwordData.newPassword
    };
    return this.http.put(`${this.apiUrl}/change-password`, body).pipe(
      map(response => {
        if (response && (response as any).success) {
          return response;
        } else {
          throw new Error((response as any).message || 'Erreur lors du changement de mot de passe');
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  // Récupérer l'historique des commandes
  getClientOrders(page: number = 1, limit: number = 10): Observable<ClientOrdersResponse> {
    return this.http.get<{success: boolean, commandes?: any[], message?: string}>(`${this.apiUrl}/commandes`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(
      map(response => {
        if (response.success) {
          // Adapter la structure de réponse du backend
          const adaptedResponse: ClientOrdersResponse = {
            success: true,
            commandes: response.commandes ? response.commandes.map((commande: any) => ({
              id: commande.id,
              date_creation: commande.date_creation,
              statut: commande.statut,
              total: commande.total || 0,
              adresse_livraison: commande.adresse_livraison,
              date_validation: commande.date_validation,
              mode_paiement: commande.mode_paiement,
              items: commande.items || commande.lignes || []
            })) : []
          };
          return adaptedResponse;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération des commandes');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des commandes:', error);
        // Si c'est une erreur 401, on la laisse remonter pour que l'intercepteur la gère
        if (error.status === 401) {
          throw error;
        }
        // Pour les autres erreurs, on peut afficher un message plus spécifique
        throw new Error('Impossible de récupérer les commandes. Veuillez vous reconnecter.');
      })
    );
  }

  // Récupérer une commande spécifique
  getClientOrder(orderId: number): Observable<ClientOrder> {
    return this.http.get<{ success: boolean; commande?: ClientOrder; message?: string }>(`${this.apiUrl}/commandes/${orderId}`).pipe(
      map(response => {
        if (response.success && response.commande) {
          return response.commande;
        } else {
          throw new Error(response.message || 'Commande non trouvée');
        }
      }),
      catchError(error => {
        console.error(`Erreur lors de la récupération de la commande ${orderId}:`, error);
        throw error;
      })
    );
  }

  // Récupérer l'historique des paniers
  getClientCartHistory(): Observable<any[]> {
    return this.http.get<{ success: boolean; paniers?: any[]; message?: string }>(`${this.apiUrl}/historique-paniers`).pipe(
      map(response => {
        if (response.success && response.paniers) {
          return response.paniers;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération de l\'historique');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'historique des paniers:', error);
        throw error;
      })
    );
  }

  // Récupérer le panier actuel
  getCurrentCart(): Observable<any> {
    return this.http.get<{ success: boolean; panier?: any; message?: string }>(`${this.apiUrl}/panier-actuel`).pipe(
      map(response => {
        if (response.success) {
          return response.panier;
        } else {
          throw new Error(response.message || 'Erreur lors de la récupération du panier');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du panier actuel:', error);
        throw error;
      })
    );
  }

  // Basculer vers vendeur
  switchToVendor(vendorData: { numero_fiscal: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/switch-to-vendor`, vendorData).pipe(
      map(response => {
        if (response && (response as any).success) {
          return response;
        } else {
          throw new Error((response as any).message || 'Erreur lors de la transformation en vendeur');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la transformation en vendeur:', error);
        throw error;
      })
    );
  }

  // Obtenir les informations du service client
  getClientInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/info`).pipe(
      map(response => {
        if (response && (response as any).success) {
          return response;
        } else {
          throw new Error((response as any).message || 'Erreur lors de la récupération des informations');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des informations client:', error);
        throw error;
      })
    );
  }
} 