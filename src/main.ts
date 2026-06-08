import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // <-- Cambiamos App por AppComponent

bootstrapApplication(AppComponent, appConfig)       // <-- Acá también
  .catch((err) => console.error(err));
