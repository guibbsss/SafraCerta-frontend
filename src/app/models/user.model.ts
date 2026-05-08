export interface User {
  id?: number;
  email: string;
  password?: string;
  nome: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
