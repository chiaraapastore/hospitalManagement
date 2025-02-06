import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isPublicRequest = req.url.includes('/public');

  if (isPublicRequest) return next(req);

  return authService.getToken().pipe(
    switchMap(token => {
      if (token) {
        const clonedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(clonedRequest);
      } else {
        router.navigate(['login']);
        return next(req);
      }
    }),
    catchError(error => {
      console.error('Errore durante il refresh del token:', error);
      return next(req);
    })
  );
};
