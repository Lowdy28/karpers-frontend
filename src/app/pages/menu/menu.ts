import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { OrderService } from '../../services/order';
import { Product } from '../../models/product.model';
import { OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  products = signal<Product[]>([]);
  cart = signal<OrderItem[]>([]);
  tableNumber = 4; // por ahora fijo, luego viene del QR (?mesa=4)

  cartTotal = computed(() => {
    return this.cart().reduce((total, item) => {
      const product = this.products().find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  });

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((data) => {
      this.products.set(data);
    });
  }

  addToCart(product: Product): void {
    const existing = this.cart().find((item) => item.productId === product.id);

    if (existing) {
      this.cart.update((items) =>
        items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cart.update((items) => [
        ...items,
        { productId: product.id, quantity: 1 },
      ]);
    }
  }

  submitOrder(): void {
    const order = {
      tableNumber: this.tableNumber,
      items: this.cart(),
    };

    this.orderService.create(order).subscribe(() => {
      alert('¡Pedido enviado!');
      this.cart.set([]);
    });
  }
}
