import { Routes } from '@angular/router';
import { Menu } from './pages/menu/menu';
import { Login } from './pages/login/login';
import { Dispatch } from './pages/dispatch/dispatch';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Menu },
  { path: 'login', component: Login },
  { path: 'despacho', component: Dispatch, canActivate: [authGuard] },
];
