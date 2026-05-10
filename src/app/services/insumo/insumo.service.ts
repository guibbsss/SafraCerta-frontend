import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Insumo, InsumoRequest } from '../../models/insumo.model';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  private apiUrl = `${environment.apiUrl}/insumos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  getByFazenda(fazendaId: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/fazenda/${fazendaId}`);
  }

  getById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  create(body: InsumoRequest): Observable<Insumo> {
    return this.http.post<Insumo>(this.apiUrl, body);
  }

  update(id: number, body: InsumoRequest): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
