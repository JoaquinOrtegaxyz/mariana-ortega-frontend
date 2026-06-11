import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyList } from '../../../models/property.model'; // Fijate que la ruta coincida con tus carpetas

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html'
})
export class PropertyCardComponent {
  // Recibimos la propiedad, le ponemos el ! para decirle a TS que siempre va a llegar
  @Input() property!: PropertyList;
}
