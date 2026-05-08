export interface Fazenda {
  id?: number;
  nome: string;
  localizacao: string;
  areaTotal: number;
  proprietario: string;
  dataCadastro?: Date;
}
