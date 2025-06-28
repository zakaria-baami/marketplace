import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Fonction utilitaire pour vérifier si localStorage est disponible
function getLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const storage = getLocalStorage();
  
  // Récupérer le token depuis le localStorage seulement si disponible
  const token = storage?.getItem('accessToken');
  
  // Si un token existe, l'ajouter aux headers
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si l'erreur est 401 (Unauthorized), rediriger vers la page de connexion
      if (error.status === 401) {
        console.log('Token expiré ou invalide, redirection vers la connexion...');
        storage?.removeItem('accessToken');
        storage?.removeItem('currentUser');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
} 