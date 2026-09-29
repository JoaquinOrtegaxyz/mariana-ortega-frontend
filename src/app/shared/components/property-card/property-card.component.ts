import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyCardComponent {
  private _property: any;
  coverImageUrl: string = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';

  @Input()
  set property(val: any) {
    this._property = val;
    this.coverImageUrl = this.computeCoverImage(val);
  }
  get property(): any {
    return this._property;
  }

  getCoverImage(): string {
    if (this.property?.coverImageUrl) {
      if (this.property.coverImageUrl.includes('/upload/') && !this.property.coverImageUrl.includes('/upload/f_auto')) {
        return this.property.coverImageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
      }
      return this.property.coverImageUrl;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';
  }
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600';
  }
}
