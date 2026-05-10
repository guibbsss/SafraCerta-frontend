import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { PermissionService } from '../../../services/permissoes/permission.service';
import { P } from '../../../constants/permissoes';

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

  /** Sem `permissaoId`: sempre visível (Início). Com ID: só se o utilizador tiver a permissão. */
  menuItems: Array<{
    path: string;
    icon: string;
    label: string;
    linkActiveExact?: boolean;
    permissaoId?: number;
  }> = [
    { path: '/home', icon: '🏠', label: 'Início' },
    {
      path: '/dashboard',
      icon: '📊',
      label: 'Dashboard',
      permissaoId: P.VER_DASHBOARD
    },
    { path: '/fazendas', icon: '🏞️', label: 'Fazendas', permissaoId: P.VER_FAZENDA },
    { path: '/talhoes', icon: '📐', label: 'Talhões', permissaoId: P.VER_TALHAO },
    { path: '/safras', icon: '🌾', label: 'Safras', permissaoId: P.VER_SAFRA },
    {
      path: '/atividades',
      icon: '📝',
      label: 'Atividades',
      permissaoId: P.VER_ATIVIDADES
    },
    {
      path: '/estoque',
      icon: '📦',
      label: 'Estoque',
      linkActiveExact: false,
      permissaoId: P.VER_ESTOQUE
    },
    {
      path: '/financeiro',
      icon: '💰',
      label: 'Financeiro',
      permissaoId: P.VER_FINANCEIRO
    },
    {
      path: '/administracao',
      icon: '⚙️',
      label: 'Administração',
      linkActiveExact: false,
      permissaoId: P.VER_ADMINISTRACAO
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private permission: PermissionService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  get visibleMenuItems(): typeof this.menuItems {
    return this.menuItems.filter(
      (item) =>
        item.permissaoId == null || this.permission.has(item.permissaoId)
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
