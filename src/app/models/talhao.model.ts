export interface Talhao {
  id?: number;
  fazendaId: number | null;
  fazendaNome?: string;
  nome: string;
  areaHectares: number | null;
  tipoCultivo: string;
}
