import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PropertyCardComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  properties: any[] = [];
  isLoading: boolean = true;
  searchForm: FormGroup;
  currentPage: number = 0;
  isLastPage: boolean = false;
  isLoadingMore: boolean = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      operationType: [''],
      propertyType: [''],
      zone: [''],
      bedrooms: [''],
      bathrooms: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadProperties(0);
  }

  onSearch() {
    const filters = this.searchForm.value;
    let queryParams: any = {};

    if (filters.operationType) queryParams.operationType = filters.operationType;
    if (filters.propertyType) queryParams.propertyType = filters.propertyType;
    if (filters.zone) queryParams.zone = filters.zone;
    if (filters.bedrooms) queryParams.bedrooms = filters.bedrooms;
    if (filters.bathrooms) queryParams.bathrooms = filters.bathrooms;
    if (filters.minPrice) queryParams.minPrice = filters.minPrice;
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;

    this.router.navigate(['/buscar'], { queryParams });
  }

  loadProperties(page: number = 0) {
    this.isLoading = page === 0;
    this.isLoadingMore = page > 0;
    this.cdr.markForCheck();

    this.propertyService.getProperties(page, 9)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (page === 0) {
            this.properties = res.content || [];
          } else {
            this.properties = [...this.properties, ...(res.content || [])];
          }

          this.isLastPage = res.last;
          this.isLoading = false;
          this.isLoadingMore = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al traer propiedades del backend:', error);
          this.isLoading = false;
          this.isLoadingMore = false;
          this.cdr.markForCheck();
        }
      });
  }

  cargarMas() {
    this.currentPage++;
    this.loadProperties(this.currentPage);
  }
}
