import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  infoMessage: string = ''; // Para el cartel amarillo si te rebotan
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Armamos el formulario exigiendo que ponga mail y contraseña
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si el patovica (Guard) lo pateó para acá, leemos el parámetro y mostramos el cartel
    this.route.queryParams.subscribe(params => {
      if (params['accesoDenegado']) {
        this.infoMessage = 'Tenés que iniciar sesión para acceder al panel.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.infoMessage = ''; // Limpiamos el cartel amarillo por las dudas

      // Llamamos al backend para ver si existe
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Todo joya, lo dejamos pasar al admin
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          // Le erró a la contraseña o al mail
          console.error(err);
          this.errorMessage = 'Correo o contraseña incorrectos.';
          this.isLoading = false;
        }
      });
    } else {
      // Le dio click a entrar pero dejó todo vacío, saltan las alertas rojas
      this.loginForm.markAllAsTouched();
    }
  }
}
