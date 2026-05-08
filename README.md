# 🌾 Safra Certa - Frontend

Sistema completo de gestão de fazendas desenvolvido em Angular 20.2.0 com design responsivo e moderno.

## 🎨 Paleta de Cores

- **Verde Primário**: #2e7d32
- **Amarelo Secundário**: #fbc02d
- **Azul de Destaque**: #1976d2

## 📋 Funcionalidades

- ✅ Sistema de Login/Autenticação
- ✅ Cadastro e gestão de Fazendas
- ✅ Cadastro e controle de Talhões
- ✅ Gestão de Safras com acompanhamento de status
- ✅ Registro de Atividades Agrícolas
- ✅ Controle de Estoque de Insumos
- ✅ Controle Financeiro (Receitas e Despesas)
- ✅ Dashboard com Relatórios e Indicadores
- ✅ Design Responsivo para Desktop, Tablet e Mobile
- ✅ Sidebar com Navegação Intuitiva

## 🚀 Tecnologias Utilizadas

- **Angular**: 20.2.0
- **TypeScript**: 5.6.0
- **RxJS**: 7.8.0
- **Angular Router**: Navegação SPA
- **HttpClient**: Comunicação com API REST

## 📦 Pré-requisitos

- Node.js 18+ ou superior
- npm ou yarn
- Angular CLI 20.2.0

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/SafraCerta-frontend.git
cd SafraCerta-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

O projeto já está configurado para conectar com o backend em `http://localhost:8080/api`.

Você pode modificar essa configuração nos arquivos:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

### 4. Execute o projeto

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   │   ├── auth/           # Login e autenticação
│   │   ├── layout/         # Layout principal com sidebar
│   │   ├── home/           # Página inicial
│   │   ├── dashboard/      # Dashboard com relatórios
│   │   ├── fazenda/        # Gestão de fazendas
│   │   ├── talhao/         # Gestão de talhões
│   │   ├── safra/          # Gestão de safras
│   │   ├── atividade/      # Registro de atividades
│   │   ├── estoque/        # Controle de estoque
│   │   └── financeiro/     # Controle financeiro
│   ├── services/           # Serviços para comunicação com API
│   ├── models/             # Interfaces e modelos TypeScript
│   ├── guards/             # Guards de autenticação
│   └── app.routes.ts       # Configuração de rotas
├── environments/           # Configurações de ambiente
└── styles.css             # Estilos globais
```

## 🔑 Credenciais de Teste

Para testar o sistema (após configurar o backend):
- Email: `admin@safracerta.com`
- Senha: `admin123`

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- **Desktop**: Layout completo com sidebar expandida
- **Tablet**: Layout otimizado com sidebar adaptável
- **Mobile**: Layout compacto com menu hambúrguer

## 🔌 Integração com Backend

Todos os serviços estão configurados para conectar com a API REST do backend Java Spring Boot.

### Endpoints esperados:

- `POST /api/auth/login` - Autenticação
- `POST /api/auth/register` - Registro
- `GET/POST/PUT/DELETE /api/fazendas` - CRUD de Fazendas
- `GET/POST/PUT/DELETE /api/talhoes` - CRUD de Talhões
- `GET/POST/PUT/DELETE /api/safras` - CRUD de Safras
- `GET/POST/PUT/DELETE /api/atividades` - CRUD de Atividades
- `GET/POST/PUT/DELETE /api/estoque` - CRUD de Estoque
- `GET/POST/PUT/DELETE /api/financeiro` - CRUD de Financeiro

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Executar testes
npm test

# Build com watch mode
npm run watch
```

## 📝 Notas Importantes

1. **Autenticação**: O token JWT é armazenado no localStorage
2. **Guarda de Rotas**: Todas as rotas principais estão protegidas por AuthGuard
3. **Mock Data**: O frontend está preparado para receber dados reais do backend
4. **CORS**: Certifique-se de que o backend está configurado para aceitar requisições do frontend

