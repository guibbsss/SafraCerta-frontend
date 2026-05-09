export type SafraStatus = 'PLANTADA' | 'CRESCIMENTO' | 'COLHEITA' | 'FINALIZADA';

export interface Safra {
  id?: number;
  nome: string;
  talhaoId?: number | null;
  talhaoNome?: string;
  cultura: string;
  status: SafraStatus;
  dataPlantio: string;
  dataColheitaPrevista: string;
  dataColheitaReal?: string;
  producaoEstimada?: number;
  producaoReal?: number;
}
