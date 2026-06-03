import { OperationType, PropertyStatus, PropertyType } from './property.enums';
import { Characteristics, Image, Location } from './property.details.model';

export interface PropertyList {
  id: number;
  title: string;
  price: number;
  propertyType: PropertyType;
  operationType: OperationType;
  coverImageUrl: string;
  bedrooms: number;
  bathrooms: number;
  street: string;
}

export interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  status: PropertyStatus;
  propertyType: PropertyType;
  operationType: OperationType;
  location: Location;
  characteristics: Characteristics;
  images: Image[];
}

export interface PropertyRequest {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  operationType: OperationType;
  location: Location;
  characteristics: Characteristics;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
