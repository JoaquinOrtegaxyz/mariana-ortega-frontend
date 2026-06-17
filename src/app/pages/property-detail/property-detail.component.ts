import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  // IMPORTANTE: Sumamos ReactiveFormsModule acá
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number | null = null;
  property: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  // Variables para la Galería
  images: string[] = [];
  currentImageIndex: number = 0;

  // Formulario Chill
  contactForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {
    // Armamos el formulario básico
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['Hola, me interesa esta propiedad y quiero más información.', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.propertyId = +id;
        this.fetchProperty(this.propertyId);
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  fetchProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;

        // Simulamos una galería. El día de mañana esto lo trae el backend.
        this.images = [
          this.property.coverImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200'
        ];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error trayendo la propiedad:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // Métodos para cambiar de foto
  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0; // Vuelve a la primera
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.images.length - 1; // Va a la última
    }
  }

  setMainImage(index: number) {
    this.currentImageIndex = index;
  }

  submitContact() {
    if (this.contactForm.valid) {
      console.log('Mensaje para enviar:', this.contactForm.value);
      alert('¡Mensaje enviado con éxito! La inmobiliaria se contactará a la brevedad.');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
