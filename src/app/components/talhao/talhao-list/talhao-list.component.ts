import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TalhaoService } from '../../../services/talhao/talhao.service';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
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

  constructor(
    private talhaoService: TalhaoService,
    private fazendaService: FazendaService
  ) {}

  ngOnInit(): void {
    this.loadTalhoes();
    this.loadFazendas();
  }

  loadTalhoes(): void {
    this.loadMockData();
    this.talhaoService.getAll().subscribe({
      next: (data) => this.talhoes = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.talhoes = [
      { id: 1, nome: 'Talhão A1', fazendaId: 1, fazendaNome: 'Fazenda Boa Vista', area: 50, cultura: 'Soja', status: 'EM_USO' },
      { id: 2, nome: 'Talhão A2', fazendaId: 1, fazendaNome: 'Fazenda Boa Vista', area: 75, cultura: 'Milho', status: 'DISPONIVEL' },
      { id: 3, nome: 'Talhão B1', fazendaId: 2, fazendaNome: 'Fazenda Santa Clara', area: 120, cultura: 'Algodão', status: 'EM_USO' },
      { id: 4, nome: 'Talhão B2', fazendaId: 2, fazendaNome: 'Fazenda Santa Clara', area: 90, cultura: 'Soja', status: 'EM_USO' },
      { id: 5, nome: 'Talhão C1', fazendaId: 3, fazendaNome: 'Fazenda São Paulo', area: 60, cultura: 'Café', status: 'MANUTENCAO' },
      { id: 6, nome: 'Talhão D1', fazendaId: 4, fazendaNome: 'Fazenda Recanto Verde', area: 85, cultura: 'Feijão', status: 'DISPONIVEL' }
    ];
  }

  loadFazendas(): void {
    this.fazendas = [
      { id: 1, nome: 'Fazenda Boa Vista', proprietario: 'João Silva', localizacao: 'Goiás - GO', areaTotal: 500 },
      { id: 2, nome: 'Fazenda Santa Clara', proprietario: 'Maria Santos', localizacao: 'Mato Grosso - MT', areaTotal: 850 },
      { id: 3, nome: 'Fazenda São Paulo', proprietario: 'Pedro Oliveira', localizacao: 'São Paulo - SP', areaTotal: 320 },
      { id: 4, nome: 'Fazenda Recanto Verde', proprietario: 'Ana Costa', localizacao: 'Minas Gerais - MG', areaTotal: 650 },
      { id: 5, nome: 'Fazenda Horizonte', proprietario: 'Carlos Lima', localizacao: 'Bahia - BA', areaTotal: 1200 }
    ];
    this.fazendaService.getAll().subscribe({
      next: (data) => this.fazendas = data,
      error: () => console.log('Backend indisponível. Mantendo fazendas mockadas no dropdown.')
    });
  }

  openForm(talhao?: Talhao): void {
    if (talhao) {
      this.editMode = true;
      this.selectedTalhao = { ...talhao };
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
    if (this.editMode && this.selectedTalhao.id) {
      this.talhaoService.update(this.selectedTalhao.id, this.selectedTalhao).subscribe({
        next: () => {
          this.loadTalhoes();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar talhão:', error)
      });
    } else {
      this.talhaoService.create(this.selectedTalhao).subscribe({
        next: () => {
          this.loadTalhoes();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar talhão:', error)
      });
    }
  }

  deleteTalhao(id: number): void {
    if (confirm('Tem certeza que deseja excluir este talhão?')) {
      this.talhaoService.delete(id).subscribe({
        next: () => this.loadTalhoes(),
        error: (error) => console.error('Erro ao excluir talhão:', error)
      });
    }
  }

  private getEmptyTalhao(): Talhao {
    return {
      nome: '',
      fazendaId: 0,
      area: 0,
      cultura: '',
      status: 'DISPONIVEL'
    };
  }
}
