direimport { api } from './client';
import type { AuthResponse, Consumer, HoneyType, Page, Producer, Product, Region } from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/authenticate', { username, password }).then((r) => r.data),
};

export const regionApi = {
  getAll: () => api.get<Region[]>('/regions').then((r) => r.data),
};

export const producerApi = {
  getAll: (params?: { page?: number; size?: number; businessName?: string; region?: string }) =>
    api.get<Page<Producer>>('/producers', { params }).then((r) => r.data),
  getByUuid: (uuid: string) => api.get<Producer>(`/producers/${uuid}`).then((r) => r.data),
  getMe: () => api.get<Producer>('/producers/me').then((r) => r.data),
  register: (data: unknown) => api.post<Producer>('/producers', data).then((r) => r.data),
  update: (uuid: string, data: unknown) =>
    api.put<Producer>(`/producers/${uuid}`, data).then((r) => r.data),
  uploadCertification: (uuid: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/producers/${uuid}/certification-file`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const consumerApi = {
  register: (data: unknown) => api.post<Consumer>('/consumers', data).then((r) => r.data),
  getByUuid: (uuid: string) => api.get<Consumer>(`/consumers/${uuid}`).then((r) => r.data),
};

export const productApi = {
  getAll: (params?: {
    page?: number;
    size?: number;
    honeyType?: HoneyType;
    name?: string;
    region?: string;
    producerUuid?: string;
  }) => api.get<Page<Product>>('/products', { params }).then((r) => r.data),
  getByUuid: (uuid: string) => api.get<Product>(`/products/${uuid}`).then((r) => r.data),
  create: (data: unknown) => api.post<Product>('/products', data).then((r) => r.data),
  update: (uuid: string, data: unknown) =>
    api.put<Product>(`/products/${uuid}`, data).then((r) => r.data),
  delete: (uuid: string) => api.delete<Product>(`/products/${uuid}`).then((r) => r.data),
};

export const HONEY_TYPES: HoneyType[] = [
  'THYME',
  'PINE',
  'ORANGE',
  'HEATHER',
  'MULTIFLORAL',
  'OTHER',
];
