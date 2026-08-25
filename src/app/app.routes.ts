import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'venta',
    loadComponent: () => import('./pages/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'alquiler',
    loadComponent: () => import('./pages/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'buscar',
    loadComponent: () => import('./pages/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'propiedad/:id',
    loadComponent: () => import('./pages/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
