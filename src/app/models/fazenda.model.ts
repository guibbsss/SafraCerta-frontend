export interface Fazenda {
  id?: number;
  nome: string;
  localizacao: string;
  areaTotal: number;
  codigoAcesso?: string;
  proprietarioId?: number;
}

/** Corpo enviado no POST /fazendas */
export interface FazendaCreatePayload {
  nome: string;
  localizacao: string;
  areaTotal: number;
  proprietarioId: number;
}

/** Corpo enviado no PUT /fazendas/:id */
export interface FazendaUpdatePayload {
  nome: string;
  localizacao: string;
  areaTotal: number;
}
