import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafraService } from '../../../services/safra/safra.service';
import { TalhaoService } from '../../../services/talhao/talhao.service';
import { Safra } from '../../../models/safra.model';
import { Talhao } from '../../../models/talhao.model';

@Component({
  selector: 'app-safra-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './safra-list.component.html',
  styleUrls: ['./safra-list.component.css']
})
export class SafraListComponent implements OnInit {
  safras: Safra[] = [];
  talhoes: Talhao[] = [];
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
    private talhaoService: TalhaoService
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
  }

  saveSafra(): void {
    if (!this.isFormValid()) {
      return;
    }
    const talhaoIdRaw = this.selectedSafra.talhaoId;
    const talhaoIdNumber = talhaoIdRaw ? Number(talhaoIdRaw) : null;
    const payload: Safra = {
      ...this.selectedSafra,
      nome: (this.selectedSafra.nome ?? '').trim(),
      cultura: (this.selectedSafra.cultura ?? '').trim(),
      talhaoId: talhaoIdNumber && talhaoIdNumber > 0 ? talhaoIdNumber : null,
      dataColheitaReal: this.selectedSafra.dataColheitaReal || undefined,
      producaoEstimada: this.normalizeProducao(this.selectedSafra.producaoEstimada),
      producaoReal: this.normalizeProducao(this.selectedSafra.producaoReal)
    };

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
          this.loadSafras();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar safra:', error)
      });
    }
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
    return true;
  }

  isColheitaPrevistaInvalid(): boolean {
    const s = this.selectedSafra;
    return !!(s.dataPlantio && s.dataColheitaPrevista && s.dataColheitaPrevista < s.dataPlantio);
  }

  isColheitaRealInvalid(): boolean {
    const s = this.selectedSafra;
    return !!(s.dataPlantio && s.dataColheitaReal && s.dataColheitaReal < s.dataPlantio);
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
