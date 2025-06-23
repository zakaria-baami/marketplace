import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;
  logoExists = true; // Set to false if logo is not found to prevent 404

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (user) => {
        // Redirect based on role
        if (user.role === 'vendeur') {
          this.router.navigate(['/vendeur']);
        } else if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        const errorMessage = err.error.message || 'Login failed. Please check your credentials.';
        this.error = errorMessage;
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white']
        });
        console.error(err);
      }
    });
  }
}
