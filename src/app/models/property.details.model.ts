export interface Location {
  street: string;
  streetNumber: string;
  floor?: string;
  apartment?: string;
}

export interface Characteristics {
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  coveredArea: number;
  hasGarage: boolean;
  age: number;
  latitude?: number;
  longitude?: number;
}

export interface Image {
  id: number;
  url: string;
  isCover: boolean;
}
