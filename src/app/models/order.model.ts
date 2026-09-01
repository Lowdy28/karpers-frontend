export interface OrderItem {
  productId: number;
  quantity: number;
  selectedVariant?: string;
  notes?: string;
}

export interface Order {
  tableNumber: number;
  items: OrderItem[];
}
