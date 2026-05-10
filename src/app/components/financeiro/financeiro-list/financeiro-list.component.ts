import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FinanceiroService } from '../../../services/financeiro/financeiro.service';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { SafraService } from '../../../services/safra/safra.service';
import { AuthService } from '../../../services/auth/auth.service';
import {
  TransacaoFinanceira,
  FinanceiroFiltro,
  FinanceiroResumo,
  StatusTransacaoFinanceira,
  TipoTransacaoFinanceira
} from '../../../models/financeiro.model';
import { Fazenda } from '../../../models/fazenda.model';
import { Safra } from '../../../models/safra.model';
import { SePermissaoDirective } from '../../../directives/se-permissao.directive';
import { P } from '../../../constants/permissoes';

@Component({
  selector: 'app-financeiro-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SePermissaoDirective],
  templateUrl: './financeiro-list.component.html',
  styleUrls: ['./financeiro-list.component.css']
})
export class FinanceiroListComponent implements OnInit {
  readonly P = P;
  financeiros: TransacaoFinanceira[] = [];
  fazendas: Fazenda[] = [];
  safras: Safra[] = [];

  resumo: FinanceiroResumo = this.zeroResumo();

  showForm = false;
  editMode = false;
  selectedFinanceiro: TransacaoFinanceira = this.getEmptyFinanceiro();

  showDeleteModal = false;
  registroParaExcluir: TransacaoFinanceira | null = null;
  justificativaExclusao = '';
  excluindo = false;

  carregando = false;
  salvando = false;
  erro = '';

  filtroFazendaId: number | null = null;
  filtroTipo: TipoTransacaoFinanceira | null = null;
  filtroStatus: StatusTransacaoFinanceira | null = null;
  filtroDataInicio = '';
  filtroDataFim = '';

  readonly DESCRICAO_MIN = 3;
  readonly DESCRICAO_MAX = 500;
  readonly CATEGORIA_MAX = 120;
  readonly ORIGEM_MAX = 200;
  readonly FORMA_PAGAMENTO_MAX = 40;
  readonly OBSERVACOES_MAX = 1000;
  readonly VALOR_MIN = 0.01;
  readonly VALOR_MAX = 999_999_999.99;
  readonly JUSTIFICATIVA_MIN = 5;
  readonly JUSTIFICATIVA_MAX = 500;

  readonly tiposPagamentoSugeridos = [
    'PIX',
    'BOLETO',
    'CARTAO_CREDITO',
    'CARTAO_DEBITO',
    'DINHEIRO',
    'TRANSFERENCIA',
    'CHEQUE',
    'OUTRO'
  ];

  readonly categoriasSugeridas = [
    'Venda de Produção',
    'Arrendamento',
    'Insumos',
    'Combustível',
    'Manutenção',
    'Folha de Pagamento',
    'Serviços',
    'Impostos',
    'Outros'
  ];

