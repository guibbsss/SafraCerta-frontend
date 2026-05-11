# Safra Certa — Frontend

SPA do sistema **Safra Certa** (gestão rural), construída em **Angular 20**, **TypeScript**
e **Tailwind CSS**. Consome a API REST do backend
[SafraCerta-Backend](https://github.com/guibbsss/SafraCerta-Backend).

Documentação de entrega (manual, testes, slides, doc técnica): **[SafraCerta-docs](https://github.com/guibbsss/SafraCerta-docs)** — release sugerida: tag **`v1.0-mvp`**.

---

## 1. Stack

| Camada       | Tecnologia                  |
| ------------ | --------------------------- |
| Framework    | Angular 20.2                |
| Linguagem    | TypeScript 5.8              |
| Reatividade  | RxJS 7.8                    |
| Estilo       | Tailwind CSS 3.4            |
| Testes       | Karma + Jasmine             |
| Build        | Angular CLI 20.2            |

---

## 2. Pré-requisitos

- **Node.js 20+** e **npm 10+**.
- **Angular CLI** (opcional globalmente — também roda via `npx`):
  ```bash
  npm install -g @angular/cli@20
  ```
- Backend rodando em `http://localhost:8080/api` (ou ajuste em `src/environments/`).

---

## 3. Instalação

```powershell
git clone https://github.com/guibbsss/SafraCerta-frontend.git
cd SafraCerta-frontend
npm install
```

---

## 4. Como rodar

```powershell
# Servidor de desenvolvimento (http://localhost:4200, recarrega ao salvar)
npm start

# Build de produção (saída em dist/)
npm run build

# Testes unitários (Karma + Jasmine)
npm test
```

Para CI ou execução em headless:

```powershell
npm test -- --watch=false --browsers=ChromeHeadless
```

São executados **10 testes** nos serviços `AuthService` e `FinanceiroService` (`*.spec.ts` em `src/app/services/`).

---

## 5. Configuração de ambiente

Arquivos em `src/environments/`:

```ts
// environment.ts (dev)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  registroPerfilId: 2
};
```

Em produção, ajuste `environment.prod.ts` apontando para a URL pública da API.

---

## 6. Rotas reais da aplicação

| Rota                          | Descrição                                            |
| ----------------------------- | ---------------------------------------------------- |
| `/login`                      | Tela de login.                                       |
| `/cadastro`                   | Auto-cadastro (perfil padrão: cliente).              |
| `/home`                       | Página inicial após login.                           |
| `/dashboard`                  | Indicadores e cards de resumo.                       |
| `/fazendas`                   | CRUD de fazendas.                                    |
| `/talhoes`                    | CRUD de talhões (vinculados à fazenda).              |
| `/safras`                     | CRUD de safras + soft-delete com justificativa.      |
| `/atividades`                 | Atividades agrícolas por talhão.                     |
| `/estoque`                    | Hub de estoque (insumos + movimentações).            |
| `/estoque/atual`              | Saldo atual por insumo.                              |
| `/estoque/entradas`           | Movimentações de entrada.                            |
| `/estoque/saidas`             | Movimentações de saída.                              |
| `/financeiro`                 | Transações financeiras + cards de resumo.            |
| `/administracao`              | Hub administrativo.                                  |
| `/administracao/perfis`       | Gestão de perfis.                                    |
| `/administracao/permissoes`   | Gestão de permissões.                                |
| `/administracao/solicitacoes` | Solicitações de entrada em fazendas.                 |

Todas as rotas (exceto `/login` e `/cadastro`) estão protegidas por `authGuard`. Rotas
de módulos também passam por `permissaoGuard`, exigindo a permissão correspondente.

---

## 7. Endpoints REST consumidos

Base: `http://localhost:8080/api`

| Recurso              | Rotas                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| Disponibilidade      | `GET /health` (verifica se a API está no ar)                          |
| Autenticação         | `POST /auth/login`, `POST /auth/register`, `GET /auth/me`             |
| Fazendas             | `GET/POST/PUT/DELETE /fazendas`                                       |
| Talhões              | `GET/POST/PUT/DELETE /talhoes`                                        |
| Safras               | `GET/POST/PUT /safras`, `DELETE /safras/{id}` (com justificativa)     |
| Atividades agrícolas | `GET/POST/PUT/DELETE /atividades-agricolas`                           |
| Insumos              | `GET/POST/PUT/DELETE /insumos`                                        |
| Estoque              | `GET/POST /movimentacoes-estoque`                                     |
| Financeiro           | `GET/POST/PUT /transacoes-financeiras`, `GET /transacoes-financeiras/resumo`, `DELETE /transacoes-financeiras/{id}` |
| Administração        | `/perfis`, `/permissoes`, `/usuarios`, `/solicitacoes-entrada`        |

> **Importante**: o nome antigo `/financeiro` foi substituído por `/transacoes-financeiras`
> no backend. Toda a SPA já usa o nome novo.

---

## 8. Autenticação

- O token JWT fica no `localStorage` na chave **`token`**. O usuário serializado fica em **`currentUser`** (JSON).
- `AuthService.refreshCurrentUser()` chama `GET /auth/me` após login ou quando há token em cache, para alinhar permissões com o servidor.
- `auth.interceptor.ts` injeta `Authorization: Bearer <token>` em todas as requisições para a API.
- `authGuard` redireciona para `/login` quando não há sessão (ausência de token).

---

## 9. Estrutura do projeto

```
src/
├── app/
│   ├── components/
│   │   ├── auth/                 # login, register
│   │   ├── layout/               # main-layout, sidebar
│   │   ├── home/
│   │   ├── dashboard/
│   │   ├── fazenda/
│   │   ├── talhao/
│   │   ├── safra/
│   │   ├── atividade/
│   │   ├── estoque/              # shell + hub + atual + movimentacao
│   │   ├── financeiro/           # lista + form + cards + filtros
│   │   └── administracao/
│   ├── services/                 # http services por módulo (auth, fazenda, ...)
│   ├── models/                   # interfaces TS alinhadas aos DTOs do backend
│   ├── guards/                   # auth.guard, permissao.guard
│   ├── interceptors/             # auth.interceptor
│   ├── constants/                # permissões, listas estáticas
│   └── app.routes.ts
├── environments/                 # environment.ts / environment.prod.ts
└── styles.css
```

---

## 10. Notas

- **Tailwind CSS** já configurado em `tailwind.config.js`.
- As cores da identidade visual são: verde `#2e7d32`, amarelo `#fbc02d`, azul `#1976d2`.
- A SPA é mobile-first responsiva, com sidebar adaptável.
- Validações de formulário (datas, máscaras numéricas, tamanho máximo, regex) acontecem
  no client; o backend revalida.
- **Problemas comuns**: se a API não responder, confira `GET http://localhost:8080/api/health` no navegador; deve retornar `{"status":"UP"}`. Verifique `environment.apiUrl` e CORS no backend.
- Para o pacote de entrega (PDFs, plano de testes, manual), use o repositório [`SafraCerta-docs`](https://github.com/guibbsss/SafraCerta-docs).
