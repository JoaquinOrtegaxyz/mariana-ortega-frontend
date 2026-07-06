import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, Meta, Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.component.html'
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number | null = null;
  property: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  images: string[] = [];
  currentImageIndex: number = 0;
  mapUrl: SafeResourceUrl | null = null;
  linkCopiado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title
  ) {}

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

        // Mapa
        if (this.property.location?.street) {
          const address = `${this.property.location.street} ${this.property.location.streetNumber || ''}, Necochea, Buenos Aires, Argentina`;
          const url = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
          this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

        // Imágenes con optimización de Cloudinary
        if (this.property.images && this.property.images.length > 0) {
          const coverImg = this.property.images.find((i: any) => i.isCover) || this.property.images[0];
          const otherImgs = this.property.images.filter((i: any) => i.id !== coverImg.id);
          this.images = [coverImg.url, ...otherImgs.map((i: any) => i.url)]
            .map(url => url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/'));
        } else {
          this.images = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200'];
        }

        // --- MAGIA SEO / META TAGS ---
        this.title.setTitle(`${this.property.title} | Mariana Ortega Inmobiliaria`);

        // Tags para WhatsApp y Facebook (Open Graph)
        this.meta.updateTag({ property: 'og:title', content: this.property.title });
        this.meta.updateTag({ property: 'og:description', content: `Precio: U$S ${this.property.price}. ${this.property.characteristics?.bedrooms} Dormitorios. ¡Mirá más detalles acá!` });
        this.meta.updateTag({ property: 'og:image', content: this.images[0] });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error trayendo la propiedad:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // --- FUNCIÓN DEL BOTÓN COMPARTIR ---
  shareProperty() {
    const url = window.location.href;
    const shareData = {
      title: this.property.title,
      text: '¡Mirá esta propiedad que encontré en Mariana Ortega Inmobiliaria!',
      url: url
    };

    // Si es un celu y soporta compartir nativo
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error al compartir', err));
    } else {
      // Si es una compu vieja, le copia el link al portapapeles
      navigator.clipboard.writeText(url).then(() => {
        this.linkCopiado = true;
        setTimeout(() => this.linkCopiado = false, 3000); // El aviso se borra a los 3 seg
      });
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex < this.images.length - 1) ? this.currentImageIndex + 1 : 0;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.images.length - 1;
  }

  setMainImage(index: number) {
    this.currentImageIndex = index;
  }
}
