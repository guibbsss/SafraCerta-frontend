import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfilAdminService } from '../../services/administracao/perfil-admin.service';
import { MatrizCategoria, PerfilResposta } from '../../models/perfil-admin.model';
import { SePermissaoDirective } from '../../directives/se-permissao.directive';
import { P } from '../../constants/permissoes';

@Component({
  selector: 'app-administracao-permissoes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SePermissaoDirective],
  templateUrl: './administracao-permissoes.component.html'
})
export class AdministracaoPermissoesComponent implements OnInit {
  readonly P = P;
  perfis: PerfilResposta[] = [];
  expandedPerfilId: number | null = null;
  matrizPorPerfil = new Map<number, MatrizCategoria[]>();
  loadingPerfis = true;
  loadingMatrizId: number | null = null;
  errorMessage = '';

  constructor(private perfilAdmin: PerfilAdminService) {}

  ngOnInit(): void {
    this.loadPerfis();
  }

  loadPerfis(): void {
    this.loadingPerfis = true;
    this.errorMessage = '';
    this.perfilAdmin.listarPerfis().subscribe({
      next: (data) => {
        this.perfis = data;
        this.loadingPerfis = false;
      },
      error: () => {
        this.loadingPerfis = false;
        this.errorMessage = 'Não foi possível carregar os perfis.';
      }
    });
  }

  togglePerfil(perfilId: number): void {
    if (this.expandedPerfilId === perfilId) {
      this.expandedPerfilId = null;
      return;
    }
    this.expandedPerfilId = perfilId;
    if (!this.matrizPorPerfil.has(perfilId)) {
      this.carregarMatriz(perfilId);
    }
  }

  carregarMatriz(perfilId: number): void {
    this.loadingMatrizId = perfilId;
    this.perfilAdmin.getMatrizPermissoes(perfilId).subscribe({
      next: (data) => {
        this.matrizPorPerfil.set(perfilId, data);
        this.loadingMatrizId = null;
      },
      error: () => {
        this.loadingMatrizId = null;
        this.matrizPorPerfil.set(perfilId, []);
      }
    });
  }

  onToggleChange(perfilId: number, permissaoId: number, checked: boolean): void {
    this.perfilAdmin.definirPermissao(perfilId, permissaoId, checked).subscribe({
      next: () => this.carregarMatriz(perfilId),
      error: () => {
        this.carregarMatriz(perfilId);
      }
    });
  }

  isExpanded(perfilId: number): boolean {
    return this.expandedPerfilId === perfilId;
  }

  matriz(perfilId: number): MatrizCategoria[] {
    return this.matrizPorPerfil.get(perfilId) ?? [];
  }
}
