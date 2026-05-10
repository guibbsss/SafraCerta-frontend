export interface User {
  id?: number;
  email: string;
  password?: string;
  nome: string;
  token?: string;
  ativo?: boolean;
  perfilId?: number;
  permissaoIds?: number[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/** Payload enviado ao POST /auth/register */
export interface RegistroUsuarioPayload {
  nome: string;
  email: string;
  senha: string;
  codigoAcesso: string;
}

export interface RegistroUsuarioResponse {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  mensagem: string;
}
