import { api } from './http';
import type { Product, ProductInput } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(id: number, payload: ProductInput): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
