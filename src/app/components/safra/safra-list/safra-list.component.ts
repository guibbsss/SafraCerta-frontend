import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafraService } from '../../../services/safra/safra.service';
import { TalhaoService } from '../../../services/talhao/talhao.service';
import { InsumoService } from '../../../services/insumo/insumo.service';
import { Safra } from '../../../models/safra.model';
import { TalhaoModel } from '../../../models/talhao.model';
import { Insumo } from '../../../models/insumo.model';
import { SePermissaoDirective } from '../../../directives/se-permissao.directive';
import { P } from '../../../constants/permissoes';

@Component({
  selector: 'app-safra-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SePermissaoDirective],
  templateUrl: './safra-list.component.html',
  styleUrls: ['./safra-list.component.css']
})
export class SafraListComponent implements OnInit {
  readonly P = P;
  safras: Safra[] = [];
  talhoes: TalhaoModel[] = [];
  /** Insumos da fazenda do talhão seleccionado (apenas criação). */
  insumosPorFazenda: Insumo[] = [];
  /** Linhas de formulário para consumo de estoque (apenas criação). */
  consumoLinhas: { insumoId: number | null; quantidade: number | null }[] = [];
  insumosCarregando = false;
  /** Erro ao chamar GET /insumos/fazenda/{id} (rede, 403, etc.). */
  insumosErro: string | null = null;
  /** Mensagem após criar safra (consumos / sem consumos). */
  feedbackSafra: string | null = null;
  showForm = false;
  editMode = false;
  selectedSafra: Safra = this.getEmptySafra();

  showDeleteModal = false;
  safraParaExcluir: Safra | null = null;
  justificativaExclusao = '';
  excluindo = false;

  readonly NOME_MAX = 160;
  readonly NOME_MIN = 3;
  readonly CULTURA_MAX = 120;
  readonly CULTURA_MIN = 2;
  readonly PRODUCAO_MAX = 9_999_999.99;
  readonly JUSTIFICATIVA_MIN = 5;
  readonly JUSTIFICATIVA_MAX = 500;

  // Letras (acentuadas), dígitos, espaços, / - . _
  private readonly NOME_REGEX = /[^A-Za-zÀ-ÿ0-9\s\/\-\._]/g;
  // Apenas letras (acentuadas), espaços e hífen
  private readonly CULTURA_REGEX = /[^A-Za-zÀ-ÿ\s\-]/g;

  constructor(
    private safraService: SafraService,
    private talhaoService: TalhaoService,
    private insumoService: InsumoService
  ) {}

  ngOnInit(): void {
    this.loadSafras();
    this.loadTalhoes();
  }

  loadSafras(): void {
    this.safraService.getAll().subscribe({
      next: (data) => this.safras = data,
      error: (error) => console.error('Erro ao carregar safras:', error)
    });
  }

  loadTalhoes(): void {
    this.talhaoService.getAll().subscribe({
      next: (data) => this.talhoes = data,
      error: (error) => console.error('Erro ao carregar talhões:', error)
    });
  }

