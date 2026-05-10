import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovimentacaoEstoqueService } from '../../../services/movimentacao-estoque/movimentacao-estoque.service';
import { InsumoService } from '../../../services/insumo/insumo.service';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { AuthService } from '../../../services/auth/auth.service';
import {
  MovimentacaoEstoque,
  MovimentacaoEstoqueRequest,
  TipoMovimentacaoEstoque
} from '../../../models/movimentacao-estoque.model';
import { Insumo } from '../../../models/insumo.model';
import { Fazenda } from '../../../models/fazenda.model';

@Component({
  selector: 'app-estoque-movimentacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './estoque-movimentacao.component.html',
  styleUrls: ['./estoque-movimentacao.component.css']
})
export class EstoqueMovimentacaoComponent implements OnInit {
  tipo!: TipoMovimentacaoEstoque;
  pageTitle = '';
  movimentacoes: MovimentacaoEstoque[] = [];
  fazendas: Fazenda[] = [];
  insumosDaFazenda: Insumo[] = [];

  showForm = false;
  editMode = false;
  editingId: number | null = null;

  formFazendaId = 0;
  formInsumoId = 0;
  formQuantidade: number | null = null;
  formDataLocal = '';
  formObservacao = '';
  formValorUnitario: number | null = null;
  formFornecedor = '';

  showNovoInsumo = false;
  novoNome = '';
  novoCategoria = '';
  novoUnidade = '';

  constructor(
    private route: ActivatedRoute,
    private movimentacaoService: MovimentacaoEstoqueService,
    private insumoService: InsumoService,
    private fazendaService: FazendaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tipo = this.route.snapshot.data['tipo'] as TipoMovimentacaoEstoque;
    this.pageTitle =
      this.tipo === 'ENTRADA' ? 'Entradas no estoque' : 'Saídas no estoque';
    this.loadMovimentacoes();
    this.loadFazendas();
  }

  loadFazendas(): void {
    const uid = this.authService.getCurrentUserId() ?? 1;
    this.fazendaService.getAllByUsuario(uid).subscribe({
      next: (data) => (this.fazendas = data),
      error: () => (this.fazendas = [])
    });
  }

  loadMovimentacoes(): void {
    this.movimentacaoService.getByTipo(this.tipo).subscribe({
      next: (data) => (this.movimentacoes = data),
      error: (e) => console.error('Erro ao carregar movimentações:', e)
    });
  }

  onFazendaChange(resetInsumo = true): void {
    if (resetInsumo) {
      this.formInsumoId = 0;
    }
    this.insumosDaFazenda = [];
    if (!this.formFazendaId) {
      return;
    }
    this.insumoService.getByFazenda(this.formFazendaId).subscribe({
      next: (data) => (this.insumosDaFazenda = data),
      error: () => (this.insumosDaFazenda = [])
    });
  }

  openForm(m?: MovimentacaoEstoque): void {
    if (m?.id != null) {
      this.editMode = true;
      this.editingId = m.id;
      this.formFazendaId = m.fazendaId;
      this.formInsumoId = m.insumoId;
      this.formQuantidade = m.quantidade;
      this.formDataLocal = this.toDatetimeLocalValue(m.dataMovimentacao);
      this.formObservacao = m.observacao ?? '';
      this.formValorUnitario = m.valorUnitario;
      this.formFornecedor = m.fornecedor ?? '';
      this.onFazendaChange(false);
    } else {
      this.editMode = false;
      this.editingId = null;
      this.formFazendaId = 0;
      this.formInsumoId = 0;
      this.formQuantidade = null;
      this.formDataLocal = this.defaultDatetimeLocal();
      this.formObservacao = '';
      this.formValorUnitario = null;
      this.formFornecedor = '';
      this.insumosDaFazenda = [];
    }
    this.showNovoInsumo = false;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (!this.formFazendaId || !this.formInsumoId || this.formQuantidade == null) {
      alert('Preencha fazenda, insumo e quantidade.');
      return;
    }
    const body: MovimentacaoEstoqueRequest = {
      fazendaId: this.formFazendaId,
      insumoId: this.formInsumoId,
      tipoMovimentacao: this.tipo,
      quantidade: Number(this.formQuantidade),
      dataMovimentacao: this.toBackendDateTime(this.formDataLocal),
      observacao: this.formObservacao?.trim() || null,
      valorUnitario:
        this.tipo === 'ENTRADA' && this.formValorUnitario != null
          ? Number(this.formValorUnitario)
          : null,
      fornecedor:
        this.tipo === 'ENTRADA' && this.formFornecedor?.trim()
          ? this.formFornecedor.trim()
          : null
    };

    if (this.editMode && this.editingId != null) {
      this.movimentacaoService.update(this.editingId, body).subscribe({
        next: () => {
          this.loadMovimentacoes();
          this.closeForm();
        },
        error: (e) => console.error('Erro ao atualizar:', e)
      });
    } else {
      this.movimentacaoService.create(body).subscribe({
        next: () => {
          this.loadMovimentacoes();
          this.closeForm();
        },
        error: (e) => console.error('Erro ao registar:', e)
      });
    }
  }

  criarInsumoRapido(): void {
    if (!this.formFazendaId || !this.novoNome.trim() || !this.novoUnidade.trim()) {
      alert('Informe fazenda, nome e unidade do novo insumo.');
      return;
    }
    this.insumoService
      .create({
        fazendaId: this.formFazendaId,
        nome: this.novoNome.trim(),
        categoria: this.novoCategoria.trim() || null,
        quantidadeAtual: 0,
        unidadeMedida: this.novoUnidade.trim()
      })
      .subscribe({
        next: (created) => {
          this.novoNome = '';
          this.novoCategoria = '';
          this.novoUnidade = '';
          this.showNovoInsumo = false;
          this.onFazendaChange();
          this.formInsumoId = created.id!;
        },
        error: (e) => console.error('Erro ao criar insumo:', e)
      });
  }

  deleteMov(id: number): void {
    if (confirm('Excluir esta movimentação? O saldo será revertido.')) {
      this.movimentacaoService.delete(id).subscribe({
        next: () => this.loadMovimentacoes(),
        error: (e) => console.error('Erro ao excluir:', e)
      });
    }
  }

  private defaultDatetimeLocal(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  }

  private toDatetimeLocalValue(iso: string): string {
    if (!iso) {
      return this.defaultDatetimeLocal();
    }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return iso.slice(0, 16);
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  }

  private toBackendDateTime(localVal: string): string {
    if (!localVal) {
      return new Date().toISOString().slice(0, 19);
    }
    if (localVal.length === 16) {
      return localVal + ':00';
    }
    return localVal;
  }

  categoriaClass(cat: string | null): string {
    const c = (cat ?? '').toUpperCase();
    if (c.includes('SEMENTE')) return 'bg-green-100 text-green-800';
    if (c.includes('FERTIL')) return 'bg-lime-100 text-lime-800';
    if (c.includes('AGRO') || c.includes('HERB')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }
}
