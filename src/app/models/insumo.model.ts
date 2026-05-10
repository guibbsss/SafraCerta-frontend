export interface Insumo {
  id?: number;
  fazendaId: number;
  fazendaNome: string;
  nome: string;
  categoria: string | null;
  quantidadeAtual: number;
  unidadeMedida: string;
  valorUnitarioReferencia: number | null;
  valorTotalEstimado: number | null;
}

export interface InsumoRequest {
  fazendaId: number;
  nome: string;
  categoria?: string | null;
  quantidadeAtual: number;
  unidadeMedida: string;
  valorUnitarioReferencia?: number | null;
}
