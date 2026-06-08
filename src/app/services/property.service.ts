import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse, PropertyDetail, PropertyList } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) { }

  // Trae las propiedades paginadas (Ideal para la Home)
  getProperties(page: number = 0, size: number = 12): Observable<PageResponse<PropertyList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<PropertyList>>(this.apiUrl, { params });
  }

  // Trae una sola propiedad por ID para la pantalla de detalle
  getPropertyById(id: number): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}/${id}`);
  }
}
