import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isTokenExpired } from '../utils/jwt.util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  let activeToken = token;

  if (token && isTokenExpired(token)) {
    console.warn('Token expirado detectado en localStorage. Limpiando sesión...');
    localStorage.removeItem('token');
    activeToken = null;
  }

  let clonedReq = req;

  if (activeToken) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${activeToken}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || (error.status === 403 && activeToken)) {
        console.warn('Sesión expirada, token inválido o sin autorización. Cerrando sesión...');
        localStorage.removeItem('token');
        if (router.url.includes('/admin')) {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
