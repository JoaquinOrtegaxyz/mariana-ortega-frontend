import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number | null = null;
  property: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  images: string[] = [];
  currentImageIndex: number = 0;

  contactForm: FormGroup;

  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
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

        // MAGIA DEL MAPA: Le tiramos todos los parámetros a Google para forzar el pin (iwloc=B)
        if (this.property.location?.street) {
          const address = `${this.property.location.street} ${this.property.location.streetNumber || ''}, Necochea, Buenos Aires, Argentina`;
          const url = `https://maps.google.com/maps?width=100%25&height=100%25&hl=es-419&q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
          this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

        // Lógica de imágenes
        if (this.property.images && this.property.images.length > 0) {
          const coverImg = this.property.images.find((i: any) => i.isCover) || this.property.images[0];
          const otherImgs = this.property.images.filter((i: any) => i.id !== coverImg.id);
          this.images = [coverImg.url, ...otherImgs.map((i: any) => i.url)];
        } else {
          this.images = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200'];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error trayendo la propiedad:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.images.length - 1;
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
