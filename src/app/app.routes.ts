import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'venta', component: PropertiesComponent },
  { path: 'alquiler', component: PropertiesComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'propiedad/:id', component: PropertyDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
