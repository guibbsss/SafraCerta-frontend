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
    this.atividadeService.getAll().subscribe({
      next: (data) => this.atividades = data,
      error: (error) => console.error('Erro ao carregar atividades:', error)
    });
  }

  loadSafras(): void {
    this.safraService.getAll().subscribe({
      next: (data) => this.safras = data,
      error: (error) => console.error('Erro ao carregar safras:', error)
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
