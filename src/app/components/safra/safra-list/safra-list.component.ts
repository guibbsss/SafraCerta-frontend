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

  constructor(
    private safraService: SafraService,
    private talhaoService: TalhaoService
  ) {}

  ngOnInit(): void {
    this.loadSafras();
    this.loadTalhoes();
  }

  loadSafras(): void {
    this.loadMockData();
    this.safraService.getAll().subscribe({
      next: (data) => this.safras = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.safras = [
      { id: 1, nome: 'Safra Soja 2025/2026', talhaoId: 1, talhaoNome: 'Talhão A1', cultura: 'Soja', dataPlantio: new Date('2025-10-15'), dataColheitaPrevista: new Date('2026-03-20'), producaoEstimada: 150, producaoReal: 0, status: 'CRESCIMENTO' },
      { id: 2, nome: 'Safra Milho Verão', talhaoId: 2, talhaoNome: 'Talhão A2', cultura: 'Milho', dataPlantio: new Date('2025-11-01'), dataColheitaPrevista: new Date('2026-04-15'), producaoEstimada: 200, producaoReal: 0, status: 'CRESCIMENTO' },
      { id: 3, nome: 'Safra Algodão 2025', talhaoId: 3, talhaoNome: 'Talhão B1', cultura: 'Algodão', dataPlantio: new Date('2025-09-20'), dataColheitaPrevista: new Date('2026-05-10'), producaoEstimada: 180, producaoReal: 0, status: 'COLHEITA' },
      { id: 4, nome: 'Safra Soja 2024/2025', talhaoId: 4, talhaoNome: 'Talhão B2', cultura: 'Soja', dataPlantio: new Date('2024-10-10'), dataColheitaPrevista: new Date('2025-03-15'), producaoEstimada: 165, producaoReal: 170, status: 'FINALIZADA' },
      { id: 5, nome: 'Safra Café 2025', talhaoId: 5, talhaoNome: 'Talhão C1', cultura: 'Café', dataPlantio: new Date('2025-01-15'), dataColheitaPrevista: new Date('2025-12-30'), producaoEstimada: 90, producaoReal: 0, status: 'PLANTADA' }
    ];
  }

  loadTalhoes(): void {
    this.talhoes = [
      { id: 1, nome: 'Talhão A1', fazendaId: 1, fazendaNome: 'Fazenda Boa Vista', area: 50, cultura: 'Soja', status: 'EM_USO' },
      { id: 2, nome: 'Talhão A2', fazendaId: 1, fazendaNome: 'Fazenda Boa Vista', area: 75, cultura: 'Milho', status: 'DISPONIVEL' },
      { id: 3, nome: 'Talhão B1', fazendaId: 2, fazendaNome: 'Fazenda Santa Clara', area: 120, cultura: 'Algodão', status: 'EM_USO' },
      { id: 4, nome: 'Talhão B2', fazendaId: 2, fazendaNome: 'Fazenda Santa Clara', area: 90, cultura: 'Soja', status: 'EM_USO' },
      { id: 5, nome: 'Talhão C1', fazendaId: 3, fazendaNome: 'Fazenda São Paulo', area: 60, cultura: 'Café', status: 'MANUTENCAO' },
      { id: 6, nome: 'Talhão D1', fazendaId: 4, fazendaNome: 'Fazenda Recanto Verde', area: 85, cultura: 'Feijão', status: 'DISPONIVEL' }
    ];
    this.talhaoService.getAll().subscribe({
      next: (data) => this.talhoes = data,
      error: () => console.log('Backend indisponível. Mantendo talhões mockados no dropdown.')
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
    if (this.editMode && this.selectedSafra.id) {
      this.safraService.update(this.selectedSafra.id, this.selectedSafra).subscribe({
        next: () => {
          this.loadSafras();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar safra:', error)
      });
    } else {
      this.safraService.create(this.selectedSafra).subscribe({
        next: () => {
          this.loadSafras();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar safra:', error)
      });
    }
  }

  deleteSafra(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta safra?')) {
      this.safraService.delete(id).subscribe({
        next: () => this.loadSafras(),
        error: (error) => console.error('Erro ao excluir safra:', error)
      });
    }
  }

  private getEmptySafra(): Safra {
    return {
      nome: '',
      talhaoId: 0,
      cultura: '',
      dataPlantio: new Date(),
      dataColheitaPrevista: new Date(),
      status: 'PLANTADA',
      producaoEstimada: 0
    };
  }
}
