import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { FazendaService } from '../../services/fazenda/fazenda.service';
import { AuthService } from '../../services/auth/auth.service';
import { SafraService } from '../../services/safra/safra.service';
import { FinanceiroService } from '../../services/financeiro/financeiro.service';
import { InsumoService } from '../../services/insumo/insumo.service';
import { TalhaoService } from '../../services/talhao/talhao.service';
import { AtividadeService } from '../../services/atividade/atividade.service';
import { FinanceiroResumo } from '../../models/financeiro.model';
import { Atividade } from '../../models/atividade.model';
import { Safra } from '../../models/safra.model';
import { Insumo } from '../../models/insumo.model';
import { Fazenda } from '../../models/fazenda.model';
import { TalhaoModel } from '../../models/talhao.model';

function isSafraEmAndamento(s: Safra): boolean {
  return s.status !== 'FINALIZADA';
}

/** Linhas da lista “Últimas atividades” (tipagem explícita para o template). */
interface UltimaAtividadeLinha {
  tipoOperacao: string;
  dataAtividade: string;
  talhaoNome?: string | null;
}

const RESUMO_ZERADO: FinanceiroResumo = {
  totalReceitas: 0,
  totalDespesas: 0,
  saldo: 0,
  quantidadeReceitas: 0,
  quantidadeDespesas: 0,
  quantidadePendentes: 0,
  quantidadeAtrasadas: 0
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  loadError = false;

  stats = {
    totalFazendas: 0,
    totalTalhoes: 0,
    totalSafras: 0,
    safrasAtivas: 0,
    totalAtividades: 0,
    itensEstoque: 0,
    totalEstoque: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    qtdLancamentosReceitas: 0,
    qtdLancamentosDespesas: 0,
    qtdPendentes: 0,
    qtdAtrasadas: 0
  };

  ultimasAtividades: UltimaAtividadeLinha[] = [];

  constructor(
    private fazendaService: FazendaService,
    private authService: AuthService,
    private safraService: SafraService,
    private financeiroService: FinanceiroService,
    private insumoService: InsumoService,
    private talhaoService: TalhaoService,
    private atividadeService: AtividadeService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.loadError = false;

    const usuarioId = this.authService.getCurrentUserId() ?? 1;

    forkJoin({
      fazendas: this.fazendaService
        .getAllByUsuario(usuarioId)
        .pipe(catchError(() => of([] as Fazenda[]))),
      safras: this.safraService.getAll().pipe(catchError(() => of([] as Safra[]))),
      insumos: this.insumoService.getAll().pipe(catchError(() => of([] as Insumo[]))),
      resumo: this.financeiroService.getResumo().pipe(catchError(() => of(RESUMO_ZERADO))),
      talhoes: this.talhaoService.getAll().pipe(catchError(() => of([] as TalhaoModel[]))),
      atividades: this.atividadeService.getAll().pipe(catchError(() => of([] as Atividade[])))
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ fazendas, safras, insumos, resumo, talhoes, atividades }) => {
          this.stats.totalFazendas = fazendas.length;
          this.stats.totalTalhoes = talhoes.length;
          this.stats.totalSafras = safras.length;
          this.stats.safrasAtivas = safras.filter(isSafraEmAndamento).length;
          this.stats.totalAtividades = atividades.length;
          this.stats.itensEstoque = insumos.length;
          this.stats.totalEstoque = insumos.reduce(
            (sum, item) => sum + (item.valorTotalEstimado ?? 0),
            0
          );

          this.stats.totalReceitas = resumo.totalReceitas;
          this.stats.totalDespesas = resumo.totalDespesas;
          this.stats.saldo = resumo.saldo;
          this.stats.qtdLancamentosReceitas = resumo.quantidadeReceitas;
          this.stats.qtdLancamentosDespesas = resumo.quantidadeDespesas;
          this.stats.qtdPendentes = resumo.quantidadePendentes;
          this.stats.qtdAtrasadas = resumo.quantidadeAtrasadas;

          this.ultimasAtividades = this.pickUltimasAtividades(atividades);
        },
        error: () => {
          this.loadError = true;
          this.resetStats();
        }
      });
  }

  /** Denominador comum para barras comparativas (evita divisão por zero). */
  financeiroDenominador(): number {
    return Math.max(this.stats.totalReceitas, this.stats.totalDespesas, 1);
  }

  receitasBarPct(): number {
    const d = this.financeiroDenominador();
    return d > 0 ? (this.stats.totalReceitas / d) * 100 : 0;
  }

  despesasBarPct(): number {
    const d = this.financeiroDenominador();
    return d > 0 ? (this.stats.totalDespesas / d) * 100 : 0;
  }

  private pickUltimasAtividades(list: Atividade[]): UltimaAtividadeLinha[] {
    return [...list]
      .sort((a, b) => (b.dataAtividade ?? '').localeCompare(a.dataAtividade ?? ''))
      .slice(0, 5)
      .map((a) => ({
        tipoOperacao: a.tipoOperacao,
        dataAtividade: a.dataAtividade,
        talhaoNome: a.talhaoNome
      }));
  }

  private resetStats(): void {
    this.stats = {
      totalFazendas: 0,
      totalTalhoes: 0,
      totalSafras: 0,
      safrasAtivas: 0,
      totalAtividades: 0,
      itensEstoque: 0,
      totalEstoque: 0,
      totalReceitas: 0,
      totalDespesas: 0,
      saldo: 0,
      qtdLancamentosReceitas: 0,
      qtdLancamentosDespesas: 0,
      qtdPendentes: 0,
      qtdAtrasadas: 0
    };
    this.ultimasAtividades = [];
  }
}
