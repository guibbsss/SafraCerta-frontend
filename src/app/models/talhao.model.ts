export interface Talhao {
  id?: number;
  nome: string;
  fazendaId: number;
  fazendaNome?: string;
  area: number;
  cultura: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO';
}
