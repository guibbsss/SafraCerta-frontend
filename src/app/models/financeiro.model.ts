export type TipoTransacaoFinanceira = 'RECEITA' | 'DESPESA';
export type StatusTransacaoFinanceira =
  | 'PENDENTE'
  | 'PAGO'
  | 'ATRASADO'
  | 'CANCELADO';

export interface Financeiro {
  id?: number;
  fazendaId: number | null;
  fazendaNome?: string;
  safraId?: number | null;
  safraNome?: string;
  tipo: TipoTransacaoFinanceira;
  valor: number | null;
  descricao: string;
  formaPagamento?: string;
  status: StatusTransacaoFinanceira;
  dataTransacao: string;
  dataVencimento?: string;
  dataPagamento?: string;
  categoria?: string;
  origem?: string;
  observacoes?: string;
}

export interface FinanceiroResumo {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeReceitas: number;
  quantidadeDespesas: number;
  quantidadePendentes: number;
  quantidadeAtrasadas: number;
}

export interface FinanceiroFiltro {
  fazendaId?: number | null;
  tipo?: TipoTransacaoFinanceira | null;
  status?: StatusTransacaoFinanceira | null;
  dataInicio?: string | null;
  dataFim?: string | null;
}
