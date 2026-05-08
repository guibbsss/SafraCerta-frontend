export interface Financeiro {
  id?: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  descricao: string;
  valor: number;
  data: Date;
  formaPagamento: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  observacoes?: string;
}
