import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  PerfilDoUsuario,
  SolicitacaoEntradaLinha,
  StatusSolicitacao
} from '../../models/solicitacao-entrada.model';

export interface AprovarEntradaPayload {
  proprietarioUsuarioId: number;
  usuarioId: number;
  fazendaId: number;
  perfilId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoEntradaService {
  private readonly base = `${environment.apiUrl}/solicitacoes-entrada`;

  constructor(private http: HttpClient) {}

  listar(proprietarioUsuarioId: number): Observable<SolicitacaoEntradaLinha[]> {
    const params = new HttpParams().set('proprietarioUsuarioId', String(proprietarioUsuarioId));
    return this.http.get<unknown[]>(this.base, { params }).pipe(
      map((rows) => rows.map((r) => SolicitacaoEntradaService.normalizarLinha(r)))
    );
  }

  private static normalizarLinha(raw: unknown): SolicitacaoEntradaLinha {
    const o = raw as Record<string, unknown>;
    const str = (camel: string, snake: string) =>
      String(o[camel] ?? o[snake] ?? '');
    const num = (camel: string, snake: string) =>
      Number(o[camel] ?? o[snake] ?? NaN);
    const statusRaw = String(o['status'] ?? '');
    const status: StatusSolicitacao =
      statusRaw === 'APROVADO' ? 'APROVADO' : 'SOLICITADO';

    const perfilNested = o['perfil'] as Record<string, unknown> | undefined;
    let perfil: PerfilDoUsuario;
    if (perfilNested && typeof perfilNested === 'object') {
      perfil = {
        id: Number(perfilNested['id'] ?? perfilNested['perfilId']),
        nome: String(perfilNested['nome'] ?? perfilNested['perfilNome'] ?? '')
      };
    } else {
      perfil = {
        id: num('perfilId', 'perfil_id'),
        nome: str('perfilNome', 'perfil_nome')
      };
    }

    return {
      usuarioId: num('usuarioId', 'usuario_id'),
      nomeUsuario: str('nomeUsuario', 'nome_usuario'),
      fazendaId: num('fazendaId', 'fazenda_id'),
      nomeFazenda: str('nomeFazenda', 'nome_fazenda'),
      perfil,
      status
    };
  }

  aprovar(payload: AprovarEntradaPayload): Observable<void> {
    return this.http.post<void>(`${this.base}/aprovar`, payload);
  }
}
