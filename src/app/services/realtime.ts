import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class Realtime {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5098/hubs/orders')
      .withAutomaticReconnect()
      .build();

    this.connection.start().catch((err) => console.error('SignalR error:', err));
  }

  onOrderCreated(callback: (orderId: number) => void): void {
    this.connection.on('OrderCreated', callback);
  }

  onOrderStatusChanged(callback: (orderId: number, status: number) => void): void {
    this.connection.on('OrderStatusChanged', callback);
  }
}
