import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Fazenda,
  FazendaCreatePayload,
  FazendaUpdatePayload
} from '../../models/fazenda.model';

@Injectable({
  providedIn: 'root'
})
export class FazendaService {
  private apiUrl = `${environment.apiUrl}/fazendas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fazenda[]> {
    return this.http.get<Fazenda[]>(this.apiUrl);
  }

  /** Fazendas vinculadas ao usuário (tabela fazenda_has_usuario). */
  getAllByUsuario(usuarioId: number): Observable<Fazenda[]> {
    return this.http.get<Fazenda[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getById(id: number): Observable<Fazenda> {
    return this.http.get<Fazenda>(`${this.apiUrl}/${id}`);
  }

  create(payload: FazendaCreatePayload): Observable<Fazenda> {
    return this.http.post<Fazenda>(this.apiUrl, payload);
  }

  update(id: number, payload: FazendaUpdatePayload): Observable<Fazenda> {
    return this.http.put<Fazenda>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
