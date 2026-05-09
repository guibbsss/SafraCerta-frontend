import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FazendaService } from '../../../services/fazenda/fazenda.service';
import { AuthService } from '../../../services/auth/auth.service';
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

  constructor(
    private fazendaService: FazendaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFazendas();
  }

  loadFazendas(): void {
    const usuarioId = this.authService.getCurrentUserId() ?? 1;
    this.fazendaService.getAllByUsuario(usuarioId).subscribe({
      next: (data) => (this.fazendas = data),
      error: () => {
        console.log('Backend indisponível ou usuário sem fazendas.');
        this.fazendas = [];
      }
    });
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
    if (this.editMode && this.selectedFazenda.id != null) {
      this.fazendaService
        .update(this.selectedFazenda.id, {
          nome: this.selectedFazenda.nome,
          localizacao: this.selectedFazenda.localizacao,
          areaTotal: this.selectedFazenda.areaTotal
        })
        .subscribe({
          next: () => {
            this.loadFazendas();
            this.closeForm();
          },
          error: (error) => console.error('Erro ao atualizar fazenda:', error)
        });
    } else {
      let proprietarioId = this.authService.getCurrentUserId();
      if (proprietarioId == null) {
        proprietarioId = 1;
        console.warn(
          'Usuário sem id no perfil; usando proprietarioId=1 (apenas desenvolvimento).'
        );
      }
      this.fazendaService
        .create({
          nome: this.selectedFazenda.nome,
          localizacao: this.selectedFazenda.localizacao,
          areaTotal: this.selectedFazenda.areaTotal,
          proprietarioId
        })
        .subscribe({
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
      areaTotal: 0
    };
  }
}
