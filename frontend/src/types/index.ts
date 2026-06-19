export type User = {
  id: number;
  full_name: string;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
  user: User;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  quantity_in_stock: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  price: number;
  quantity_in_stock: number;
  low_stock_threshold: number;
};

export type Customer = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type CustomerInput = {
  full_name: string;
  email: string;
  phone: string;
};

export type OrderItemInput = {
  product_id: number;
  quantity: number;
};

export type OrderInput = {
  customer_id: number;
  items: OrderItemInput[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  line_total: string;
  product: Product;
};

export type Order = {
  id: number;
  customer_id: number;
  total_amount: string;
  status: 'CREATED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  customer: Customer;
  items: OrderItem[];
};

export type DashboardSummary = {
  total_products: number;
  total_customers: number;
  total_orders: number;
  low_stock_products: number;
  recent_orders: number;
  low_stock_items: Product[];
};
