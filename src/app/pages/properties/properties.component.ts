import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  pageTitle: string = 'Propiedades';
  properties: any[] = [];
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let operationType = params['operationType'] || undefined;
      let propertyType = params['propertyType'] || undefined;
      let zone = params['zone'] || undefined;
      let bedrooms = params['bedrooms'] || undefined;
      let bathrooms = params['bathrooms'] || undefined;

      if (this.router.url.includes('/venta')) {
        this.pageTitle = 'Propiedades en Venta';
        operationType = 'SALE';
      } else if (this.router.url.includes('/alquiler')) {
        this.pageTitle = 'Propiedades en Alquiler';
        operationType = 'RENT';
      } else if (this.router.url.includes('/buscar')) {
        this.pageTitle = 'Resultados de la Búsqueda';
      }

      this.isLoading = true;

      // Acá le pasamos todo al servicio
      this.propertyService.searchProperties(operationType, propertyType, zone, bedrooms, bathrooms, 0, 100).subscribe({
        next: (response: any) => {
          this.properties = response.content || [];
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error trayendo propiedades:', err);
          this.isLoading = false;
        }
      });
    });
  }
}
