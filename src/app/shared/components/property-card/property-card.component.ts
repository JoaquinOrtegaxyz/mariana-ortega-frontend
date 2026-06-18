import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html'
})
export class PropertyCardComponent {

  // Recibimos los datos de la propiedad
  @Input() property: any;

  // Función para buscar cuál es la foto de portada
  getCoverImage(): string {
    if (this.property?.images && this.property.images.length > 0) {
      // Busca la que tiene isCover en true
      const cover = this.property.images.find((img: any) => img.isCover);
      if (cover) return cover.url;
      // Si ninguna dice ser portada, agarra la primera
      return this.property.images[0].url;
    }
    // Si la casa no tiene fotos cargadas, muestra esta de relleno temporal
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';
  }

}
