import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fazenda } from '../../models/fazenda.model';

@Injectable({
  providedIn: 'root'
})
export class FazendaService {
  private apiUrl = `${environment.apiUrl}/fazendas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fazenda[]> {
    return this.http.get<Fazenda[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fazenda> {
    return this.http.get<Fazenda>(`${this.apiUrl}/${id}`);
  }

  create(fazenda: Fazenda): Observable<Fazenda> {
    return this.http.post<Fazenda>(this.apiUrl, fazenda);
  }

  update(id: number, fazenda: Fazenda): Observable<Fazenda> {
    return this.http.put<Fazenda>(`${this.apiUrl}/${id}`, fazenda);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
