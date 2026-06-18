import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyList } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { OperationType } from '../../models/property.enums';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  pageTitle: string = '';
  properties: PropertyList[] = []; // <--- Lista limpia
  isLoading: boolean = true;

  constructor(private router: Router, private propertyService: PropertyService) {}

  ngOnInit(): void {
    let operation: OperationType | undefined = undefined;

    // Nos fijamos en qué página estamos para pedirle al backend lo correcto
    if (this.router.url.includes('/venta')) {
      this.pageTitle = 'Propiedades en Venta';
      operation = OperationType.SALE;
    } else if (this.router.url.includes('/alquiler')) {
      this.pageTitle = 'Propiedades en Alquiler';
      operation = OperationType.RENT;
    }

    // Le pegamos al endpoint que armamos en el servicio
    this.propertyService.searchProperties(operation, undefined, 0, 12).subscribe({
      // ¡ACÁ LE AGREGAMOS EL : any !
      next: (response: any) => {
        this.properties = response.content || [];
        this.isLoading = false;
      },
      // ¡ACÁ TAMBIÉN LE AGREGAMOS EL : any !
      error: (err: any) => {
        console.error('Error trayendo propiedades:', err);
        this.isLoading = false;
      }
    });
  }
}
