import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, ClientProfile } from '../../../core/services/user';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  user: ClientProfile | null = null;
  hasChanges = false;
  initialValues: any = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    
    // Vérifier si l'utilisateur est connecté
    this.checkAuthentication();
    
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)]],
      adresse: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordsValidator });

    // Détection propre des changements
    this.profileForm.valueChanges.subscribe(() => {
      this.hasChanges = this.detectChanges();
    });
  }

  // Détection propre des changements
  detectChanges(): boolean {
    if (!this.user || !this.initialValues.nom) return false;
    const currentValues = this.profileForm.value;
    const nomChanged = currentValues.nom !== this.initialValues.nom;
    const emailChanged = currentValues.email !== this.initialValues.email;
    const telephoneChanged = currentValues.telephone !== this.initialValues.telephone;
    const adresseChanged = currentValues.adresse !== this.initialValues.adresse;
    const passwordChanged = currentValues.currentPassword || currentValues.newPassword || currentValues.confirmPassword;
    return nomChanged || emailChanged || telephoneChanged || adresseChanged || passwordChanged;
  }

  // Validation croisée pour les mots de passe (optionnelle)
  passwordsValidator(group: AbstractControl): ValidationErrors | null {
    const current = group.get('currentPassword')?.value;
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    
    // Si aucun champ de mot de passe n'est rempli, pas de validation
    if (!current && !newPass && !confirm) {
      return null;
    }
    
    // Si au moins un champ est rempli, valider tous les champs
    if (newPass || confirm || current) {
      if (!current) {
        return { currentPasswordRequired: true };
      }
      if (!newPass || newPass.length < 6) {
        return { newPasswordInvalid: true };
      }
      if (newPass !== confirm) {
        return { passwordsMismatch: true };
      }
    }
    return null;
  }

  loadUserProfile() {
    this.loading = true;
    this.userService.getClientProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        
        // Sauvegarder les valeurs initiales AVANT de remplir le formulaire
        this.initialValues = {
          nom: profile.nom,
          email: profile.email,
          telephone: profile.telephone || '',
          adresse: profile.adresse || ''
        };
        
        // Remplir le formulaire avec les valeurs du profil
        this.profileForm.setValue({
          nom: profile.nom,
          email: profile.email,
          telephone: profile.telephone || '',
          adresse: profile.adresse || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        this.loading = false;
        this.hasChanges = false;
        
        console.log('Profil chargé, valeurs initiales:', this.initialValues);
        
        // Forcer la vérification des changements après le chargement
        setTimeout(() => {
          this.detectChanges();
        }, 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    
    this.loading = true;
    const { nom, email, telephone, adresse, currentPassword, newPassword, confirmPassword } = this.profileForm.value;
    
    // 1. Toujours mettre à jour les infos de base (nom, email, téléphone, adresse)
    this.userService.updateClientProfile({ nom, email, telephone, adresse }).subscribe({
      next: () => {
        // 2. Si l'utilisateur veut changer le mot de passe (optionnel)
        if (currentPassword && newPassword && confirmPassword) {
          this.userService.changePassword({ currentPassword, newPassword }).subscribe({
            next: () => {
              this.snackBar.open('Mot de passe modifié avec succès. Veuillez vous reconnecter.', 'Fermer', { duration: 4000 });
              this.loading = false;
              this.authService.logout();
              this.router.navigate(['/auth/login']);
            },
            error: (err: HttpErrorResponse) => {
              this.snackBar.open(err.error?.message || 'Erreur lors du changement de mot de passe', 'Fermer', { duration: 4000 });
              this.loading = false;
            }
          });
        } else {
          this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.loading = false;
          this.updateInitialValues();
          this.hasChanges = false;
          this.router.navigate(['/client/profile'], { queryParams: { refresh: 'true' } }); // Redirection avec paramètre de rafraîchissement
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Erreur lors de la mise à jour du profil', 'Fermer', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  // Méthode pour mettre à jour les valeurs initiales après sauvegarde
  updateInitialValues() {
    const currentValues = this.profileForm.value;
    this.initialValues = {
      nom: currentValues.nom,
      email: currentValues.email,
      telephone: currentValues.telephone,
      adresse: currentValues.adresse
    };
    console.log('Valeurs initiales mises à jour:', this.initialValues);
  }

  onCancel() {
    this.router.navigate(['/products']);
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (fieldName === 'currentPassword' && this.profileForm.hasError('currentPasswordRequired')) {
      return 'L\'ancien mot de passe est requis pour changer le mot de passe';
    }
    if (fieldName === 'newPassword' && this.profileForm.hasError('newPasswordInvalid')) {
      return 'Le nouveau mot de passe doit contenir au moins 6 caractères';
    }
    if (fieldName === 'confirmPassword' && this.profileForm.hasError('passwordsMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (field?.hasError('email')) {
      return 'Format email invalide';
    }
    if (field?.hasError('minlength')) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    }
    if (field?.hasError('pattern')) {
      return 'Format de téléphone invalide';
    }
    return '';
  }

  checkAuthentication() {
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    const token = storage?.getItem('accessToken');
    const user = storage?.getItem('currentUser');
    
    console.log('=== VÉRIFICATION AUTHENTIFICATION ===');
    console.log('Token existe:', !!token);
    console.log('User existe:', !!user);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('User:', user ? JSON.parse(user).nom : 'null');
    console.log('=====================================');
    
    if (!token) {
      this.snackBar.open('Vous devez être connecté pour accéder à cette page', 'Fermer', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }
  }
} 