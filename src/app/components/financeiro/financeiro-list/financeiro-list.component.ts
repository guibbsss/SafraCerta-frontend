import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceiroService } from '../../../services/financeiro/financeiro.service';
import { Financeiro } from '../../../models/financeiro.model';

@Component({
  selector: 'app-financeiro-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financeiro-list.component.html',
  styleUrls: ['./financeiro-list.component.css']
})
export class FinanceiroListComponent implements OnInit {
  financeiros: Financeiro[] = [];
  showForm = false;
  editMode = false;
  selectedFinanceiro: Financeiro = this.getEmptyFinanceiro();

  constructor(private financeiroService: FinanceiroService) {}

  ngOnInit(): void {
    this.loadFinanceiros();
  }

  loadFinanceiros(): void {
    this.loadMockData();
    this.financeiroService.getAll().subscribe({
      next: (data) => this.financeiros = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.financeiros = [
      { id: 1, tipo: 'RECEITA', descricao: 'Venda de Soja - Safra 2024/2025', valor: 450000, data: new Date('2025-04-15'), categoria: 'Venda de Produção', formaPagamento: 'À Vista', status: 'PAGO', observacoes: 'Pagamento à vista' },
      { id: 2, tipo: 'DESPESA', descricao: 'Compra de Sementes de Soja', valor: 22750, data: new Date('2025-09-01'), categoria: 'Insumos', formaPagamento: 'Boleto', status: 'PAGO', observacoes: 'Nota Fiscal 12345' },
      { id: 3, tipo: 'DESPESA', descricao: 'Compra de Fertilizante NPK', valor: 7600, data: new Date('2025-09-15'), categoria: 'Insumos', formaPagamento: 'Cartão', status: 'PAGO', observacoes: '' },
      { id: 4, tipo: 'RECEITA', descricao: 'Venda de Milho - Safra de Inverno', valor: 185000, data: new Date('2025-08-20'), categoria: 'Venda de Produção', formaPagamento: 'Parcelado', status: 'PAGO', observacoes: 'Pagamento parcelado 30/60 dias' },
      { id: 5, tipo: 'DESPESA', descricao: 'Manutenção de Trator', valor: 8500, data: new Date('2025-10-05'), categoria: 'Manutenção', formaPagamento: 'PIX', status: 'PAGO', observacoes: 'Troca de peças e revisão' },
      { id: 6, tipo: 'DESPESA', descricao: 'Salários e Encargos - Outubro', valor: 35000, data: new Date('2025-10-30'), categoria: 'Folha de Pagamento', formaPagamento: 'Transferência', status: 'PAGO', observacoes: '8 funcionários' },
      { id: 7, tipo: 'DESPESA', descricao: 'Energia Elétrica', valor: 4200, data: new Date('2025-11-10'), categoria: 'Serviços', formaPagamento: 'Débito Automático', status: 'PAGO', observacoes: 'Conta referente a Outubro' },
      { id: 8, tipo: 'RECEITA', descricao: 'Arrendamento Talhão D2', valor: 15000, data: new Date('2025-11-01'), categoria: 'Arrendamento', formaPagamento: 'Boleto', status: 'PENDENTE', observacoes: 'Contrato de 12 meses' },
      { id: 9, tipo: 'DESPESA', descricao: 'Compra de Defensivos Agrícolas', valor: 10250, data: new Date('2025-10-20'), categoria: 'Insumos', formaPagamento: 'À Vista', status: 'PAGO', observacoes: 'Herbicidas e Inseticidas' },
      { id: 10, tipo: 'DESPESA', descricao: 'Combustível - Diesel', valor: 16350, data: new Date('2026-01-10'), categoria: 'Combustível', formaPagamento: 'Cartão', status: 'PENDENTE', observacoes: '3000 litros' },
      { id: 11, tipo: 'RECEITA', descricao: 'Venda de Algodão', valor: 320000, data: new Date('2025-06-15'), categoria: 'Venda de Produção', formaPagamento: 'Transferência', status: 'PAGO', observacoes: 'Exportação' },
      { id: 12, tipo: 'DESPESA', descricao: 'IPTU Rural 2025', valor: 12000, data: new Date('2025-02-28'), categoria: 'Impostos', formaPagamento: 'Boleto', status: 'ATRASADO', observacoes: 'Todas as propriedades' }
    ];
  }

  openForm(financeiro?: Financeiro): void {
    if (financeiro) {
      this.editMode = true;
      this.selectedFinanceiro = { ...financeiro };
    } else {
      this.editMode = false;
      this.selectedFinanceiro = this.getEmptyFinanceiro();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedFinanceiro = this.getEmptyFinanceiro();
  }

  saveFinanceiro(): void {
    if (this.editMode && this.selectedFinanceiro.id) {
      this.financeiroService.update(this.selectedFinanceiro.id, this.selectedFinanceiro).subscribe({
        next: () => {
          this.loadFinanceiros();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar registro:', error)
      });
    } else {
      this.financeiroService.create(this.selectedFinanceiro).subscribe({
        next: () => {
          this.loadFinanceiros();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar registro:', error)
      });
    }
  }

  deleteFinanceiro(id: number): void {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      this.financeiroService.delete(id).subscribe({
        next: () => this.loadFinanceiros(),
        error: (error) => console.error('Erro ao excluir registro:', error)
      });
    }
  }

  getTotalReceitas(): number {
    return this.financeiros
      .filter(f => f.tipo === 'RECEITA')
      .reduce((sum, f) => sum + f.valor, 0);
  }

  getTotalDespesas(): number {
    return this.financeiros
      .filter(f => f.tipo === 'DESPESA')
      .reduce((sum, f) => sum + f.valor, 0);
  }

  getSaldo(): number {
    return this.getTotalReceitas() - this.getTotalDespesas();
  }

  private getEmptyFinanceiro(): Financeiro {
    return {
      tipo: 'RECEITA',
      categoria: '',
      descricao: '',
      valor: 0,
      data: new Date(),
      formaPagamento: '',
      status: 'PENDENTE'
    };
  }
}
