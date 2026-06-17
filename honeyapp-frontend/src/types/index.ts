export type HoneyType = 'THYME' | 'PINE' | 'ORANGE' | 'HEATHER' | 'MULTIFLORAL' | 'OTHER';

export interface AuthResponse {
  token: string;
  role: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface Producer {
  uuid: string;
  businessName: string;
  ownerFirstname: string;
  ownerLastname: string;
  vat: string;
  region: string;
  description: string;
  address: string;
  phone: string;
  organicCertNumber: string;
}

export interface Product {
  uuid: string;
  name: string;
  honeyType: HoneyType;
  description: string;
  price: number;
  quantityKg: number;
  harvestYear: number;
  producerUuid: string;
  producerBusinessName: string;
  region: string;
}

export interface Consumer {
  uuid: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string>;
}
