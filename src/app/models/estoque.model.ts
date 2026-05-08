export interface Estoque {
  id?: number;
  nome: string;
  tipo: 'SEMENTE' | 'FERTILIZANTE' | 'AGROTOXICO' | 'EQUIPAMENTO' | 'OUTRO';
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  dataEntrada: Date;
  fornecedor: string;
}
