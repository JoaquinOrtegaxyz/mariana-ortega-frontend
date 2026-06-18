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

  @Input() property: any;

  getCoverImage(): string {
    // Tu backend ya manda un campo directo que se llama coverImageUrl
    if (this.property?.coverImageUrl) {
      return this.property.coverImageUrl;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';
  }

}
