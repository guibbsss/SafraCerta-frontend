export type TipoMovimentacaoEstoque = 'ENTRADA' | 'SAIDA';

export interface MovimentacaoEstoque {
  id?: number;
  insumoId: number;
  insumoNome: string;
  fazendaId: number;
  fazendaNome: string;
  categoria: string | null;
  tipoMovimentacao: TipoMovimentacaoEstoque;
  quantidade: number;
  valorUnitario: number | null;
  valorTotal: number | null;
  dataMovimentacao: string;
  observacao: string | null;
  fornecedor: string | null;
}

export interface MovimentacaoEstoqueRequest {
  fazendaId?: number | null;
  insumoId: number;
  tipoMovimentacao: TipoMovimentacaoEstoque;
  quantidade: number;
  dataMovimentacao: string;
  observacao?: string | null;
  valorUnitario?: number | null;
  fornecedor?: string | null;
}
