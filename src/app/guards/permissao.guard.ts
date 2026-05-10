import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permissoes/permission.service';

/** Usar com `data: { permissaoId: number }`. Sem `permissaoId`, permite (útil só como segundo guard depois do auth). */
export const permissaoGuard: CanActivateFn = (route) => {
  const permission = inject(PermissionService);
  const router = inject(Router);
  const pid = route.data['permissaoId'] as number | undefined;
  if (pid == null) {
    return true;
  }
  if (permission.has(pid)) {
    return true;
  }
  return router.createUrlTree(['/home']);
};
