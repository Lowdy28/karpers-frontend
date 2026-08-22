import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  variants: string[];
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  products: Product[] = [
    { id: 1, name: 'Alitas de sabor', price: 65, variants: ['Mango habanero', 'BBQ', 'Tamarindo chipotle'] },
    { id: 2, name: 'Hamburguesa arrachera', price: 85, variants: [] },
    { id: 3, name: 'Sopes', price: 30, variants: ['Pollo verde', 'Tinga', 'Suadero'] },
  ];
}