  // Caracteres permitidos: letras (com acento), dígitos, espaço e pontuação básica
  private readonly DESCRICAO_REGEX = /[^A-Za-zÀ-ÿ0-9\s\/\-\._,;:()&%#\!\?]/g;
  private readonly CATEGORIA_REGEX = /[^A-Za-zÀ-ÿ0-9\s\/\-]/g;
  private readonly TEXTO_LIVRE_REGEX = /[^A-Za-zÀ-ÿ0-9\s\/\-\._,;:()&%#\!\?]/g;

  constructor(
    private financeiroService: FinanceiroService,
    private fazendaService: FazendaService,
    private safraService: SafraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFazendas();
    this.loadSafras();
    this.aplicarFiltros();
  }

  // ---------- Carregamento ----------

  loadFazendas(): void {
    const usuarioId = this.authService.getCurrentUserId() ?? 1;
    this.fazendaService.getAllByUsuario(usuarioId).subscribe({
      next: (data) => (this.fazendas = data ?? []),
      error: (err) => {
        console.error('Erro ao carregar fazendas:', err);
        this.fazendas = [];
      }
    });
  }

  loadSafras(): void {
    this.safraService.getAll().subscribe({
      next: (data) => (this.safras = data ?? []),
      error: (err) => {
        console.error('Erro ao carregar safras:', err);
        this.safras = [];
      }
    });
  }

  aplicarFiltros(): void {
    this.carregando = true;
    this.erro = '';
    const filtro = this.buildFiltro();

    // Lista e resumo em paralelo, mas o mesmo "tick" de conclusão evita o bug em que
    // getResumo falhava e o fallback usava financeiros ainda vazios.
    forkJoin({
      lista: this.financeiroService.list(filtro),
      resumo: this.financeiroService.getResumo(filtro).pipe(
        catchError((err) => {
          console.error('Erro ao carregar resumo financeiro:', err);
          return of<FinanceiroResumo | null>(null);
        })
      )
    }).subscribe({
      next: ({ lista, resumo }) => {
        this.financeiros = lista ?? [];
        this.resumo = resumo != null ? this.normalizarResumo(resumo) : this.calcularResumoLocal();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar transações financeiras:', err);
        this.erro = 'Não foi possível carregar os lançamentos.';
        this.financeiros = [];
        this.resumo = this.zeroResumo();
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtroFazendaId = null;
    this.filtroTipo = null;
    this.filtroStatus = null;
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.aplicarFiltros();
  }

  // ---------- Form ----------

  openForm(financeiro?: TransacaoFinanceira): void {
    if (financeiro) {
      this.editMode = true;
      this.selectedFinanceiro = {
        id: financeiro.id,
        fazendaId: financeiro.fazendaId ?? null,
        fazendaNome: financeiro.fazendaNome,
        safraId: financeiro.safraId ?? null,
        safraNome: financeiro.safraNome,
        tipo: financeiro.tipo,
        valor: financeiro.valor ?? null,
        descricao: financeiro.descricao ?? '',
        formaPagamento: financeiro.formaPagamento ?? '',
        status: financeiro.status,
        dataTransacao: financeiro.dataTransacao ?? '',
        dataVencimento: financeiro.dataVencimento ?? '',
        dataPagamento: financeiro.dataPagamento ?? '',
        categoria: financeiro.categoria ?? '',
        origem: financeiro.origem ?? '',
        observacoes: financeiro.observacoes ?? ''
      };
    } else {
      this.editMode = false;
      this.selectedFinanceiro = this.getEmptyFinanceiro();
    }
    this.showForm = true;
    this.erro = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedFinanceiro = this.getEmptyFinanceiro();
    this.editMode = false;
  }

  saveFinanceiro(): void {
    if (!this.isFormValid() || this.salvando) {
      return;
    }
    const payload: TransacaoFinanceira = {
      ...this.selectedFinanceiro,
      descricao: (this.selectedFinanceiro.descricao ?? '').trim(),
      categoria: this.trimOrUndefined(this.selectedFinanceiro.categoria),
      origem: this.trimOrUndefined(this.selectedFinanceiro.origem),
      formaPagamento: this.trimOrUndefined(this.selectedFinanceiro.formaPagamento),
      observacoes: this.trimOrUndefined(this.selectedFinanceiro.observacoes),
      dataVencimento: this.selectedFinanceiro.dataVencimento || undefined,
      dataPagamento: this.selectedFinanceiro.dataPagamento || undefined,
      safraId: this.selectedFinanceiro.safraId ?? undefined
    };

    this.salvando = true;
    const obs =
      this.editMode && this.selectedFinanceiro.id
        ? this.financeiroService.update(this.selectedFinanceiro.id, payload)
        : this.financeiroService.create(payload);

    obs.subscribe({
      next: () => {
        this.salvando = false;
        this.aplicarFiltros();
        this.closeForm();
      },
      error: (err) => {
        this.salvando = false;
        console.error('Erro ao salvar lançamento financeiro:', err);
        this.erro =
          'Não foi possível salvar o lançamento. Verifique os dados e tente novamente.';
      }
    });
  }

  // ---------- Exclusão ----------

  openDeleteModal(financeiro: TransacaoFinanceira): void {
    this.registroParaExcluir = financeiro;
    this.justificativaExclusao = '';
    this.showDeleteModal = true;
  }

  cancelarExclusao(): void {
    this.showDeleteModal = false;
    this.registroParaExcluir = null;
    this.justificativaExclusao = '';
    this.excluindo = false;
  }

  confirmarExclusao(): void {
    if (
      !this.isJustificativaValida() ||
      !this.registroParaExcluir?.id ||
      this.excluindo
    ) {
      return;
    }
    const id = this.registroParaExcluir.id;
    const justificativa = this.justificativaExclusao.trim();
    this.excluindo = true;
    this.financeiroService.delete(id, justificativa).subscribe({
      next: () => {
        this.cancelarExclusao();
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Erro ao excluir lançamento financeiro:', err);
        this.excluindo = false;
      }
    });
  }

  isJustificativaValida(): boolean {
    const j = (this.justificativaExclusao ?? '').trim();
    return (
      j.length >= this.JUSTIFICATIVA_MIN && j.length <= this.JUSTIFICATIVA_MAX
    );
  }

  justificativaLength(): number {
    return (this.justificativaExclusao ?? '').length;
  }

  // ---------- Sanitização / máscaras ----------

  onDescricaoInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const cleaned = input.value
      .replace(this.DESCRICAO_REGEX, '')
      .replace(/\s{3,}/g, '  ')
      .slice(0, this.DESCRICAO_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedFinanceiro.descricao = cleaned;
  }

  onCategoriaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(this.CATEGORIA_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.CATEGORIA_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedFinanceiro.categoria = cleaned;
  }

  onOrigemInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(this.TEXTO_LIVRE_REGEX, '')
      .slice(0, this.ORIGEM_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedFinanceiro.origem = cleaned;
  }

  onObservacoesInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const cleaned = input.value
      .replace(this.TEXTO_LIVRE_REGEX, '')
      .slice(0, this.OBSERVACOES_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedFinanceiro.observacoes = cleaned;
  }

  blockInvalidNumberKeys(event: KeyboardEvent): void {
    const blocked = ['e', 'E', '+', '-'];
    if (blocked.includes(event.key)) {
      event.preventDefault();
    }
  }

  onValorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '') {
      this.selectedFinanceiro.valor = null;
      return;
    }
    let value = Number(String(input.value).replace(',', '.'));
    if (Number.isNaN(value) || value < 0) {
      value = 0;
    }
    if (value > this.VALOR_MAX) {
      value = this.VALOR_MAX;
      input.value = String(this.VALOR_MAX);
    }
    value = Math.round(value * 100) / 100;
    this.selectedFinanceiro.valor = value;
  }

  // ---------- Validação ----------

  isFormValid(): boolean {
    const f = this.selectedFinanceiro;
    const descricao = (f.descricao ?? '').trim();

    if (!f.fazendaId || Number(f.fazendaId) <= 0) return false;
    if (!f.tipo) return false;
    if (!f.status) return false;
    if (!f.dataTransacao) return false;
    if (descricao.length < this.DESCRICAO_MIN) return false;
    if (descricao.length > this.DESCRICAO_MAX) return false;
    if (
      f.valor === null ||
      f.valor === undefined ||
      Number.isNaN(f.valor) ||
      f.valor < this.VALOR_MIN ||
      f.valor > this.VALOR_MAX
    )
      return false;

    if (this.isVencimentoAntesDaTransacao()) return false;
    if (this.isPagamentoAntesDaTransacao()) return false;
    if (f.status === 'PAGO' && !f.dataPagamento) return false;

    return true;
  }

  isVencimentoAntesDaTransacao(): boolean {
    const f = this.selectedFinanceiro;
    return !!(f.dataTransacao && f.dataVencimento && f.dataVencimento < f.dataTransacao);
  }

  isPagamentoAntesDaTransacao(): boolean {
    const f = this.selectedFinanceiro;
    return !!(f.dataTransacao && f.dataPagamento && f.dataPagamento < f.dataTransacao);
  }

  isPagamentoObrigatorio(): boolean {
    return (
      this.selectedFinanceiro.status === 'PAGO' &&
      !this.selectedFinanceiro.dataPagamento
    );
  }

  // ---------- Helpers ----------

  getFazendaNome(f: TransacaoFinanceira): string {
    if (f.fazendaNome) return f.fazendaNome;
    const found = this.fazendas.find((x) => x.id === f.fazendaId);
    return found?.nome ?? 'N/A';
  }

  getSafraNome(f: TransacaoFinanceira): string {
    if (f.safraNome) return f.safraNome;
    if (!f.safraId) return '—';
    const found = this.safras.find((x) => x.id === f.safraId);
    return found?.nome ?? '—';
  }

  statusLabel(status: StatusTransacaoFinanceira): string {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'PAGO':
        return 'Pago';
      case 'ATRASADO':
        return 'Atrasado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  }

  statusBadgeNgClass(
    status: StatusTransacaoFinanceira
  ): Record<string, boolean> {
    return {
      'bg-yellow-100 text-yellow-800': status === 'PENDENTE',
      'bg-green-100 text-green-800': status === 'PAGO',
      'bg-red-100 text-red-800': status === 'ATRASADO',
      'bg-gray-200 text-gray-800': status === 'CANCELADO'
    };
  }

  // ---------- Internals ----------

  private buildFiltro(): FinanceiroFiltro {
    return {
      fazendaId: this.filtroFazendaId,
      tipo: this.filtroTipo,
      status: this.filtroStatus,
      dataInicio: this.filtroDataInicio || null,
      dataFim: this.filtroDataFim || null
    };
  }

  private normalizarResumo(r: FinanceiroResumo): FinanceiroResumo {
    const num = (v: unknown): number => {
      if (v === null || v === undefined) return 0;
      const x = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(x) ? x : 0;
    };
    const totalReceitas = num(r.totalReceitas);
    const totalDespesas = num(r.totalDespesas);
    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      quantidadeReceitas: Math.trunc(num(r.quantidadeReceitas)),
      quantidadeDespesas: Math.trunc(num(r.quantidadeDespesas)),
      quantidadePendentes: Math.trunc(num(r.quantidadePendentes)),
      quantidadeAtrasadas: Math.trunc(num(r.quantidadeAtrasadas))
    };
  }

  private calcularResumoLocal(): FinanceiroResumo {
    const totalReceitas = this.financeiros
      .filter((f) => f.tipo === 'RECEITA')
      .reduce((sum, f) => sum + Number(f.valor ?? 0), 0);
    const totalDespesas = this.financeiros
      .filter((f) => f.tipo === 'DESPESA')
      .reduce((sum, f) => sum + Number(f.valor ?? 0), 0);
    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      quantidadeReceitas: this.financeiros.filter((f) => f.tipo === 'RECEITA').length,
      quantidadeDespesas: this.financeiros.filter((f) => f.tipo === 'DESPESA').length,
      quantidadePendentes: this.financeiros.filter((f) => f.status === 'PENDENTE').length,
      quantidadeAtrasadas: this.financeiros.filter((f) => f.status === 'ATRASADO').length
    };
  }

  private zeroResumo(): FinanceiroResumo {
    return {
      totalReceitas: 0,
      totalDespesas: 0,
      saldo: 0,
      quantidadeReceitas: 0,
      quantidadeDespesas: 0,
      quantidadePendentes: 0,
      quantidadeAtrasadas: 0
    };
  }

  private trimOrUndefined(value?: string | null): string | undefined {
    if (value === null || value === undefined) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private getEmptyFinanceiro(): TransacaoFinanceira {
    const hoje = new Date().toISOString().slice(0, 10);
    return {
      fazendaId: null,
      safraId: null,
      tipo: 'DESPESA',
      valor: null,
      descricao: '',
      formaPagamento: '',
      status: 'PAGO',
      dataTransacao: hoje,
      dataVencimento: '',
      dataPagamento: hoje,
      categoria: '',
      origem: '',
      observacoes: ''
    };
  }
}
