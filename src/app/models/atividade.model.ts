/** Alinhado ao backend: AtividadeAgricolaRequestDto / ResponseDto */
export interface Atividade {
  id?: number;
  talhaoId: number | null;
  talhaoNome?: string | null;
  tipoOperacao: string;
  dataAtividade: string;
  descricao?: string | null;
}
