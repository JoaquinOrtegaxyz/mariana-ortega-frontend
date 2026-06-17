import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent {
  activeTab: string = 'nueva';
  propertyForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      propertyType: ['', Validators.required],
      operationType: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required], // <--- AGREGAMOS LA ALTURA ACÁ
      bedrooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: ['', [Validators.required, Validators.min(0)]]
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.successMessage = '';
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.successMessage = '';

      const formValue = this.propertyForm.value;

      // EL PAYLOAD AHORA SÍ COINCIDE CON TUS DTOS
      const payload = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        propertyType: formValue.propertyType,
        operationType: formValue.operationType,
        location: {
          street: formValue.street,
          streetNumber: formValue.streetNumber.toString(), // Lo pasamos a string por si meten "S/N"
          floor: '',
          apartment: ''
        },
        characteristics: {
          bedrooms: formValue.bedrooms,
          bathrooms: formValue.bathrooms,
          lotArea: 0.0,
          totalArea: 0.0,
          hasGarage: false,
          age: 0,
          latitude: 0.0,
          longitude: 0.0
        }
      };

      this.propertyService.createProperty(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = '¡Propiedad guardada con éxito!';
          this.propertyForm.reset();
          this.propertyForm.patchValue({
            propertyType: '',
            operationType: ''
          });
        },
        error: (err) => {
          console.error('Error guardando la propiedad:', err);
          this.isLoading = false;
          alert('Error al guardar. Fijate en la consola.');
        }
      });
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }
}
