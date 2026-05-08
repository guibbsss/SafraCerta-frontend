import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { Fazenda } from '../../../models/fazenda.model';

@Component({
  selector: 'app-fazenda-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fazenda-list.component.html',
  styleUrls: ['./fazenda-list.component.css']
})
export class FazendaListComponent implements OnInit {
  fazendas: Fazenda[] = [];
  showForm = false;
  editMode = false;
  selectedFazenda: Fazenda = this.getEmptyFazenda();

  constructor(private fazendaService: FazendaService) {}

  ngOnInit(): void {
    this.loadFazendas();
  }

  loadFazendas(): void {
    this.loadMockData();
    this.fazendaService.getAll().subscribe({
      next: (data) => this.fazendas = data,
      error: () => console.log('Backend indisponível. Mantendo dados mockados.')
    });
  }

  loadMockData(): void {
    this.fazendas = [
      { id: 1, nome: 'Fazenda Boa Vista', proprietario: 'João Silva', localizacao: 'Goiás - GO', areaTotal: 500 },
      { id: 2, nome: 'Fazenda Santa Clara', proprietario: 'Maria Santos', localizacao: 'Mato Grosso - MT', areaTotal: 850 },
      { id: 3, nome: 'Fazenda São Paulo', proprietario: 'Pedro Oliveira', localizacao: 'São Paulo - SP', areaTotal: 320 },
      { id: 4, nome: 'Fazenda Recanto Verde', proprietario: 'Ana Costa', localizacao: 'Minas Gerais - MG', areaTotal: 650 },
      { id: 5, nome: 'Fazenda Horizonte', proprietario: 'Carlos Lima', localizacao: 'Bahia - BA', areaTotal: 1200 }
    ];
  }

  openForm(fazenda?: Fazenda): void {
    if (fazenda) {
      this.editMode = true;
      this.selectedFazenda = { ...fazenda };
    } else {
      this.editMode = false;
      this.selectedFazenda = this.getEmptyFazenda();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedFazenda = this.getEmptyFazenda();
  }

  saveFazenda(): void {
    if (this.editMode && this.selectedFazenda.id) {
      this.fazendaService.update(this.selectedFazenda.id, this.selectedFazenda).subscribe({
        next: () => {
          this.loadFazendas();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao atualizar fazenda:', error)
      });
    } else {
      this.fazendaService.create(this.selectedFazenda).subscribe({
        next: () => {
          this.loadFazendas();
          this.closeForm();
        },
        error: (error) => console.error('Erro ao criar fazenda:', error)
      });
    }
  }

  deleteFazenda(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta fazenda?')) {
      this.fazendaService.delete(id).subscribe({
        next: () => this.loadFazendas(),
        error: (error) => console.error('Erro ao excluir fazenda:', error)
      });
    }
  }

  private getEmptyFazenda(): Fazenda {
    return {
      nome: '',
      localizacao: '',
      areaTotal: 0,
      proprietario: ''
    };
  }
}
