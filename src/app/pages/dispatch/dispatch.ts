import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { Realtime } from '../../services/realtime';

interface OrderItem {
  id: number;
  productId: number;
  product: { name: string } | null;
  quantity: number;
  selectedVariant: string | null;
  notes: string | null;
}

interface Order {
  id: number;
  tableNumber: number;
  status: number;
  createdAt: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-dispatch',
  imports: [CommonModule],
  templateUrl: './dispatch.html',
  styleUrl: './dispatch.css',
})
export class Dispatch implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = 'http://localhost:5098/api/orders';
  private realtime = inject(Realtime);

  orders = signal<Order[]>([]);
  statusLabels = ['Recibido', 'Preparando', 'Listo', 'Entregado'];

  ngOnInit(): void {
    this.loadOrders();

    this.realtime.onOrderCreated(() => this.loadOrders());
    this.realtime.onOrderStatusChanged(() => this.loadOrders());
  }

  loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).subscribe((data) => {
      this.orders.set(data);
    });
  }

  advanceStatus(order: Order): void {
    if (order.status >= 3) return;

    const newStatus = order.status + 1;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
    });

    this.http
      .patch(`${this.apiUrl}/${order.id}/status`, newStatus, { headers })
      .subscribe(() => this.loadOrders());
  }
}
