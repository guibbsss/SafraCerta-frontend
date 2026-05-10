export type StatusSolicitacao = 'SOLICITADO' | 'APROVADO';

/** Perfil atual do utilizador (espelha PerfilDoUsuarioDto no backend). */
export interface PerfilDoUsuario {
  id: number;
  nome: string;
}

export interface SolicitacaoEntradaLinha {
  usuarioId: number;
  nomeUsuario: string;
  fazendaId: number;
  nomeFazenda: string;
  perfil: PerfilDoUsuario;
  status: StatusSolicitacao;
}
