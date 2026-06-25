import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8080/api/properties';
  private imagesUrl = 'http://localhost:8080/api/images'; // Tu controlador de imágenes

  constructor(private http: HttpClient) {}

  getProperties(page: number = 0, size: number = 100): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  searchProperties(
    operationType?: string,
    propertyType?: string,
    zone?: string,
    bedrooms?: string,
    bathrooms?: string,
    page: number = 0,
    size: number = 12
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (operationType) params = params.set('operationType', operationType);
    if (propertyType) params = params.set('propertyType', propertyType);
    if (zone) params = params.set('zone', zone);
    if (bedrooms) params = params.set('bedrooms', bedrooms);
    if (bathrooms) params = params.set('bathrooms', bathrooms);

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, propertyData);
  }

  updateProperty(id: number, propertyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, propertyData);
  }

  getArchivedProperties(page: number = 0, size: number = 100): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/archived`, { params });
  }

  archiveProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  unarchiveProperty(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/unarchive`, {});
  }

  deletePropertyPermanently(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/permanent`);
  }

  // --- MÉTODOS EXCLUSIVOS DE IMÁGENES ---
  uploadImage(propertyId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.imagesUrl}/upload/${propertyId}`, formData);
  }

  setCoverImage(propertyId: number, imageId: number): Observable<any> {
    return this.http.patch(`${this.imagesUrl}/${imageId}/set-cover/${propertyId}`, {});
  }

  deleteImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.imagesUrl}/${imageId}`);
  }

  // ¡ACÁ ESTÁ LA CLAVE PARA QUE APAREZCAN LAS FOTOS EN EL PANEL!
  getImagesByPropertyId(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.imagesUrl}/property/${propertyId}`);
  }
}
