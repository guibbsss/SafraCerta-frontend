import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TalhaoModel } from '../../models/talhao.model';

@Injectable({
  providedIn: 'root'
})
export class TalhaoService {
  private apiUrl = `${environment.apiUrl}/talhoes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TalhaoModel[]> {
    return this.http.get<TalhaoModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<TalhaoModel> {
    return this.http.get<TalhaoModel>(`${this.apiUrl}/${id}`);
  }

  getByFazenda(fazendaId: number): Observable<TalhaoModel[]> {
    return this.http.get<TalhaoModel[]>(`${this.apiUrl}/fazenda/${fazendaId}`);
  }

  create(talhao: TalhaoModel): Observable<TalhaoModel> {
    return this.http.post<TalhaoModel>(this.apiUrl, talhao);
  }

  update(id: number, talhao: TalhaoModel): Observable<TalhaoModel> {
    return this.http.put<TalhaoModel>(`${this.apiUrl}/${id}`, talhao);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
