export interface Safra {
  id?: number;
  nome: string;
  talhaoId: number;
  talhaoNome?: string;
  cultura: string;
  dataPlantio: Date;
  dataColheitaPrevista: Date;
  status: 'PLANTADA' | 'CRESCIMENTO' | 'COLHEITA' | 'FINALIZADA';
  producaoEstimada: number;
  producaoReal?: number;
}
