import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse, PropertyDetail, PropertyList } from '../models/property.model';
import { OperationType, PropertyType } from '../models/property.enums';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) { }

  getProperties(page: number = 0, size: number = 12): Observable<PageResponse<PropertyList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<PropertyList>>(this.apiUrl, { params });
  }

  getPropertyById(id: number): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}/${id}`);
  }

  searchProperties(operationType?: OperationType, propertyType?: PropertyType, page: number = 0, size: number = 12): Observable<PageResponse<PropertyList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (operationType) params = params.set('operationType', operationType);
    if (propertyType) params = params.set('propertyType', propertyType);

    return this.http.get<PageResponse<PropertyList>>(`${this.apiUrl}/search`, { params });
  }

  // ---> NUEVO MÉTODO PARA GUARDAR <---
  createProperty(propertyData: any): Observable<any> {
    return this.http.post(this.apiUrl, propertyData);
  }
}
