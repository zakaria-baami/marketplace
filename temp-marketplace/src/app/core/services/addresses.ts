import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
  id: number;
  name: string;
  type: 'home' | 'business';
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressRequest {
  name?: string;
  type?: 'home' | 'business';
  firstName?: string;
  lastName?: string;
  address: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = `${environment.apiUrl}/client/addresses`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les adresses du client
   */
  getAddresses(): Observable<{ success: boolean; addresses: Address[] }> {
    return this.http.get<{ success: boolean; addresses: Address[] }>(this.apiUrl);
  }

  /**
   * Ajouter une nouvelle adresse
   */
  addAddress(addressData: AddressRequest): Observable<{ success: boolean; message: string; address: Address }> {
    return this.http.post<{ success: boolean; message: string; address: Address }>(this.apiUrl, addressData);
  }

  /**
   * Mettre à jour une adresse existante
   */
  updateAddress(id: number, addressData: AddressRequest): Observable<{ success: boolean; message: string; address: Address }> {
    return this.http.put<{ success: boolean; message: string; address: Address }>(`${this.apiUrl}/${id}`, addressData);
  }

  /**
   * Supprimer une adresse
   */
  deleteAddress(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Définir une adresse par défaut
   */
  setDefaultAddress(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/default`, {});
  }
} 