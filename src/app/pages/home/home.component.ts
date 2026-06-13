import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyList } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Lista vacía esperando los datos de Spring Boot
  properties: PropertyList[] = [];
  isLoading: boolean = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.propertyService.getProperties(0, 6).subscribe({
      next: (response) => {
        this.properties = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al traer propiedades del backend:', error);
        this.isLoading = false;
      }
    });
  }
}
