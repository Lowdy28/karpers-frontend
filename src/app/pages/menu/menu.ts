import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  products = signal<Product[]>([]);
  activeCategory = signal<string>('Todas');
  cart = signal<OrderItem[]>([]);
  cartPanelOpen = signal<boolean>(false);
  orderConfirmed = signal<boolean>(false);
  tableNumber = signal<number>(0);
  selectedVariants: Record<number, string> = {};
  notesByProduct: Record<number, string> = {};

  categoryNames = computed(() => {
    const names = new Set(this.products().map((p) => p.category?.name ?? 'Otros'));
    return ['Todas', ...names];
  });

  filteredProducts = computed(() => {
    if (this.activeCategory() === 'Todas') return this.products();
    return this.products().filter(
      (p) => (p.category?.name ?? 'Otros') === this.activeCategory()
    );
  });

  cartTotal = computed(() => {
    return this.cart().reduce((total, item) => {
      const product = this.products().find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  });

  cartWithDetails = computed(() => {
    return this.cart().map((item) => {
      const product = this.products().find((p) => p.id === item.productId);
      return {
        ...item,
        name: product?.name ?? '',
        price: product?.price ?? 0,
        subtotal: (product?.price ?? 0) * item.quantity,
      };
    });
  });

  ngOnInit(): void {
    const mesa = this.route.snapshot.queryParamMap.get('mesa');
    this.tableNumber.set(mesa ? Number(mesa) : 0);

    this.productService.getAll().subscribe((data) => {
      this.products.set(data);
    });
  }

  getProductIcon(product: Product): string {
    return '🔥';
  }

  selectVariant(productId: number, variant: string): void {
    this.selectedVariants[productId] = variant;
  }

  updateNotes(productId: number, notes: string): void {
    this.notesByProduct[productId] = notes;
  }

  addToCart(product: Product): void {
    const variant = this.selectedVariants[product.id];
    const notes = this.notesByProduct[product.id];
    const existing = this.cart().find(
      (item) =>
        item.productId === product.id &&
        item.selectedVariant === variant &&
        item.notes === notes
    );

    if (existing) {
      this.cart.update((items) =>
        items.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      this.cart.update((items) => [
        ...items,
        { productId: product.id, quantity: 1, selectedVariant: variant, notes },
      ]);
    }
  }

  increaseQty(item: OrderItem): void {
    this.cart.update((items) =>
      items.map((i) => this.isSameLine(i, item) ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  decreaseQty(item: OrderItem): void {
    if (item.quantity <= 1) {
      this.removeFromCart(item);
      return;
    }
    this.cart.update((items) =>
      items.map((i) => this.isSameLine(i, item) ? { ...i, quantity: i.quantity - 1 } : i)
    );
  }

  removeFromCart(item: OrderItem): void {
    this.cart.update((items) => items.filter((i) => !this.isSameLine(i, item)));
  }

  private isSameLine(a: OrderItem, b: OrderItem): boolean {
    return a.productId === b.productId && a.selectedVariant === b.selectedVariant && a.notes === b.notes;
  }

  submitOrder(): void {
    const order = {
      tableNumber: this.tableNumber(),
      items: this.cart(),
    };

    this.orderService.create(order).subscribe(() => {
      this.cart.set([]);
      this.cartPanelOpen.set(false);
      this.orderConfirmed.set(true);
      setTimeout(() => this.orderConfirmed.set(false), 3000);
    });
  }
}
