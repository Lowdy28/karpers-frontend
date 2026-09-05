export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  category?: { id: number; name: string } | null;
  variants: string[];
  available: boolean;
}
