import { api } from './http';
import type { Customer, CustomerInput } from '../types';

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>('/customers');
  return data;
}

export async function createCustomer(payload: CustomerInput): Promise<Customer> {
  const { data } = await api.post<Customer>('/customers', payload);
  return data;
}

export async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/customers/${id}`);
}
