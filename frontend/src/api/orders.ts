import { api } from './http';
import type { Order, OrderInput } from '../types';

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders');
  return data;
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}

export async function createOrder(payload: OrderInput): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
}

export async function cancelOrder(id: number): Promise<Order> {
  const { data } = await api.delete<Order>(`/orders/${id}`);
  return data;
}