## 🌐 Build para Produção

```bash
npm run build
```

Os arquivos de build estarão em `dist/safra-certa-frontend/`

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gestão agrícola moderna.

---

# 🔗 Criando o Repositório Backend

Para criar o backend correspondente em Java Spring Boot, use o seguinte prompt:

---

## 📦 Prompt para Criar o Backend Java Spring Boot

```
Crie um backend completo em Java Spring Boot para um sistema de gestão de fazendas com as seguintes especificações:

TECNOLOGIAS:
- Java 17.0.13
- Spring Boot 3.2.x (última versão estável)
- Spring Data JPA
- Spring Security com JWT
- MySQL 8.0+
- Maven
- Lombok

FUNCIONALIDADES:
1. Autenticação JWT (login/register)
2. CRUD completo de Fazendas (nome, localização, área total, proprietário)
3. CRUD de Talhões vinculados a Fazendas (nome, área, cultura, status: DISPONIVEL/EM_USO/MANUTENCAO)
4. CRUD de Safras vinculadas a Talhões (nome, cultura, datas de plantio/colheita, status: PLANTADA/CRESCIMENTO/COLHEITA/FINALIZADA, produção estimada/real)
5. CRUD de Atividades Agrícolas vinculadas a Safras (tipo, descrição, data, custo, responsável)
6. CRUD de Estoque (nome, tipo: SEMENTE/FERTILIZANTE/AGROTOXICO/EQUIPAMENTO/OUTRO, quantidade, unidade, valor unitário, fornecedor)
7. CRUD de Financeiro (tipo: RECEITA/DESPESA, categoria, descrição, valor, data, forma de pagamento, status: PENDENTE/PAGO/ATRASADO)

REQUISITOS TÉCNICOS:
- Porta: 8080
- Configuração CORS para http://localhost:4200
- Tratamento de exceções global
- Validações com Bean Validation
- DTOs para todas as entidades
- Relacionamentos: Fazenda -> Talhões -> Safras -> Atividades
- Arquivo application.properties configurado para MySQL localhost
- Schema do banco: safra_certa
- Documentação Swagger/OpenAPI

ESTRUTURA:
- Organize em packages: controller, service, repository, model, dto, config, security
- Use @RestController com /api como prefixo base
- Implemente endpoints RESTful seguindo boas práticas
- ResponseEntity com códigos HTTP apropriados
- Mapeamento de relacionamentos JPA apropriado

SEGURANÇA:
- Endpoints /api/auth/** liberados
- Demais endpoints protegidos por JWT
- Senha criptografada com BCrypt
- Token válido por 24 horas

Crie também:
- README.md com instruções de configuração
- Arquivo .gitignore para Java/Maven
- Classe de seed para dados iniciais de teste
- Scripts SQL para criação do banco

O backend deve estar pronto para integração imediata com o frontend Angular já desenvolvido.
```

---

## 🗄️ Configuração Rápida do Backend

Após criar o backend com o prompt acima:

1. Configure o MySQL:
```sql
CREATE DATABASE safra_certa;
CREATE USER 'safra_user'@'localhost' IDENTIFIED BY 'safra_password';
GRANT ALL PRIVILEGES ON safra_certa.* TO 'safra_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Atualize `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/safra_certa
spring.datasource.username=safra_user
spring.datasource.password=safra_password
spring.jpa.hibernate.ddl-auto=update
```

3. Execute o backend:
```bash
./mvnw spring-boot:run
```

4. Acesse: `http://localhost:8080`

---

## ✅ Checklist de Integração

- [ ] Backend rodando em http://localhost:8080
- [ ] Frontend rodando em http://localhost:4200
- [ ] Banco de dados MySQL configurado
- [ ] CORS configurado no backend
- [ ] Teste de login realizado com sucesso
- [ ] Endpoints da API respondendo corretamente

---

**Bom desenvolvimento! 🚀**