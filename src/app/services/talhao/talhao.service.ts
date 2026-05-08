import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Talhao } from '../../models/talhao.model';

@Injectable({
  providedIn: 'root'
})
export class TalhaoService {
  private apiUrl = `${environment.apiUrl}/talhoes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Talhao[]> {
    return this.http.get<Talhao[]>(this.apiUrl);
  }

  getById(id: number): Observable<Talhao> {
    return this.http.get<Talhao>(`${this.apiUrl}/${id}`);
  }

  getByFazenda(fazendaId: number): Observable<Talhao[]> {
    return this.http.get<Talhao[]>(`${this.apiUrl}/fazenda/${fazendaId}`);
  }

  create(talhao: Talhao): Observable<Talhao> {
    return this.http.post<Talhao>(this.apiUrl, talhao);
  }

  update(id: number, talhao: Talhao): Observable<Talhao> {
    return this.http.put<Talhao>(`${this.apiUrl}/${id}`, talhao);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
