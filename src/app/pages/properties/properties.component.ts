import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesComponent implements OnInit {
  pageTitle: string = 'Propiedades';
  properties: any[] = [];
  isLoading: boolean = true;
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(params => {
        if (this.router.url.includes('/venta')) {
          this.pageTitle = 'Propiedades en Venta';
        } else if (this.router.url.includes('/alquiler')) {
          this.pageTitle = 'Propiedades en Alquiler';
        } else if (this.router.url.includes('/buscar')) {
          this.pageTitle = 'Resultados de la Búsqueda';
        } else {
          this.pageTitle = 'Propiedades';
        }
        this.isLoading = true;
        this.cdr.markForCheck();
      }),
      switchMap(params => {
        let operationType = params['operationType'] || undefined;
        let propertyType = params['propertyType'] || undefined;
        let zone = params['zone'] || undefined;
        let bedrooms = params['bedrooms'] || undefined;
        let bathrooms = params['bathrooms'] || undefined;

        if (this.router.url.includes('/venta')) {
          operationType = 'SALE';
        } else if (this.router.url.includes('/alquiler')) {
          operationType = 'RENT';
        }

        return this.propertyService.searchProperties(operationType, propertyType, zone, bedrooms, bathrooms, 0, 100).pipe(
          catchError(err => {
            console.error('Error trayendo propiedades:', err);
            return of({ content: [] });
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: any) => {
        this.properties = response.content || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
