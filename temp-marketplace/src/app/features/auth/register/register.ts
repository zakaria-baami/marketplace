import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  userType = 'client'; // nouveau
  isVendeur = false;

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
    acceptTerms: [false, [Validators.requiredTrue]],
    template_id: [null]
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

  ngOnInit() {
    // Redirige automatiquement de /auth/register?role=vendeur vers /auth/register/plans
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'vendeur') {
        this.router.navigate(['/auth/register/plans']);
      }
    });
    // Si on est sur /auth/register/vendeur, redirige directement vers la sélection de template avec le plan choisi
    this.route.url.subscribe(segments => {
      const isVendeurRoute = segments.some(seg => seg.path === 'vendeur');
      if (isVendeurRoute) {
        this.route.queryParams.subscribe(params => {
          const plan = params['plan'] || 'PRO';
          this.router.navigate(['/auth/register/template'], { queryParams: { plan } });
        });
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;
      if (this.isVendeur) {
        this.router.navigate(['/auth/register/template']);
        this.loading = false;
        return;
      }
      // ... code existant pour inscription client ...
    } else {
      this.markFormGroupTouched();
    }
  }
}