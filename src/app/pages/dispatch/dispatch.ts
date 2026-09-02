import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { Realtime } from '../../services/realtime';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  private apiUrl = 'http://localhost:5098/api/orders';
  private realtime = inject(Realtime);

  orders = signal<Order[]>([]);
  newOrderAlert = signal<boolean>(false);
  private audio = new Audio('/sounds/new-order.mp3');
  statusLabels = ['Recibido', 'Preparando', 'Listo', 'Entregado'];

  ngOnInit(): void {
    this.loadOrders();

    this.realtime.onOrderCreated(() => {
      this.loadOrders();
      this.playAlert();
    });
    this.realtime.onOrderStatusChanged(() => this.loadOrders());
  }

  private playAlert(): void {
    this.audio
      .play()
      .catch((err) => console.warn('No se pudo reproducir el sonido:', err));

    this.newOrderAlert.set(true);
    setTimeout(() => this.newOrderAlert.set(false), 3000);
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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
