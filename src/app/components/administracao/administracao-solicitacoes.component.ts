import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoEntradaService } from '../../services/administracao/solicitacao-entrada.service';
import { PerfilAdminService } from '../../services/administracao/perfil-admin.service';
import { AuthService } from '../../services/auth/auth.service';
import { SolicitacaoEntradaLinha } from '../../models/solicitacao-entrada.model';
import { PerfilResposta } from '../../models/perfil-admin.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-administracao-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './administracao-solicitacoes.component.html'
})
export class AdministracaoSolicitacoesComponent implements OnInit {
  linhas: SolicitacaoEntradaLinha[] = [];
  perfisParaAprovacao: PerfilResposta[] = [];
  loading = true;
  errorMessage = '';

  showModal = false;
  linhaSelecionada: SolicitacaoEntradaLinha | null = null;
  perfilEscolhidoId: number | null = null;
  salvando = false;
  erroModal = '';

  private readonly registroPerfilId = environment.registroPerfilId;

  constructor(
    private solicitacaoService: SolicitacaoEntradaService,
    private perfilAdmin: PerfilAdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarPerfisOpcoes();
    this.carregarLista();
  }

  carregarPerfisOpcoes(): void {
    this.perfilAdmin.listarPerfis().subscribe({
      next: (lista) => {
        this.perfisParaAprovacao = lista.filter(
          (p) =>
            !p.excluido &&
            p.ativo &&
            p.id !== this.registroPerfilId
        );
      },
      error: () => {
        this.perfisParaAprovacao = [];
      }
    });
  }

  carregarLista(): void {
    const proprietarioId = this.authService.getCurrentUserId();
    if (proprietarioId == null) {
      this.loading = false;
      this.errorMessage = 'Sessão sem identificação do utilizador.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.solicitacaoService.listar(proprietarioId).subscribe({
      next: (data) => {
        this.linhas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar as solicitações.';
      }
    });
  }

  abrirAprovar(linha: SolicitacaoEntradaLinha): void {
    if (linha.status !== 'SOLICITADO') {
      return;
    }
    this.linhaSelecionada = linha;
    this.perfilEscolhidoId =
      this.perfisParaAprovacao.length > 0 ? this.perfisParaAprovacao[0].id : null;
    this.erroModal = '';
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.linhaSelecionada = null;
    this.perfilEscolhidoId = null;
    this.erroModal = '';
  }

  confirmarAprovacao(): void {
    const proprietarioId = this.authService.getCurrentUserId();
    const linha = this.linhaSelecionada;
    const perfilId = this.perfilEscolhidoId;
    if (!proprietarioId || !linha || perfilId == null) {
      this.erroModal = 'Selecione um perfil.';
      return;
    }
    this.salvando = true;
    this.erroModal = '';
    this.solicitacaoService
      .aprovar({
        proprietarioUsuarioId: proprietarioId,
        usuarioId: linha.usuarioId,
        fazendaId: linha.fazendaId,
        perfilId
      })
      .subscribe({
        next: () => {
          this.salvando = false;
          this.fecharModal();
          this.carregarLista();
        },
        error: (err) => {
          this.salvando = false;
          const body = err.error as { message?: string; detail?: string } | string | undefined;
          this.erroModal =
            (typeof body === 'object' && body && (body.detail || body.message)) ||
            (typeof body === 'string' ? body : null) ||
            'Não foi possível aprovar.';
        }
      });
  }

  badgeClass(status: string): string {
    return status === 'APROVADO'
      ? 'bg-green-100 text-green-800'
      : 'bg-amber-100 text-amber-900';
  }
}
