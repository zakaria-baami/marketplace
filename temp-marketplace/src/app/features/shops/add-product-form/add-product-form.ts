import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-product-form.html',
  styleUrls: ['./add-product-form.css']
})
export class AddProductFormComponent implements OnInit {
  @Input() boutiqueId!: number;
  @Input() categories: any[] = [];
  @Output() productAdded = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  newProduct = {
    nom: '',
    description: '',
    prix: null as number | null,
    stock: 0,
    categorie_id: null as number | null,
    tags: ''
  };

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  addingProduct = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Catégories reçues dans le formulaire:', this.categories);
    console.log('🔍 boutiqueId reçu:', this.boutiqueId);
  }

  onImageSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('L\'image est trop volumineuse (max 5MB)', 'Fermer', {
          duration: 3000
        });
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Veuillez sélectionner une image valide', 'Fermer', {
          duration: 3000
        });
        return;
      }
      
      this.selectedImage = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      this.onImageSelected(fakeEvent);
    }
  }

  removeImage() {
    this.selectedImage = null;
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }
  }

  addProduct() {
    if (!this.newProduct.nom || !this.newProduct.prix || this.newProduct.stock === null || !this.newProduct.categorie_id) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 3000
      });
      return;
    }

    // Vérifier que boutiqueId est défini
    if (!this.boutiqueId) {
      console.error('❌ boutiqueId est undefined!');
      this.snackBar.open('Erreur: ID de boutique manquant', 'Fermer', {
        duration: 3000
      });
      return;
    }

    // Vérifier l'authentification
    let token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('accessToken');
    }
    
    console.log('🔑 Token disponible:', !!token);
    console.log('👤 Utilisateur connecté:', this.authService.currentUserValue);
    console.log('🏪 boutiqueId pour création:', this.boutiqueId);
    
    if (!token) {
      this.snackBar.open('Vous devez être connecté pour ajouter un produit', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.addingProduct = true;

    // Création du FormData
    const formData = new FormData();
    formData.append('nom', this.newProduct.nom);
    formData.append('description', this.newProduct.description || '');
    formData.append('prix', String(this.newProduct.prix));
    formData.append('stock', String(this.newProduct.stock));
    formData.append('categorie_id', String(this.newProduct.categorie_id));
    formData.append('boutique_id', String(this.boutiqueId));
    if (this.newProduct.tags) {
      formData.append('tags', this.newProduct.tags);
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // Log des données envoyées
    console.log('🟢 FormData envoyé:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    console.log('📤 Envoi du produit avec token:', token.substring(0, 20) + '...');
    console.log('🎯 URL de l\'API:', `${environment.apiUrl}/produits`);

    // Utiliser l'endpoint public produits
    this.http.post<any>(`${environment.apiUrl}/produits`, formData).subscribe({
      next: (response) => {
        console.log('✅ Produit ajouté avec succès:', response);
        this.addingProduct = false;
        this.snackBar.open('Produit ajouté avec succès!', 'Fermer', {
          duration: 3000
        });
        this.productAdded.emit(response);
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Erreur création produit:', error);
        console.error('📋 Détails de l\'erreur:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        // Log détaillé de l'erreur
        console.log('🛑 error.error complet:', error.error);
        console.log('🛑 error complet:', error);
        
        this.addingProduct = false;
        
        let errorMessage = 'Erreur lors de la création du produit';
        if (error.status === 401) {
          errorMessage = 'Token expiré, veuillez vous reconnecter';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'êtes pas autorisé à ajouter des produits';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint non trouvé. Vérifiez la configuration de l\'API';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          // Gestion des erreurs de validation
          const validationErrors = error.error.errors;
          errorMessage = 'Erreurs de validation:\n' + 
            validationErrors.map((err: any) => `${err.field}: ${err.message}`).join('\n');
        }
        
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000
        });
      }
    });
  }

  cancel() {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm() {
    this.newProduct = {
      nom: '',
      description: '',
      prix: null,
      stock: 0,
      categorie_id: null,
      tags: ''
    };
    this.removeImage();
  }
} 