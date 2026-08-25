import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryUrl',
  standalone: true,
  pure: true
})
export class CloudinaryUrlPipe implements PipeTransform {
  transform(url: string | null | undefined, width: number = 600, defaultUrl: string = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600'): string {
    if (!url) {
      return defaultUrl;
    }
    if (url.includes('/upload/') && !url.includes('/upload/f_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
    return url;
  }
}
