import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FazendaService } from '../../services/fazenda/fazenda.service';
import { SafraService } from '../../services/safra/safra.service';
import { FinanceiroService } from '../../services/financeiro/financeiro.service';
import { EstoqueService } from '../../services/estoque/estoque.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalFazendas: 0,
    totalSafras: 0,
    safrasAtivas: 0,
    totalEstoque: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  };

  constructor(
    private fazendaService: FazendaService,
    private safraService: SafraService,
    private financeiroService: FinanceiroService,
    private estoqueService: EstoqueService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadMockData();

    this.fazendaService.getAll().subscribe({
      next: (data) => this.stats.totalFazendas = data.length,
      error: () => console.log('Backend indisponível. Mantendo estatísticas mockadas.')
    });

    this.safraService.getAll().subscribe({
      next: (data) => {
        this.stats.totalSafras = data.length;
        this.stats.safrasAtivas = data.filter(s => s.status === 'PLANTADA' || s.status === 'CRESCIMENTO').length;
      },
      error: (error) => {
        this.stats.totalSafras = 5;
        this.stats.safrasAtivas = 3;
      }
    });

    this.estoqueService.getAll().subscribe({
      next: (data) => {
        this.stats.totalEstoque = data.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
      },
      error: (error) => {
        this.stats.totalEstoque = 83750;
      }
    });

    this.financeiroService.getAll().subscribe({
      next: (data) => {
        this.stats.totalReceitas = data.filter(f => f.tipo === 'RECEITA').reduce((sum, f) => sum + f.valor, 0);
        this.stats.totalDespesas = data.filter(f => f.tipo === 'DESPESA').reduce((sum, f) => sum + f.valor, 0);
        this.stats.saldo = this.stats.totalReceitas - this.stats.totalDespesas;
      },
      error: (error) => {
        this.stats.totalReceitas = 970000;
        this.stats.totalDespesas = 124650;
        this.stats.saldo = this.stats.totalReceitas - this.stats.totalDespesas;
      }
    });
  }

  loadMockData(): void {
    this.stats = {
      totalFazendas: 5,
      totalSafras: 5,
      safrasAtivas: 3,
      totalEstoque: 83750,
      totalReceitas: 970000,
      totalDespesas: 124650,
      saldo: 845350
    };
  }
}
