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
    if (this.property?.coverImageUrl) {
      if (this.property.coverImageUrl.includes('/upload/')) {
        return this.property.coverImageUrl.replace('/upload/', '/upload/w_600,h_400,c_fill,f_auto,q_auto/');
      }
      return this.property.coverImageUrl;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';
  }

}
