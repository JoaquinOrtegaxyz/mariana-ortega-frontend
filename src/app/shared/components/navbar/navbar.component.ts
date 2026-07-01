import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;
  whatsappNumber: string = '5492262579622'; // Un número por defecto por las dudas
  facebookLink: string = '';
  instagramLink: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private configService: ConfigService // Inyectamos tu nuevo servicio
  ) {}

  ngOnInit() {
    // Nos suscribimos a los cambios de la configuración en tiempo real
    this.configService.config$.subscribe(config => {
      if (config) {
        this.whatsappNumber = config.whatsapp;
        this.facebookLink = config.facebook;
        this.instagramLink = config.instagram;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
