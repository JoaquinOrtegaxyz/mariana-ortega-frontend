import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PropertyCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  properties: any[] = [];
  isLoading: boolean = true;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private propertyService: PropertyService
  ) {
    // Acá están TODOS tus filtros
    this.searchForm = this.fb.group({
      operationType: [''],
      propertyType: [''],
      zone: [''],
      bedrooms: [''],
      bathrooms: ['']
    });
  }

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

  onSearch() {
    const filters = this.searchForm.value;
    let queryParams: any = {};

    // Solo mandamos los filtros que el usuario tocó
    if (filters.operationType) queryParams.operationType = filters.operationType;
    if (filters.propertyType) queryParams.propertyType = filters.propertyType;
    if (filters.zone) queryParams.zone = filters.zone;
    if (filters.bedrooms) queryParams.bedrooms = filters.bedrooms;
    if (filters.bathrooms) queryParams.bathrooms = filters.bathrooms;

    // Los mandamos a la ruta /buscar con todo el choclo de parámetros
    this.router.navigate(['/buscar'], { queryParams });
  }
}
