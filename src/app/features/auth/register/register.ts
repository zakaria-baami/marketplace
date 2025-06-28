import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
import { AuthService } from '../../../core/services/auth';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  userType = 'client'; // nouveau

  // ✅ Version corrigée
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
 constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router,
  private snackBar: MatSnackBar,
  private route: ActivatedRoute
) {
  this.registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    phone: [''],
    userType: ['client'],
    numero_fiscal: [''],
    acceptTerms: [false, [Validators.requiredTrue]] // ✅ Ajoutez cette ligne
  }, { validators: this.passwordMatchValidator });
}

  // Nouvelle méthode pour changer le type d'utilisateur
  onUserTypeChange(type: string) {
    this.userType = type;
    this.registerForm.patchValue({ userType: type });
    
    // Ajouter validation du numéro fiscal pour les vendeurs
    if (type === 'vendeur') {
      this.registerForm.get('numero_fiscal')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('numero_fiscal')?.clearValidators();
    }
    this.registerForm.get('numero_fiscal')?.updateValueAndValidity();
  }
  private markFormGroupTouched(): void {
  Object.keys(this.registerForm.controls).forEach(key => {
    const control = this.registerForm.get(key);
    if (control) {
      control.markAsTouched();
    }
  });
}

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const formData = this.registerForm.value;
      
      if (formData.userType === 'vendeur') {
        // Inscription vendeur
        const sellerData = {
          nom: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: 'vendeur' as const,
          numero_fiscal: formData.numero_fiscal || null
        };

        this.authService.registerSeller(sellerData).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.snackBar.open(
              'Compte vendeur créé avec succès !', 
              'Fermer', 
              { duration: 5000 }
            );
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            this.loading = false;
            this.snackBar.open(
              error?.error?.message || 'Erreur lors de la création du compte vendeur',
              'Fermer',
              { duration: 5000 }
            );
          }
        });
      } else {
        // Inscription client (code existant)
        const userData = {
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          phone: formData.phone || undefined
        };
        
        this.authService.registerClient(userData).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.snackBar.open(
              'Compte créé avec succès !', 
              'Fermer', 
              { duration: 5000 }
            );
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            if (returnUrl) {
              this.router.navigateByUrl(returnUrl);
            }
          },
          error: (error: any) => {
            this.loading = false;
            this.snackBar.open(
              error?.error?.message || 'Erreur lors de la création du compte',
              'Fermer',
              { duration: 5000 }
            );
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
    
  }
}