import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  sidebarOpen = true;
  currentUser$;

  menuItems = [
    { path: '/home', icon: '🏠', label: 'Início' },
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/fazendas', icon: '🏞️', label: 'Fazendas' },
    { path: '/talhoes', icon: '📐', label: 'Talhões' },
    { path: '/safras', icon: '🌾', label: 'Safras' },
    { path: '/atividades', icon: '📝', label: 'Atividades' },
    { path: '/estoque', icon: '📦', label: 'Estoque' },
    { path: '/financeiro', icon: '💰', label: 'Financeiro' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
