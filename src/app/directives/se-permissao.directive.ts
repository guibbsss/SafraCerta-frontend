import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { PermissionService } from '../services/permissoes/permission.service';

/**
 * Mostra o conteúdo só se o utilizador tiver a permissão (ID da tabela `permissao`).
 * Ex.: `*appSePermissao="24"` (Criar).
 */
@Directive({
  standalone: true,
  selector: '[appSePermissao]'
})
export class SePermissaoDirective implements OnInit, OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly permission = inject(PermissionService);
  private readonly auth = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  @Input({ required: true }) appSePermissao!: number;

  ngOnInit(): void {
    this.apply();
    this.auth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(() => this.apply());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private apply(): void {
    this.vcr.clear();
    if (this.permission.has(this.appSePermissao)) {
      this.vcr.createEmbeddedView(this.templateRef);
    }
  }
}
