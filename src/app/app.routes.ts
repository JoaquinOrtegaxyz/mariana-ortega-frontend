import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // La ruta vacía es la Home
  { path: 'login', component: LoginComponent },
  { path: 'property/:id', component: PropertyDetailComponent }, // Le pasamos un ID dinámico
  { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard] }, // Acá labura el patovica
  { path: '**', redirectTo: '' } // Cualquier ruta que no exista (error 404), te patea a la Home
];
