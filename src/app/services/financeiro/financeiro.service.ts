import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Financeiro,
  FinanceiroFiltro,
  FinanceiroResumo
} from '../../models/financeiro.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private apiUrl = `${environment.apiUrl}/transacoes-financeiras`;

  constructor(private http: HttpClient) {}

  list(filtro?: FinanceiroFiltro): Observable<Financeiro[]> {
    return this.http.get<Financeiro[]>(this.apiUrl, {
      params: this.buildParams(filtro)
    });
  }

  getResumo(filtro?: FinanceiroFiltro): Observable<FinanceiroResumo> {
    return this.http.get<FinanceiroResumo>(`${this.apiUrl}/resumo`, {
      params: this.buildParams(filtro)
    });
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

  delete(id: number, justificativa: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      body: { justificativa }
    });
  }

  private buildParams(filtro?: FinanceiroFiltro): HttpParams {
    let params = new HttpParams();
    if (!filtro) return params;
    if (filtro.fazendaId !== undefined && filtro.fazendaId !== null) {
      params = params.set('fazendaId', String(filtro.fazendaId));
    }
    if (filtro.tipo) {
      params = params.set('tipo', filtro.tipo);
    }
    if (filtro.status) {
      params = params.set('status', filtro.status);
    }
    if (filtro.dataInicio) {
      params = params.set('dataInicio', filtro.dataInicio);
    }
    if (filtro.dataFim) {
      params = params.set('dataFim', filtro.dataFim);
    }
    return params;
  }
}
