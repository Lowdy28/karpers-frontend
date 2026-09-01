import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5098/api/orders';

  constructor(private http: HttpClient) {}

  create(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }
}
