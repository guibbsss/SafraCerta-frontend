import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfilAdminService } from '../../services/administracao/perfil-admin.service';
import { PerfilPermissaoResumo } from '../../models/perfil-admin.model';

@Component({
  selector: 'app-administracao-perfis',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './administracao-perfis.component.html'
})
export class AdministracaoPerfisComponent implements OnInit {
  resumo: PerfilPermissaoResumo[] = [];
  expandedPerfilId: number | null = null;
  loading = true;
  errorMessage = '';
  showForm = false;
  novoPerfilNome = '';
  saving = false;
  saveError = '';

  constructor(private perfilAdmin: PerfilAdminService) {}

  ngOnInit(): void {
    this.loadResumo();
  }

  loadResumo(): void {
    this.loading = true;
    this.errorMessage = '';
    this.perfilAdmin.getResumoComPermissoes().subscribe({
      next: (data) => {
        this.resumo = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar os perfis.';
      }
    });
  }

  togglePerfil(perfilId: number): void {
    this.expandedPerfilId = this.expandedPerfilId === perfilId ? null : perfilId;
  }

  isExpanded(perfilId: number): boolean {
    return this.expandedPerfilId === perfilId;
  }

  openNovo(): void {
    this.showForm = true;
    this.novoPerfilNome = '';
    this.saveError = '';
  }

  cancelarNovo(): void {
    this.showForm = false;
    this.novoPerfilNome = '';
    this.saveError = '';
  }

  salvarNovo(): void {
    const nome = this.novoPerfilNome.trim();
    if (!nome) {
      this.saveError = 'Indique o nome do perfil.';
      return;
    }
    this.saving = true;
    this.saveError = '';
    this.perfilAdmin.criarPerfil(nome).subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.novoPerfilNome = '';
        this.loadResumo();
      },
      error: () => {
        this.saving = false;
        this.saveError = 'Não foi possível criar o perfil.';
      }
    });
  }
}
