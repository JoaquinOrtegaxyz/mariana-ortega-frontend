import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from '../../models/auth.model';
import { environment } from '../../../environments/environment';
import { isTokenExpired } from '../utils/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  changePassword(data: {currentPassword: string, newPassword: string}): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, data, { responseType: 'text' });
  }
}