  openForm(safra?: Safra): void {
    this.feedbackSafra = null;
    this.insumosErro = null;
    this.insumosCarregando = false;
    this.consumoLinhas = [];
    this.insumosPorFazenda = [];
    if (safra) {
      this.editMode = true;
      this.selectedSafra = { ...safra };
    } else {
      this.editMode = false;
      this.selectedSafra = this.getEmptySafra();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedSafra = this.getEmptySafra();
    this.consumoLinhas = [];
    this.insumosPorFazenda = [];
    this.insumosErro = null;
    this.insumosCarregando = false;
  }

  onTalhaoChange(): void {
    if (this.editMode) {
      return;
    }
    this.consumoLinhas = [];
    this.insumosErro = null;
    const tid = this.selectedSafra.talhaoId;
    if (tid == null || tid === undefined) {
      this.insumosPorFazenda = [];
      this.insumosCarregando = false;
      return;
    }
    const t = this.talhoes.find((th) => th.id === tid);
    const fazendaId = t?.fazendaId;
    if (fazendaId == null || fazendaId === undefined) {
      this.insumosPorFazenda = [];
      this.insumosCarregando = false;
      this.insumosErro =
        'Talhão sem fazenda associada na lista. Recarregue a página ou verifique o cadastro do talhão.';
      return;
    }
    this.insumosCarregando = true;
    this.insumoService.getByFazenda(fazendaId).subscribe({
      next: (data) => {
        this.insumosPorFazenda = data;
        this.insumosCarregando = false;
        this.insumosErro = null;
      },
      error: (err) => {
        console.error('Erro ao carregar insumos da fazenda:', err);
        this.insumosPorFazenda = [];
        this.insumosCarregando = false;
        this.insumosErro =
          'Não foi possível carregar os produtos da fazenda. Verifique se está autenticado e tente novamente.';
      }
    });
  }

  addConsumoLinha(): void {
    this.consumoLinhas.push({ insumoId: null, quantidade: null });
  }

  removeConsumoLinha(index: number): void {
    this.consumoLinhas.splice(index, 1);
  }

  saveSafra(): void {
    if (!this.isFormValid()) {
      return;
    }
    const consumosPayload = this.buildConsumosPayload();
    const payload = this.buildSafraPayload(consumosPayload);

    if (this.editMode && this.selectedSafra.id) {
      this.safraService.update(this.selectedSafra.id, payload).subscribe({
        next: () => {
          this.loadSafras();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar safra:', error)
      });
    } else {
      this.safraService.create(payload).subscribe({
        next: () => {
          if (consumosPayload.length > 0) {
            this.feedbackSafra = `Safra criada com ${consumosPayload.length} saída(s) registada(s) no estoque (ver Estoque → Saídas).`;
          } else {
            this.feedbackSafra =
              'Safra criada sem consumo de stock. Para registar saídas automaticamente, na criação use "+ Adicionar produto" com produto e quantidade (só é possível ao criar, não ao editar).';
          }
          this.loadSafras();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar safra:', error)
      });
    }
  }

  /**
   * Monta o corpo do pedido sem misturar `consumosInsumo` em formato de resposta da API
   * no campo enviado ao POST (apenas lista { insumoId, quantidade }).
   */
  private buildSafraPayload(consumosPayload: { insumoId: number; quantidade: number }[]): Safra {
    const rest = { ...this.selectedSafra };
    delete rest.consumosInsumo;
    const talhaoIdNumber = Number(this.selectedSafra.talhaoId);
    const payload: Safra = {
      ...rest,
      nome: (this.selectedSafra.nome ?? '').trim(),
      cultura: (this.selectedSafra.cultura ?? '').trim(),
      talhaoId: talhaoIdNumber,
      dataColheitaReal: this.selectedSafra.dataColheitaReal || undefined,
      producaoEstimada: this.normalizeProducao(this.selectedSafra.producaoEstimada),
      producaoReal: this.normalizeProducao(this.selectedSafra.producaoReal)
    };
    if (this.editMode) {
      return payload;
    }
    if (consumosPayload.length > 0) {
      payload.consumosInsumo = consumosPayload;
    }
    return payload;
  }

  openDeleteModal(safra: Safra): void {
    this.safraParaExcluir = safra;
    this.justificativaExclusao = '';
    this.showDeleteModal = true;
  }

  cancelarExclusao(): void {
    this.showDeleteModal = false;
    this.safraParaExcluir = null;
    this.justificativaExclusao = '';
    this.excluindo = false;
  }

  confirmarExclusao(): void {
    if (!this.isJustificativaValida() || !this.safraParaExcluir?.id || this.excluindo) {
      return;
    }
    const id = this.safraParaExcluir.id;
    const justificativa = this.justificativaExclusao.trim();
    this.excluindo = true;
    this.safraService.delete(id, justificativa).subscribe({
      next: () => {
        this.cancelarExclusao();
        this.loadSafras();
      },
      error: (error) => {
        console.error('Erro ao excluir safra:', error);
        this.excluindo = false;
      }
    });
  }

  isJustificativaValida(): boolean {
    const j = (this.justificativaExclusao ?? '').trim();
    return j.length >= this.JUSTIFICATIVA_MIN && j.length <= this.JUSTIFICATIVA_MAX;
  }

  justificativaLength(): number {
    return (this.justificativaExclusao ?? '').length;
  }

  // ---------- Máscaras / sanitização ----------

  onNomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(this.NOME_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.NOME_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedSafra.nome = cleaned;
  }

  onCulturaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(this.CULTURA_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.CULTURA_MAX);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.selectedSafra.cultura = cleaned;
  }

  blockInvalidNumberKeys(event: KeyboardEvent): void {
    const blocked = ['e', 'E', '+', '-'];
    if (blocked.includes(event.key)) {
      event.preventDefault();
    }
  }

  onProducaoInput(field: 'producaoEstimada' | 'producaoReal', event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '') {
      this.selectedSafra[field] = undefined;
      return;
    }
    let value = Number(input.value);
    if (Number.isNaN(value) || value < 0) {
      value = 0;
    }
    if (value > this.PRODUCAO_MAX) {
      value = this.PRODUCAO_MAX;
      input.value = String(this.PRODUCAO_MAX);
    }
    value = Math.round(value * 100) / 100;
    this.selectedSafra[field] = value;
  }

  // ---------- Validação cross-field ----------

  isFormValid(): boolean {
    const s = this.selectedSafra;
    const nome = (s.nome ?? '').trim();
    const cultura = (s.cultura ?? '').trim();

    if (nome.length < this.NOME_MIN) return false;
    if (cultura.length < this.CULTURA_MIN) return false;
    if (s.talhaoId === null || s.talhaoId === undefined || Number(s.talhaoId) <= 0) return false;
    if (!s.status) return false;
    if (!s.dataPlantio) return false;
    if (!s.dataColheitaPrevista) return false;

    if (s.dataColheitaPrevista < s.dataPlantio) return false;
    if (s.dataColheitaReal && s.dataColheitaReal < s.dataPlantio) return false;

    if (s.producaoEstimada !== undefined && s.producaoEstimada !== null) {
      if (s.producaoEstimada < 0 || s.producaoEstimada > this.PRODUCAO_MAX) return false;
    }
    if (s.producaoReal !== undefined && s.producaoReal !== null) {
      if (s.producaoReal < 0 || s.producaoReal > this.PRODUCAO_MAX) return false;
    }
    if (!this.isConsumosLinhasValidas()) {
      return false;
    }
    return true;
  }

  private isConsumosLinhasValidas(): boolean {
    if (this.editMode) {
      return true;
    }
    const seen = new Set<number>();
    for (const l of this.consumoLinhas) {
      const hasInsumo = l.insumoId != null && l.insumoId > 0;
      const hasQtd = l.quantidade != null && l.quantidade > 0;
      if (hasInsumo !== hasQtd) {
        return false;
      }
      if (hasInsumo && hasQtd) {
        const id = l.insumoId as number;
        if (seen.has(id)) {
          return false;
        }
        seen.add(id);
      }
    }
    return true;
  }

  private buildConsumosPayload(): { insumoId: number; quantidade: number }[] {
    return this.consumoLinhas
      .filter(
        (l) =>
          l.insumoId != null &&
          Number(l.insumoId) > 0 &&
          l.quantidade != null &&
          Number(l.quantidade) > 0
      )
      .map((l) => ({
        insumoId: Number(l.insumoId),
        quantidade: Number(l.quantidade)
      }));
  }

  isColheitaPrevistaInvalid(): boolean {
    const s = this.selectedSafra;
    return !!(s.dataPlantio && s.dataColheitaPrevista && s.dataColheitaPrevista < s.dataPlantio);
  }

  isColheitaRealInvalid(): boolean {
    const s = this.selectedSafra;
    return !!(s.dataPlantio && s.dataColheitaReal && s.dataColheitaReal < s.dataPlantio);
  }

  consumoCount(safra: Safra): string {
    const c = safra.consumosInsumo;
    if (!c || !Array.isArray(c) || c.length === 0) {
      return '—';
    }
    return `${c.length} item(ns)`;
  }

  private normalizeProducao(value: number | null | undefined): number | undefined {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return undefined;
    }
    return Math.round(Number(value) * 100) / 100;
  }

  private getEmptySafra(): Safra {
    return {
      nome: '',
      talhaoId: null,
      cultura: '',
      dataPlantio: '',
      dataColheitaPrevista: '',
      dataColheitaReal: '',
      status: 'PLANTADA',
      producaoEstimada: undefined,
      producaoReal: undefined
    };
  }
}
