import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Atividade } from '../../models/atividade.model';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiUrl);
  }

  getById(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`);
  }

  getBySafra(safraId: number): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(`${this.apiUrl}/safra/${safraId}`);
  }

  create(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiUrl, atividade);
  }

  update(id: number, atividade: Atividade): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.apiUrl}/${id}`, atividade);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
