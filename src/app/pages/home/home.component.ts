import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyList } from '../../models/property.model';
import { PropertyType, OperationType } from '../../models/property.enums';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  // Lista de prueba (Mock) para ver el diseño de la grilla
  mockProperties: PropertyList[] = [
    {
      id: 1,
      title: 'Chalet a media cuadra del mar',
      price: 120000,
      propertyType: PropertyType.HOUSE,
      operationType: OperationType.SALE,
      coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800',
      bedrooms: 3,
      bathrooms: 2,
      street: 'Av. 2 y 89'
    },
    {
      id: 2,
      title: 'Depto céntrico súper luminoso',
      price: 350000, // Precio de alquiler en pesos (ejemplo)
      propertyType: PropertyType.APARTMENT,
      operationType: OperationType.RENT,
      coverImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800',
      bedrooms: 1,
      bathrooms: 1,
      street: 'Calle 62 N° 2800'
    },
    {
      id: 3,
      title: 'Hermosa cabaña en Quequén',
      price: 85000,
      propertyType: PropertyType.HOUSE,
      operationType: OperationType.SALE,
      coverImageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?q=80&w=800',
      bedrooms: 2,
      bathrooms: 1,
      street: 'Calle 502'
    }
  ];

}
