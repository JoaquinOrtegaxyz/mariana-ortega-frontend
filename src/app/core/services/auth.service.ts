import { AuthResponse } from '../../models/auth.model';
import { LoginRequest } from '../../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // Envía las credenciales y guarda el token si está todo en orden
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Chequeo rápido para saber si el usuario tiene sesión activa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Borra la sesión para cerrar el panel
  logout(): void {
    localStorage.removeItem('token');
  }
}
