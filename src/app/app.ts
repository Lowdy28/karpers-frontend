import { Component } from '@angular/core';
import { Menu } from './pages/menu/menu';

@Component({
  selector: 'app-root',
  imports: [Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
