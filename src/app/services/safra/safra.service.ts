import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Safra } from '../../models/safra.model';

@Injectable({
  providedIn: 'root'
})
export class SafraService {
  private apiUrl = `${environment.apiUrl}/safras`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Safra[]> {
    return this.http.get<Safra[]>(this.apiUrl);
  }

  getById(id: number): Observable<Safra> {
    return this.http.get<Safra>(`${this.apiUrl}/${id}`);
  }

  getByTalhao(talhaoId: number): Observable<Safra[]> {
    return this.http.get<Safra[]>(`${this.apiUrl}/talhao/${talhaoId}`);
  }

  create(safra: Safra): Observable<Safra> {
    return this.http.post<Safra>(this.apiUrl, safra);
  }

  update(id: number, safra: Safra): Observable<Safra> {
    return this.http.put<Safra>(`${this.apiUrl}/${id}`, safra);
  }

  delete(id: number, justificativa: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      body: { justificativa }
    });
  }
}
