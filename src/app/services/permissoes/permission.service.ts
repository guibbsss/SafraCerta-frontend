import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { P } from '../../constants/permissoes';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private auth: AuthService) {}

  has(id: number): boolean {
    const ids = this.auth.getCurrentUser()?.permissaoIds;
    return Array.isArray(ids) && ids.includes(id);
  }

  canCriar(): boolean {
    return this.has(P.CRIAR);
  }

  canEditar(): boolean {
    return this.has(P.EDITAR);
  }

  canExcluir(): boolean {
    return this.has(P.EXCLUIR);
  }

  /**
   * Rota filha (ex.: /fazendas, /estoque/entradas) — /home é sempre true.
   */
  canAccessPath(path: string): boolean {
    const p = path.split('?')[0].replace(/\/$/, '') || '/';
    if (p === '/home' || p === '' || p.endsWith('/home')) {
      return true;
    }
    if (p === '/dashboard' || p.endsWith('/dashboard')) {
      return this.has(P.VER_DASHBOARD);
    }
    if (p.startsWith('/fazendas')) {
      return this.has(P.VER_FAZENDA);
    }
    if (p.startsWith('/talhoes')) {
      return this.has(P.VER_TALHAO);
    }
    if (p.startsWith('/safras')) {
      return this.has(P.VER_SAFRA);
    }
    if (p.startsWith('/atividades')) {
      return this.has(P.VER_ATIVIDADES);
    }
    if (p.startsWith('/estoque')) {
      return this.has(P.VER_ESTOQUE);
    }
    if (p.startsWith('/financeiro')) {
      return this.has(P.VER_FINANCEIRO);
    }
    if (p.startsWith('/administracao')) {
      return this.has(P.VER_ADMINISTRACAO);
    }
    return true;
  }
}
