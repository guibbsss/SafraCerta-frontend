import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstoqueService } from '../../../services/estoque/estoque.service';
import { Estoque } from '../../../models/estoque.model';

@Component({
  selector: 'app-estoque-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque-list.component.html',
  styleUrls: ['./estoque-list.component.css']
})
export class EstoqueListComponent implements OnInit {
  estoques: Estoque[] = [];
  showForm = false;
  editMode = false;
  selectedEstoque: Estoque = this.getEmptyEstoque();

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.loadEstoques();
  }

  loadEstoques(): void {
    this.loadMockData();
    this.estoqueService.getAll().subscribe({
      next: (data) => this.estoques = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.estoques = [
      { id: 1, nome: 'Sementes de Soja', tipo: 'SEMENTE', quantidade: 500, unidade: 'kg', valorUnitario: 45.50, dataEntrada: new Date('2025-09-01'), fornecedor: 'AgroSementes Ltda' },
      { id: 2, nome: 'Fertilizante NPK 10-20-10', tipo: 'FERTILIZANTE', quantidade: 2000, unidade: 'kg', valorUnitario: 3.80, dataEntrada: new Date('2025-09-15'), fornecedor: 'Fertiliza Brasil' },
      { id: 3, nome: 'Herbicida Glifosato', tipo: 'AGROTOXICO', quantidade: 150, unidade: 'L', valorUnitario: 35.00, dataEntrada: new Date('2025-10-01'), fornecedor: 'Agro Defensivos S.A' },
      { id: 4, nome: 'Sementes de Milho Híbrido', tipo: 'SEMENTE', quantidade: 350, unidade: 'kg', valorUnitario: 52.00, dataEntrada: new Date('2025-10-10'), fornecedor: 'Sementes Premium' },
      { id: 5, nome: 'Inseticida Piretróide', tipo: 'AGROTOXICO', quantidade: 80, unidade: 'L', valorUnitario: 62.50, dataEntrada: new Date('2025-10-20'), fornecedor: 'Agro Defensivos S.A' },
      { id: 6, nome: 'Ureia Agrícola', tipo: 'FERTILIZANTE', quantidade: 1500, unidade: 'kg', valorUnitario: 2.90, dataEntrada: new Date('2025-11-01'), fornecedor: 'Fertiliza Brasil' },
      { id: 7, nome: 'Calcário Dolomítico', tipo: 'FERTILIZANTE', quantidade: 5000, unidade: 'kg', valorUnitario: 0.85, dataEntrada: new Date('2025-08-15'), fornecedor: 'Mineradora Central' },
      { id: 8, nome: 'Óleo Diesel S10', tipo: 'OUTRO', quantidade: 3000, unidade: 'L', valorUnitario: 5.45, dataEntrada: new Date('2026-01-10'), fornecedor: 'Posto AgroFuel' }
    ];
  }

  openForm(estoque?: Estoque): void {
    if (estoque) {
      this.editMode = true;
      this.selectedEstoque = { ...estoque };
    } else {
      this.editMode = false;
      this.selectedEstoque = this.getEmptyEstoque();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedEstoque = this.getEmptyEstoque();
  }

  saveEstoque(): void {
    if (this.editMode && this.selectedEstoque.id) {
      this.estoqueService.update(this.selectedEstoque.id, this.selectedEstoque).subscribe({
        next: () => {
          this.loadEstoques();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar estoque:', error)
      });
    } else {
      this.estoqueService.create(this.selectedEstoque).subscribe({
        next: () => {
          this.loadEstoques();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar estoque:', error)
      });
    }
  }

  deleteEstoque(id: number): void {
    if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
      this.estoqueService.delete(id).subscribe({
        next: () => this.loadEstoques(),
        error: (error) => console.error('Erro ao excluir estoque:', error)
      });
    }
  }

  private getEmptyEstoque(): Estoque {
    return {
      nome: '',
      tipo: 'SEMENTE',
      quantidade: 0,
      unidade: '',
      valorUnitario: 0,
      dataEntrada: new Date(),
      fornecedor: ''
    };
  }
}
