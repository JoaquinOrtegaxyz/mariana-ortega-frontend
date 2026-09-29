import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PropertyCardComponent],
  templateUrl: './properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesComponent implements OnInit {
  pageTitle: string = 'Propiedades';
  properties: any[] = [];
  isLoading: boolean = true;
  private destroyRef = inject(DestroyRef);

  // Filtros activos
  currentOperationType: string | undefined = undefined;
  selectedPropertyType: string = '';
  selectedZone: string = '';
  selectedBedrooms: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

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
          this.currentOperationType = 'SALE';
        } else if (this.router.url.includes('/alquiler')) {
          this.pageTitle = 'Propiedades en Alquiler';
          this.currentOperationType = 'RENT';
        } else if (this.router.url.includes('/buscar')) {
          this.pageTitle = 'Resultados de la Búsqueda';
          this.currentOperationType = params['operationType'] || undefined;
        } else {
          this.pageTitle = 'Propiedades';
          this.currentOperationType = params['operationType'] || undefined;
        }

        this.selectedPropertyType = params['propertyType'] || '';
        this.selectedZone = params['zone'] || '';
        this.selectedBedrooms = params['bedrooms'] || '';
        this.minPrice = params['minPrice'] ? Number(params['minPrice']) : null;
        this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : null;

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
      },
      error: (err) => {
        console.error('Error trayendo propiedades:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
    });
  }

  loadProperties(): void {
    this.isLoading = true;

    const bedroomsNum = this.selectedBedrooms ? Number(this.selectedBedrooms) : undefined;
    const minPriceNum = this.minPrice ? Number(this.minPrice) : undefined;
    const maxPriceNum = this.maxPrice ? Number(this.maxPrice) : undefined;

    this.propertyService.searchProperties(
      this.currentOperationType,
      this.selectedPropertyType || undefined,
      this.selectedZone || undefined,
      bedroomsNum,
      undefined, // bathrooms
      minPriceNum,
      maxPriceNum,
      0,
      100
    ).subscribe({
      next: (response: any) => {
        this.properties = response.content || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error trayendo propiedades:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const queryParams: any = {};

    if (this.currentOperationType && !this.router.url.includes('/venta') && !this.router.url.includes('/alquiler')) {
      queryParams['operationType'] = this.currentOperationType;
    }
    if (this.selectedPropertyType) queryParams['propertyType'] = this.selectedPropertyType;
    if (this.selectedZone) queryParams['zone'] = this.selectedZone;
    if (this.selectedBedrooms) queryParams['bedrooms'] = this.selectedBedrooms;
    if (this.minPrice != null && this.minPrice > 0) queryParams['minPrice'] = this.minPrice;
    if (this.maxPrice != null && this.maxPrice > 0) queryParams['maxPrice'] = this.maxPrice;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: ''
    });
  }

  resetFilters(): void {
    this.selectedPropertyType = '';
    this.selectedZone = '';
    this.selectedBedrooms = '';
    this.minPrice = null;
    this.maxPrice = null;

    const queryParams: any = {};
    if (this.currentOperationType && !this.router.url.includes('/venta') && !this.router.url.includes('/alquiler')) {
      queryParams['operationType'] = this.currentOperationType;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.selectedPropertyType ||
      this.selectedZone ||
      this.selectedBedrooms ||
      (this.minPrice != null && this.minPrice > 0) ||
      (this.maxPrice != null && this.maxPrice > 0)
    );
  }
}
