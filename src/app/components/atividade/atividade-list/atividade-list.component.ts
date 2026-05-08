import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtividadeService } from '../../../services/atividade/atividade.service';
import { SafraService } from '../../../services/safra/safra.service';
import { Atividade } from '../../../models/atividade.model';
import { Safra } from '../../../models/safra.model';

@Component({
  selector: 'app-atividade-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividade-list.component.html',
  styleUrls: ['./atividade-list.component.css']
})
export class AtividadeListComponent implements OnInit {
  atividades: Atividade[] = [];
  safras: Safra[] = [];
  showForm = false;
  editMode = false;
  selectedAtividade: Atividade = this.getEmptyAtividade();

  constructor(
    private atividadeService: AtividadeService,
    private safraService: SafraService
  ) {}

  ngOnInit(): void {
    this.loadAtividades();
    this.loadSafras();
  }

  loadAtividades(): void {
    this.loadMockData();
    this.atividadeService.getAll().subscribe({
      next: (data) => this.atividades = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.atividades = [
      { id: 1, safraId: 1, safraNome: 'Safra Soja 2025/2026', tipo: 'Plantio', descricao: 'Plantio de sementes de soja certificadas', data: new Date('2025-10-15'), custo: 15000, responsavel: 'João Silva' },
      { id: 2, safraId: 1, safraNome: 'Safra Soja 2025/2026', tipo: 'Adubação', descricao: 'Aplicação de fertilizante NPK', data: new Date('2025-11-01'), custo: 8500, responsavel: 'Maria Santos' },
      { id: 3, safraId: 1, safraNome: 'Safra Soja 2025/2026', tipo: 'Irrigação', descricao: 'Irrigação por aspersão - ciclo 1', data: new Date('2025-11-15'), custo: 3200, responsavel: 'Pedro Oliveira' },
      { id: 4, safraId: 2, safraNome: 'Safra Milho Verão', tipo: 'Plantio', descricao: 'Plantio de milho híbrido', data: new Date('2025-11-01'), custo: 12000, responsavel: 'Ana Costa' },
      { id: 5, safraId: 3, safraNome: 'Safra Algodão 2025', tipo: 'Controle de Pragas', descricao: 'Aplicação de defensivos contra lagarta', data: new Date('2025-12-10'), custo: 7800, responsavel: 'Carlos Lima' },
      { id: 6, safraId: 2, safraNome: 'Safra Milho Verão', tipo: 'Adubação de Cobertura', descricao: 'Aplicação de ureia', data: new Date('2025-12-05'), custo: 5500, responsavel: 'João Silva' },
      { id: 7, safraId: 3, safraNome: 'Safra Algodão 2025', tipo: 'Colheita', descricao: 'Início da colheita mecanizada', data: new Date('2026-05-10'), custo: 18000, responsavel: 'Maria Santos' }
    ];
  }

  loadSafras(): void {
    this.safras = [
      { id: 1, nome: 'Safra Soja 2025/2026', talhaoId: 1, talhaoNome: 'Talhão A1', cultura: 'Soja', dataPlantio: new Date('2025-10-15'), dataColheitaPrevista: new Date('2026-03-20'), producaoEstimada: 150, producaoReal: 0, status: 'CRESCIMENTO' },
      { id: 2, nome: 'Safra Milho Verão', talhaoId: 2, talhaoNome: 'Talhão A2', cultura: 'Milho', dataPlantio: new Date('2025-11-01'), dataColheitaPrevista: new Date('2026-04-15'), producaoEstimada: 200, producaoReal: 0, status: 'CRESCIMENTO' },
      { id: 3, nome: 'Safra Algodão 2025', talhaoId: 3, talhaoNome: 'Talhão B1', cultura: 'Algodão', dataPlantio: new Date('2025-09-20'), dataColheitaPrevista: new Date('2026-05-10'), producaoEstimada: 180, producaoReal: 0, status: 'COLHEITA' },
      { id: 4, nome: 'Safra Soja 2024/2025', talhaoId: 4, talhaoNome: 'Talhão B2', cultura: 'Soja', dataPlantio: new Date('2024-10-10'), dataColheitaPrevista: new Date('2025-03-15'), producaoEstimada: 165, producaoReal: 170, status: 'FINALIZADA' },
      { id: 5, nome: 'Safra Café 2025', talhaoId: 5, talhaoNome: 'Talhão C1', cultura: 'Café', dataPlantio: new Date('2025-01-15'), dataColheitaPrevista: new Date('2025-12-30'), producaoEstimada: 90, producaoReal: 0, status: 'PLANTADA' }
    ];
    this.safraService.getAll().subscribe({
      next: (data) => this.safras = data,
      error: () => console.log('Backend indisponível. Mantendo safras mockadas no dropdown.')
    });
  }

  openForm(atividade?: Atividade): void {
    if (atividade) {
      this.editMode = true;
      this.selectedAtividade = { ...atividade };
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
    if (this.editMode && this.selectedAtividade.id) {
      this.atividadeService.update(this.selectedAtividade.id, this.selectedAtividade).subscribe({
        next: () => {
          this.loadAtividades();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar atividade:', error)
      });
    } else {
      this.atividadeService.create(this.selectedAtividade).subscribe({
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

  private getEmptyAtividade(): Atividade {
    return {
      safraId: 0,
      tipo: '',
      descricao: '',
      data: new Date(),
      custo: 0,
      responsavel: ''
    };
  }
}
