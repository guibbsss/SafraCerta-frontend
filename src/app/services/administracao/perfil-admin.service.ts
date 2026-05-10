import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  MatrizCategoria,
  PerfilPermissaoResumo,
  PerfilResposta
} from '../../models/perfil-admin.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilAdminService {
  private readonly base = `${environment.apiUrl}/perfis`;

  constructor(private http: HttpClient) {}

  listarPerfis(): Observable<PerfilResposta[]> {
    return this.http.get<PerfilResposta[]>(this.base);
  }

  getMatrizPermissoes(perfilId: number): Observable<MatrizCategoria[]> {
    return this.http.get<MatrizCategoria[]>(`${this.base}/${perfilId}/matriz-permissoes`);
  }

  definirPermissao(perfilId: number, permissaoId: number, ativo: boolean): Observable<void> {
    return this.http.put<void>(`${this.base}/${perfilId}/permissoes/${permissaoId}`, {
      ativo
    });
  }

  getResumoComPermissoes(): Observable<PerfilPermissaoResumo[]> {
    return this.http.get<PerfilPermissaoResumo[]>(`${this.base}/resumo-com-permissoes`);
  }

  criarPerfil(nome: string): Observable<PerfilResposta> {
    return this.http.post<PerfilResposta>(this.base, { nome });
  }
}
