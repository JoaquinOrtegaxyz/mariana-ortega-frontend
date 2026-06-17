import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay un token guardado, clonamos la petición y se lo pegamos en el encabezado
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned); // Mandamos la petición modificada
  }

  // Si no hay token (ej: cuando te estás logueando), pasa la petición limpia
  return next(req);
};
