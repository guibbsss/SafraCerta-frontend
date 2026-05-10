import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TalhaoService } from '../../../services/talhao/talhao.service';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Talhao } from '../../../models/talhao.model';
import { Fazenda } from '../../../models/fazenda.model';

@Component({
  selector: 'app-talhao-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './talhao-list.component.html',
  styleUrls: ['./talhao-list.component.css']
})
export class TalhaoListComponent implements OnInit {
  talhoes: Talhao[] = [];
  fazendas: Fazenda[] = [];
  showForm = false;
  editMode = false;
  selectedTalhao: Talhao = this.getEmptyTalhao();
  carregando = false;
  salvando = false;
  erro = '';

  readonly NOME_MAX = 200;
  readonly CULTIVO_MAX = 120;
  readonly AREA_MIN = 0;
  readonly AREA_MAX = 9999999.9999;

  private readonly nomeRegex = /[^A-Za-zÀ-ÖØ-öø-ÿ0-9 \-_/.]/g;
  private readonly cultivoRegex = /[^A-Za-zÀ-ÖØ-öø-ÿ0-9 \-]/g;

  constructor(
    private talhaoService: TalhaoService,
    private fazendaService: FazendaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTalhoes();
    this.loadFazendas();
  }

  loadTalhoes(): void {
    this.carregando = true;
    this.erro = '';
    this.talhaoService.getAll().subscribe({
      next: (data) => {
        this.talhoes = data ?? [];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar talhões:', err);
        this.erro = 'Não foi possível carregar os talhões.';
        this.talhoes = [];
        this.carregando = false;
      }
    });
  }

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

  openForm(talhao?: Talhao): void {
    if (talhao) {
      this.editMode = true;
      this.selectedTalhao = {
        id: talhao.id,
        fazendaId: talhao.fazendaId ?? null,
        fazendaNome: talhao.fazendaNome,
        nome: talhao.nome ?? '',
        areaHectares: talhao.areaHectares ?? null,
        tipoCultivo: talhao.tipoCultivo ?? ''
      };
    } else {
      this.editMode = false;
      this.selectedTalhao = this.getEmptyTalhao();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedTalhao = this.getEmptyTalhao();
  }

  saveTalhao(): void {
    if (!this.isFormValid() || this.salvando) {
      return;
    }
    const payload: Talhao = {
      fazendaId: this.selectedTalhao.fazendaId,
      nome: (this.selectedTalhao.nome ?? '').trim(),
      areaHectares: this.selectedTalhao.areaHectares,
      tipoCultivo: (this.selectedTalhao.tipoCultivo ?? '').trim()
    };

    this.salvando = true;

    const obs = this.editMode && this.selectedTalhao.id
      ? this.talhaoService.update(this.selectedTalhao.id, payload)
      : this.talhaoService.create(payload);

    obs.subscribe({
      next: () => {
        this.salvando = false;
        this.loadTalhoes();
        this.closeForm();
      },
      error: (error) => {
        this.salvando = false;
        console.error('Erro ao salvar talhão:', error);
        this.erro = 'Não foi possível salvar o talhão. Verifique os dados e tente novamente.';
      }
    });
  }

  deleteTalhao(id?: number): void {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir este talhão?')) return;
    this.talhaoService.delete(id).subscribe({
      next: () => this.loadTalhoes(),
      error: (error) => {
        console.error('Erro ao excluir talhão:', error);
        this.erro = 'Não foi possível excluir o talhão.';
      }
    });
  }

  onNomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(this.nomeRegex, '');
    if (valor.length > this.NOME_MAX) {
      valor = valor.slice(0, this.NOME_MAX);
    }
    if (valor !== input.value) {
      input.value = valor;
    }
    this.selectedTalhao.nome = valor;
  }

  onCultivoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(this.cultivoRegex, '');
    if (valor.length > this.CULTIVO_MAX) {
      valor = valor.slice(0, this.CULTIVO_MAX);
    }
    if (valor !== input.value) {
      input.value = valor;
    }
    this.selectedTalhao.tipoCultivo = valor;
  }

  onAreaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(',', '.').replace(/[^0-9.]/g, '');
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
    if (valor !== input.value) {
      input.value = valor;
    }
    this.selectedTalhao.areaHectares = valor === '' ? null : Number(valor);
  }

  isNomeValido(): boolean {
    const v = (this.selectedTalhao.nome ?? '').trim();
    return v.length > 0 && v.length <= this.NOME_MAX;
  }

  isFazendaValida(): boolean {
    return this.selectedTalhao.fazendaId !== null && this.selectedTalhao.fazendaId !== undefined && Number(this.selectedTalhao.fazendaId) > 0;
  }

  isAreaValida(): boolean {
    const v = this.selectedTalhao.areaHectares;
    if (v === null || v === undefined || isNaN(Number(v))) return true;
    return Number(v) >= this.AREA_MIN && Number(v) <= this.AREA_MAX;
  }

  isCultivoValido(): boolean {
    const v = (this.selectedTalhao.tipoCultivo ?? '').trim();
    return v.length <= this.CULTIVO_MAX;
  }

  isFormValid(): boolean {
    return this.isNomeValido() && this.isFazendaValida() && this.isAreaValida() && this.isCultivoValido();
  }

  getFazendaNome(t: Talhao): string {
    if (t.fazendaNome) return t.fazendaNome;
    const f = this.fazendas.find((x) => x.id === t.fazendaId);
    return f?.nome ?? 'N/A';
  }

  private getEmptyTalhao(): Talhao {
    return {
      fazendaId: null,
      nome: '',
      areaHectares: null,
      tipoCultivo: ''
    };
  }
}
