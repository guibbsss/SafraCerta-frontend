export type SafraStatus = 'PLANTADA' | 'CRESCIMENTO' | 'COLHEITA' | 'FINALIZADA';

/** Resposta do backend (GET / safras). */
export interface SafraConsumoResposta {
  movimentacaoId: number;
  insumoId: number;
  insumoNome: string;
  quantidade: number;
}

/** Corpo opcional apenas na criação (POST /safras). */
export interface SafraConsumoInsumoPayload {
  insumoId: number;
  quantidade: number;
}

export interface Safra {
  id?: number;
  nome: string;
  talhaoId: number | null;
  talhaoNome?: string;
  cultura: string;
  status: SafraStatus;
  dataPlantio: string;
  dataColheitaPrevista: string;
  dataColheitaReal?: string;
  producaoEstimada?: number;
  producaoReal?: number;
  /** GET: movimentações registadas. POST (criação): `insumoId` + `quantidade`. */
  consumosInsumo?: SafraConsumoResposta[] | SafraConsumoInsumoPayload[];
}
