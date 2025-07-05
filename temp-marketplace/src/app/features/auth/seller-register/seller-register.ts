import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, SellerRegistrationData } from '../../../core/services/auth';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'app-seller-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    LogoComponent
  ],
  templateUrl: './seller-register.html',
  styleUrl: './seller-register.css'
})
export class SellerRegisterComponent {
  sellerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  acceptedTerms = false;
  selectedPlan: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.sellerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      numero_fiscal: ['', Validators.required],
      shopName: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParamMap.subscribe(params => {
      this.selectedPlan = params.get('plan');
    });
  }

  get planName(): string | null {
    return this.selectedPlan;
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.sellerForm.valid) {
      this.loading = true;
      const formData = this.sellerForm.value;
      const sellerData: SellerRegistrationData & { template_id: number } = {
        nom: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: 'vendeur' as const,
        numero_fiscal: formData.numero_fiscal || null,
        shopName: formData.shopName.trim(),
        template_id: 14
      };

      console.log('Payload envoyé:', sellerData);

      this.authService.registerSeller(sellerData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.snackBar.open(
            'Compte vendeur créé avec succès ! Choisissez un thème pour votre boutique.', 
            'Fermer', 
            { duration: 5000, panelClass: 'snackbar-success' }
          );
          this.router.navigate(['/auth/register/template']);
        },
        error: (error: any) => {
          this.loading = false;
          let errorMessage = 'Erreur lors de la création du compte vendeur';
          
          if (error?.error?.message) {
            if (Array.isArray(error.error.message)) {
              errorMessage = error.error.message.map((e: any) => e.msg || e).join(' | ');
            } else {
              errorMessage = error.error.message;
            }
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          }
          
          this.snackBar.open(errorMessage, 'Fermer', { 
            duration: 5000, 
            panelClass: 'snackbar-error' 
          });
          this.router.navigate(['/auth/register/template']);
        }
      });
    } else {
      Object.values(this.sellerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      if (this.sellerForm.get('acceptTerms')?.value === false) {
        this.snackBar.open('Veuillez accepter les conditions d\'utilisation', 'Fermer', { 
          duration: 3000, 
          panelClass: 'snackbar-error' 
        });
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.sellerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Veuillez entrer une adresse email valide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
    }
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
} 