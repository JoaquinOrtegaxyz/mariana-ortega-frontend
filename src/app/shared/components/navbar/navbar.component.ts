import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // <--- Agregamos Router
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css' // Si tenés este archivo
})
export class NavbarComponent {
  // Variable para controlar si el menú está abierto
  isMenuOpen: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  // Abre y cierra el menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cierra el menú (útil cuando haces clic en un enlace)
  closeMenu() {
    this.isMenuOpen = false;
  }

  // Borra el token, cierra el menú y te manda a la home
  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
