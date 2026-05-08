export interface Atividade {
  id?: number;
  safraId: number;
  safraNome?: string;
  tipo: string;
  descricao: string;
  data: Date;
  custo: number;
  responsavel: string;
}
