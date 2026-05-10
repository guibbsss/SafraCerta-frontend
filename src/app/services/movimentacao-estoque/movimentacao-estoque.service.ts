import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MovimentacaoEstoque,
  MovimentacaoEstoqueRequest,
  TipoMovimentacaoEstoque
} from '../../models/movimentacao-estoque.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoEstoqueService {
  private apiUrl = `${environment.apiUrl}/movimentacoes-estoque`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MovimentacaoEstoque[]> {
    return this.http.get<MovimentacaoEstoque[]>(this.apiUrl);
  }

  getByTipo(tipo: TipoMovimentacaoEstoque): Observable<MovimentacaoEstoque[]> {
    return this.http.get<MovimentacaoEstoque[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  getById(id: number): Observable<MovimentacaoEstoque> {
    return this.http.get<MovimentacaoEstoque>(`${this.apiUrl}/${id}`);
  }

  create(body: MovimentacaoEstoqueRequest): Observable<MovimentacaoEstoque> {
    return this.http.post<MovimentacaoEstoque>(this.apiUrl, body);
  }

  update(id: number, body: MovimentacaoEstoqueRequest): Observable<MovimentacaoEstoque> {
    return this.http.put<MovimentacaoEstoque>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
