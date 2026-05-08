import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Financeiro } from '../../models/financeiro.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private apiUrl = `${environment.apiUrl}/financeiro`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Financeiro[]> {
    return this.http.get<Financeiro[]>(this.apiUrl);
  }

  getById(id: number): Observable<Financeiro> {
    return this.http.get<Financeiro>(`${this.apiUrl}/${id}`);
  }

  create(financeiro: Financeiro): Observable<Financeiro> {
    return this.http.post<Financeiro>(this.apiUrl, financeiro);
  }

  update(id: number, financeiro: Financeiro): Observable<Financeiro> {
    return this.http.put<Financeiro>(`${this.apiUrl}/${id}`, financeiro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getResumo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumo`);
  }
}
