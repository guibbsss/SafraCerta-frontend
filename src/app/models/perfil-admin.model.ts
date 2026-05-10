/** API GET /perfis */
export interface PerfilResposta {
  id: number;
  nome: string;
  ativo: boolean;
  excluido: boolean;
}

/** API GET /perfis/{id}/matriz-permissoes */
export interface MatrizPermissaoItem {
  id: number;
  nome: string;
  descricao: string | null;
  concedida: boolean;
}

export interface MatrizCategoria {
  categoriaId: number;
  categoriaNome: string;
  permissoes: MatrizPermissaoItem[];
}

/** API GET /perfis/resumo-com-permissoes */
export interface ResumoPermissaoItem {
  nome: string;
  descricao: string | null;
}

export interface ResumoCategoriaPermissoes {
  nome: string;
  permissoes: ResumoPermissaoItem[];
}

export interface PerfilPermissaoResumo {
  perfilId: number;
  perfilNome: string;
  categorias: ResumoCategoriaPermissoes[];
}
