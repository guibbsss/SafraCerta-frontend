import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InsumoService } from '../../../services/insumo/insumo.service';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Insumo, InsumoRequest } from '../../../models/insumo.model';
import { Fazenda } from '../../../models/fazenda.model';
import { SePermissaoDirective } from '../../../directives/se-permissao.directive';
import { P } from '../../../constants/permissoes';

@Component({
  selector: 'app-estoque-atual',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SePermissaoDirective],
  templateUrl: './estoque-atual.component.html',
  styleUrls: ['./estoque-atual.component.css']
})
export class EstoqueAtualComponent implements OnInit {
  readonly P = P;
  insumos: Insumo[] = [];
  fazendas: Fazenda[] = [];
  showForm = false;
  editMode = false;
  selected: InsumoRequest & { id?: number } = this.emptyForm();

  constructor(
    private insumoService: InsumoService,
    private fazendaService: FazendaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFazendas();
    this.loadInsumos();
  }

  loadFazendas(): void {
    const uid = this.authService.getCurrentUserId() ?? 1;
    this.fazendaService.getAllByUsuario(uid).subscribe({
      next: (data) => (this.fazendas = data),
      error: () => (this.fazendas = [])
    });
  }

  loadInsumos(): void {
    this.insumoService.getAll().subscribe({
      next: (data) => (this.insumos = data),
      error: (e) => console.error('Erro ao carregar insumos:', e)
    });
  }

  openForm(ins?: Insumo): void {
    if (ins?.id != null) {
      this.editMode = true;
      this.selected = {
        id: ins.id,
        fazendaId: ins.fazendaId,
        nome: ins.nome,
        categoria: ins.categoria ?? '',
        quantidadeAtual: ins.quantidadeAtual,
        unidadeMedida: ins.unidadeMedida,
        valorUnitarioReferencia: ins.valorUnitarioReferencia
      };
    } else {
      this.editMode = false;
      this.selected = this.emptyForm();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selected = this.emptyForm();
  }

  save(): void {
    const body: InsumoRequest = {
      fazendaId: Number(this.selected.fazendaId),
      nome: this.selected.nome.trim(),
      categoria: this.selected.categoria?.trim() || null,
      quantidadeAtual: Number(this.selected.quantidadeAtual),
      unidadeMedida: this.selected.unidadeMedida.trim(),
      valorUnitarioReferencia:
        this.selected.valorUnitarioReferencia != null
          ? Number(this.selected.valorUnitarioReferencia)
          : null
    };

    if (this.editMode && this.selected.id != null) {
      this.insumoService.update(this.selected.id, body).subscribe({
        next: () => {
          this.loadInsumos();
          this.closeForm();
        },
        error: (e) => console.error('Erro ao atualizar insumo:', e)
      });
    } else {
      this.insumoService.create(body).subscribe({
        next: () => {
          this.loadInsumos();
          this.closeForm();
        },
        error: (e) => console.error('Erro ao criar insumo:', e)
      });
    }
  }

  deleteItem(id: number): void {
    if (confirm('Excluir este insumo do cadastro?')) {
      this.insumoService.delete(id).subscribe({
        next: () => this.loadInsumos(),
        error: (e) => console.error('Erro ao excluir:', e)
      });
    }
  }

  private emptyForm(): InsumoRequest & { id?: number } {
    return {
      fazendaId: 0,
      nome: '',
      categoria: '',
      quantidadeAtual: 0,
      unidadeMedida: '',
      valorUnitarioReferencia: null
    };
  }

  categoriaClass(cat: string | null): string {
    const c = (cat ?? '').toUpperCase();
    if (c.includes('SEMENTE')) return 'bg-green-100 text-green-800';
    if (c.includes('FERTIL') || c.includes('UREIA')) return 'bg-lime-100 text-lime-800';
    if (c.includes('AGRO') || c.includes('HERB') || c.includes('INSET')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }
}
