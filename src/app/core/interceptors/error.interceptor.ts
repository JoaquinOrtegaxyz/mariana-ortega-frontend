import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado. Por favor, intentá nuevamente.';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          errorMessage = 'Sesión expirada o credenciales inválidas. Por favor, iniciá sesión.';
        } else if (error.status === 403) {
          errorMessage = 'No tenés permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage = 'El recurso solicitado no fue encontrado.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      console.error(`[HTTP Error ${error.status}]:`, errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
