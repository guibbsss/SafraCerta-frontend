/** IDs alinhados à tabela `permissao` (visualização + ações + dashboard). */
export const P = {
  VER_TALHAO: 15,
  VER_SAFRA: 16,
  VER_FAZENDA: 17,
  VER_ATIVIDADES: 18,
  VER_ESTOQUE: 19,
  VER_FINANCEIRO: 20,
  VER_ADMINISTRACAO: 21,
  EDITAR: 22,
  EXCLUIR: 23,
  CRIAR: 24,
  VER_DASHBOARD: 25
} as const;

export type PermissaoId = (typeof P)[keyof typeof P];
