import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtividadeService } from '../../../services/atividade/atividade.service';
import { TalhaoService } from '../../../services/talhao/talhao.service';
import { Atividade } from '../../../models/atividade.model';
import { Talhao } from '../../../models/talhao.model';

/**
 * Mesma forma de {@link Atividade}; declarado aqui para o strictTemplates não falhar no HTML.
 * Manter campos alinhados a `models/atividade.model.ts`.
 */
interface AtividadeView {
  id?: number;
  talhaoId: number | null;
  talhaoNome?: string | null;
  tipoOperacao: string;
  dataAtividade: string;
  descricao?: string | null;
}

@Component({
  selector: 'app-atividade-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividade-list.component.html',
  styleUrls: ['./atividade-list.component.css']
})
export class AtividadeListComponent implements OnInit {
  atividades: AtividadeView[] = [];
  talhoes: Talhao[] = [];
  showForm = false;
  editMode = false;
  selectedAtividade: AtividadeView = this.getEmptyAtividade();

  /** Filtro da listagem: null = todos os talhões */
  filtroTalhaoId: number | null = null;

  readonly TIPO_MIN = 2;
  readonly TIPO_MAX = 120;
  readonly DESCRICAO_MAX = 500;
  /** Letras, números, espaço, "/", "-" */
  private readonly TIPO_REGEX = /[^A-Za-zÀ-ÿ0-9\s\/\-]/g;

  readonly tiposSugeridos = [
    'Plantio',
    'Adubação',
    'Irrigação',
    'Pulverização',
    'Colheita',
    'Manutenção',
    'Outro'
  ];

  constructor(
    private atividadeService: AtividadeService,
    private talhaoService: TalhaoService
  ) {}

  ngOnInit(): void {
    this.loadTalhoes();
    this.loadAtividades();
  }

  loadAtividades(): void {
    const req =
      this.filtroTalhaoId != null && this.filtroTalhaoId > 0
        ? this.atividadeService.getByTalhao(this.filtroTalhaoId)
        : this.atividadeService.getAll();
    req.subscribe({
      next: (data) => {
        this.atividades = this.normalizeAtividadesResponse(data);
      },
      error: (error) => console.error('Erro ao carregar atividades:', error)
    });
  }

  loadTalhoes(): void {
    this.talhaoService.getAll().subscribe({
      next: (data) => (this.talhoes = data),
      error: (error) => console.error('Erro ao carregar talhões:', error)
    });
  }

  onFiltroTalhaoChange(): void {
    this.loadAtividades();
  }

  /** Nome do talhão na tabela: API pode omitir talhaoNome; usa lista carregada ou #id. */
  talhaoLabel(a: AtividadeView): string {
    const nomeApi = (a.talhaoNome ?? '').trim();
    if (nomeApi) {
      return nomeApi;
    }
    const tid = a.talhaoId;
    if (tid == null) {
      return '—';
    }
    const t = this.talhoes.find((x) => x.id === tid);
    return t?.nome ?? `Talhão #${tid}`;
  }

  /** Garante array; alguns proxies devolvem objeto com chaves numéricas em vez de []. */
  private normalizeAtividadesResponse(data: unknown): AtividadeView[] {
    if (Array.isArray(data)) {
      return data as AtividadeView[];
    }
    if (data != null && typeof data === 'object') {
      return Object.values(data as Record<string, AtividadeView>);
    }
    return [];
  }

  aplicarTipoSugerido(tipo: string): void {
    const cleaned = tipo
      .replace(this.TIPO_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.TIPO_MAX);
    this.selectedAtividade.tipoOperacao = cleaned;
  }

  openForm(atividade?: AtividadeView): void {
    if (atividade) {
      this.editMode = true;
      this.selectedAtividade = {
        ...atividade,
        dataAtividade: atividade.dataAtividade?.slice(0, 10) ?? '',
        descricao: atividade.descricao ?? ''
      };
    } else {
      this.editMode = false;
      this.selectedAtividade = this.getEmptyAtividade();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedAtividade = this.getEmptyAtividade();
  }

  saveAtividade(): void {
    if (!this.isFormValid()) {
      return;
    }
    const talhaoId = Number(this.selectedAtividade.talhaoId);
    const payload: Atividade = {
      talhaoId,
      tipoOperacao: (this.selectedAtividade.tipoOperacao ?? '').trim(),
      dataAtividade: this.selectedAtividade.dataAtividade,
      descricao: this.normalizeDescricao(this.selectedAtividade.descricao)
    } satisfies AtividadeView;

    if (this.editMode && this.selectedAtividade.id) {
      this.atividadeService.update(this.selectedAtividade.id, payload).subscribe({
        next: () => {
          this.loadAtividades();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar atividade:', error)
      });
    } else {
      this.atividadeService.create(payload).subscribe({
        next: () => {
          this.loadAtividades();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar atividade:', error)
      });
    }
  }

  deleteAtividade(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      this.atividadeService.delete(id).subscribe({
        next: () => this.loadAtividades(),
        error: (error) => console.error('Erro ao excluir atividade:', error)
      });
    }
  }

  onTipoOperacaoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(this.TIPO_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.TIPO_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedAtividade.tipoOperacao = cleaned;
  }

  onDescricaoInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    const v = ta.value.slice(0, this.DESCRICAO_MAX);
    if (ta.value !== v) {
      ta.value = v;
    }
    this.selectedAtividade.descricao = v;
  }

  isFormValid(): boolean {
    const t = (this.selectedAtividade.tipoOperacao ?? '').trim();
    const tid = this.selectedAtividade.talhaoId;
    if (tid === null || tid === undefined || Number(tid) <= 0) {
      return false;
    }
    if (t.length < this.TIPO_MIN || t.length > this.TIPO_MAX) {
      return false;
    }
    if (!this.selectedAtividade.dataAtividade) {
      return false;
    }
    const desc = (this.selectedAtividade.descricao ?? '').trim();
    if (desc.length > this.DESCRICAO_MAX) {
      return false;
    }
    return true;
  }

  descricaoLength(): number {
    return (this.selectedAtividade.descricao ?? '').length;
  }

  private normalizeDescricao(value: string | null | undefined): string | undefined {
    const v = (value ?? '').trim();
    return v.length > 0 ? v : undefined;
  }

  private getEmptyAtividade(): AtividadeView {
    return {
      talhaoId: null,
      tipoOperacao: '',
      dataAtividade: '',
      descricao: ''
    };
  }
}
