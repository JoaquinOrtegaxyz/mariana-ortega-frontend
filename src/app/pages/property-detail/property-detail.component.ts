import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyDetail } from '../../models/property.model';
import { PropertyType, OperationType, PropertyStatus } from '../../models/property.enums';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  propertyId!: number;
  property!: PropertyDetail;
  selectedImageUrl: string = ''; // <--- Nueva variable para rastrear la foto grande activa

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    // Mock temporal para probar la interfaz
    this.property = {
      id: this.propertyId,
      title: 'Hermoso Chalet a media cuadra del mar',
      description: 'Excepcional propiedad ubicada en una de las mejores zonas de la ciudad. Cuenta con un amplio living comedor súper luminoso, cocina totalmente equipada con muebles a medida, patio trasero con parrilla ideal para el verano y cochera cubierta. Excelente oportunidad tanto para vivienda permanente como para inversión turística.',
      price: 120000,
      status: PropertyStatus.AVAILABLE,
      propertyType: PropertyType.HOUSE,
      operationType: OperationType.SALE,
      location: {
        street: 'Av. 2',
        streetNumber: '4000',
      },
      characteristics: {
        bedrooms: 3,
        bathrooms: 2,
        totalArea: 150,
        lotArea: 300,
        hasGarage: true,
        age: 15
      },
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', isCover: true },
        { id: 2, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800', isCover: false },
        { id: 3, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', isCover: false }
      ]
    };

    // Inicializamos el visor con la primera foto de la lista
    if (this.property && this.property.images.length > 0) {
      this.selectedImageUrl = this.property.images[0].url;
    }
  }

  // Método para cambiar la foto al hacer click en las miniaturas
  changeActiveImage(url: string): void {
    this.selectedImageUrl = url;
  }
}
