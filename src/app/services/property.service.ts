import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;
  private imagesUrl = `${environment.apiUrl}/images`;

  // Caché en memoria para navegación instantánea (TTL de 90 segundos)
  private cache = new Map<string, { data: any, expiry: number }>();
  private readonly CACHE_TTL = 90_000;

  constructor(private http: HttpClient) {}

  clearCache(): void {
    this.cache.clear();
  }

  getProperties(page: number = 0, size: number = 100): Observable<any> {
    const cacheKey = `properties-page-${page}-size-${size}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(data => this.cache.set(cacheKey, { data, expiry: Date.now() + this.CACHE_TTL }))
    );
  }

  searchProperties(
    operationType?: string,
    propertyType?: string,
    zone?: string,
    bedrooms?: number,
    bathrooms?: number,
    minPrice?: number,
    maxPrice?: number,
    page: number = 0,
    size: number = 12
  ): Observable<any> {
    const cacheKey = `search-${operationType || ''}-${propertyType || ''}-${zone || ''}-${bedrooms || ''}-${bathrooms || ''}-${minPrice || ''}-${maxPrice || ''}-${page}-${size}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (operationType) params = params.set('operationType', operationType);
    if (propertyType) params = params.set('propertyType', propertyType);
    if (zone) params = params.set('zone', zone);
    if (bedrooms) params = params.set('bedrooms', bedrooms.toString());
    if (bathrooms) params = params.set('bathrooms', bathrooms.toString());
    if (minPrice != null && minPrice > 0) params = params.set('minPrice', minPrice.toString());
    if (maxPrice != null && maxPrice > 0) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      tap(data => this.cache.set(cacheKey, { data, expiry: Date.now() + this.CACHE_TTL }))
    );
  }

  getPropertyById(id: number): Observable<any> {
    const cacheKey = `property-detail-${id}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(data => this.cache.set(cacheKey, { data, expiry: Date.now() + this.CACHE_TTL }))
    );
  }

  createProperty(propertyData: any): Observable<any> {
    this.clearCache();
    return this.http.post<any>(this.apiUrl, propertyData);
  }

  updateProperty(id: number, propertyData: any): Observable<any> {
    this.clearCache();
    return this.http.put<any>(`${this.apiUrl}/${id}`, propertyData);
  }

  getArchivedProperties(page: number = 0, size: number = 100): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/archived`, { params });
  }

  archiveProperty(id: number): Observable<any> {
    this.clearCache();
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  unarchiveProperty(id: number): Observable<any> {
    this.clearCache();
    return this.http.put(`${this.apiUrl}/${id}/unarchive`, {});
  }

  deletePropertyPermanently(id: number): Observable<any> {
    this.clearCache();
    return this.http.delete(`${this.apiUrl}/${id}/permanent`);
  }

  // --- MÉTODOS EXCLUSIVOS DE IMÁGENES ---
  uploadImage(propertyId: number, file: File): Observable<any> {
    this.clearCache();
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.imagesUrl}/upload/${propertyId}`, formData);
  }

  uploadMultipleImages(propertyId: number, files: File[]): Observable<any> {
    this.clearCache();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.imagesUrl}/upload-multiple/${propertyId}`, formData);
  }

  setCoverImage(propertyId: number, imageId: number): Observable<any> {
    this.clearCache();
    return this.http.patch(`${this.imagesUrl}/${imageId}/set-cover/${propertyId}`, {});
  }

  deleteImage(imageId: number): Observable<any> {
    this.clearCache();
    return this.http.delete(`${this.imagesUrl}/${imageId}`);
  }

  getImagesByPropertyId(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.imagesUrl}/property/${propertyId}`);
  }
}
