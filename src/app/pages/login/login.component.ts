import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // Clave importar ReactiveFormsModule para que ande el form
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicializamos el formulario con los dos campos obligatorios
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // Si el formulario pasa las validaciones (tiene mail válido y contraseña)
    if (this.loginForm.valid) {
      console.log('Datos listos para mandar al backend:', this.loginForm.value);

      // Acá después llamamos al AuthService y si da OK hacemos:
      // this.router.navigate(['/admin']);
    } else {
      // Si el usuario le dio a Enter sin llenar nada, marcamos todo como "tocado"
      // para que salten los cartelitos rojos de error
      this.loginForm.markAllAsTouched();
    }
  }
}
