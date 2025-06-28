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
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      numero_fiscal: ['', [Validators.maxLength(50)]], // Optional tax number
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParamMap.subscribe(params => {
      this.selectedPlan = params.get('plan');
    });
  }

  get planName(): string | null {
    return this.selectedPlan;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
  if (this.sellerForm.valid) { // ✅ Supprimez "&& this.acceptedTerms"
    this.loading = true;
    
    const formData = this.sellerForm.value;
    const sellerData: SellerRegistrationData = {
      nom: formData.nom.trim(),
      email: formData.email.toLowerCase(),
      password: formData.password,
      role: 'vendeur' as const,
      numero_fiscal: formData.numero_fiscal || null
    };

    this.authService.registerSeller(sellerData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.snackBar.open(
          'Compte vendeur créé avec succès ! Choisissez un thème pour votre boutique.', 
          'Fermer', 
          { duration: 5000, panelClass: 'snackbar-success' }
        );
        this.router.navigate(['/auth/register/template'], { queryParams: { plan: this.selectedPlan } });
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
      }
    });
  } else {
    this.sellerForm.markAllAsTouched();
    
    // ✅ Vérifiez avec le FormControl
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