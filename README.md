# Blog Pós FIAP

API e front-end de um blog acadêmico com posts, autores e controle de acesso por perfil (Administrador, Professor, Aluno), com autenticação e cadastro de usuários com foco em segurança, boas práticas e arquitetura escalável.

## 🚀 Tecnologias

**Backend**
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- Argon2id (hash de senha com pepper)
- JWT (autenticação)
- Zod (validação)
- Docker

**Frontend**
- React + TypeScript
- Vite
- React Hook Form + Zod
- Axios

## 🔐 Segurança

- Senhas com hash Argon2id + pepper
- Autenticação via JWT com expiração configurável
- Autorização por perfil (Administrador, Professor, Aluno)
- Variáveis sensíveis isoladas em `.env`
- Validação de dados no backend e frontend

## 🏗️ Arquitetura

O projeto segue o padrão **MVC + Repository Pattern**:

```
Controller → Repository → Model → MongoDB
```

- **Controller** → recebe a requisição e retorna a resposta
- **Repository** → abstrai o acesso ao banco de dados
- **Model** → define o schema do MongoDB
- **Middleware** → autenticação, autorização e validação

O Repository Pattern permite trocar o banco de dados sem alterar os controllers, e facilita os testes unitários com mocks.

## 🧪 Testes

O projeto usa **Jest + ts-jest** para testes unitários do backend. `npm test` já roda com `--coverage`, e o `jest.config.ts` tem um `coverageThreshold` global de 20% (statements, branches, functions e lines) — se a cobertura cair abaixo disso, os testes falham. Isso atende ao requisito de cobertura mínima de 20% do código.

**Rodar os testes:**

```bash
cd backend
npm test
```

**Cobertura atual:** ~38% statements / ~41% lines (bem acima do mínimo de 20% exigido), com foco nos controllers — em especial `postController`, que cobre criação, edição e exclusão de posts, incluindo as regras de propriedade (autor vs. Administrador).

| Controller | Testes |
|------------|--------|
| `criarUsuario` | 2 |
| `atualizarUsuario` | 3 |
| `listarUsuarios` | 2 |
| `buscarUsuario` | 2 |
| `deletarUsuario` | 2 |
| `criarPost` | 2 |
| `listarPosts` | 2 |
| `buscarPost` | 2 |
| `pesquisarPosts` | 2 |
| `atualizarPost` | 5 |
| `deletarPost` | 4 |
| **Total** | **28** |

## 📋 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## ⚙️ Configuração

**1 → Clone o repositório**
```bash
git clone https://github.com/denismc/blog-pos-fiap.git
cd blog-pos-fiap
```

**2 → Configure as variáveis de ambiente do backend**
```bash
cp backend/.env.example backend/.env
```

Edite o `backend/.env` com seus valores:

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/blog-pos-fiap
PEPPER=substitua_por_uma_string_longa_e_aleatoria
JWT_SECRET=substitua_por_uma_string_longa_e_aleatoria
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
```

**3 → Configure as variáveis de ambiente do frontend**
```bash
cp frontend/.env.example frontend/.env
```

Edite o `frontend/.env` com seus valores:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🐳 Rodando com Docker

**Desenvolvimento**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Produção**
```bash
docker-compose up -d --build
```

**Resetar o banco (apaga os dados e roda o seed do zero)**
```bash
docker-compose -f docker-compose.dev.yml down -v
```
> ⚠️ `down` sozinho só para os containers — os dados continuam no volume e o seed não roda de novo. Só o `-v` limpa o volume de fato.

**Rodando mais de uma cópia na mesma máquina**

Os nomes dos containers usam `${COMPOSE_PROJECT_NAME}`, que por padrão é o nome da pasta do projeto. Como o `git clone` sempre cria uma pasta chamada `blog-pos-fiap`, duas cópias clonadas em lugares diferentes ainda colidem por padrão (mesmo nome de projeto = mesmos containers/volume). Pra rodar duas instâncias isoladas ao mesmo tempo, use a flag `-p` com um nome diferente para cada uma:
```bash
docker-compose -p meu-teste -f docker-compose.dev.yml up -d --build
```

## 🌐 Acessos

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 (dev) / http://localhost:80 (prod) |
| Backend API | http://localhost:3000 |
| MongoDB | localhost:27017 |

## 👤 Usuários padrão

Na primeira execução (banco vazio), um usuário de cada perfil é criado automaticamente:

| Perfil | Nome | Email | Senha |
|--------|------|-------|-------|
| Administrador | Administrador | admin@admin.com | admin123 |
| Professor | Professor A | professora@professora.com | professor123 |
| Professor | Professor B | professorb@professorb.com | professor123 |
| Aluno | Aluno | aluno@aluno.com | aluno123 |

> ⚠️ Altere as senhas padrão após o primeiro acesso!

## 🔌 Endpoints

Documentação interativa completa (Swagger) em `http://localhost:3000/api/docs`.

**Auth**

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/api/auth/login` | Público |

**Usuários**

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/api/usuarios` | Autenticado |
| GET | `/api/usuarios/:id` | Autenticado |
| POST | `/api/usuarios` | Administrador |
| PUT | `/api/usuarios/:id` | Administrador |
| DELETE | `/api/usuarios/:id` | Administrador |

**Posts**

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/api/posts` | Autenticado (Administrador, Professor, Aluno) |
| GET | `/api/posts/:id` | Autenticado (Administrador, Professor, Aluno) |
| GET | `/api/posts/search?q=` | Autenticado (Administrador, Professor, Aluno) |
| POST | `/api/posts` | Administrador, Professor |
| PUT | `/api/posts/:id` | Administrador (qualquer post) ou Professor (somente o próprio) |
| DELETE | `/api/posts/:id` | Administrador (qualquer post) ou Professor (somente o próprio) |

Regras de negócio de `Posts`:
- O campo `autor` de um post nunca vem do corpo da requisição em `POST` — é sempre o usuário autenticado (via token).
- Em `PUT`, o campo `autor` só pode ser alterado por um Administrador; se um Professor enviá-lo, o valor é ignorado.
- Alunos têm acesso somente de leitura (listar, buscar e pesquisar).

## 📁 Estrutura

```
├── backend/
│   ├── src/
│   │   ├── config/       # Variáveis de ambiente
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── interfaces/   # Tipos TypeScript (backend)
│   │   ├── middlewares/  # Autenticação, autorização e validação
│   │   ├── models/       # Schemas Mongoose
│   │   ├── routes/       # Rotas da API
│   │   ├── schemas/      # Schemas Zod
│   │   └── types/        # Extensões de tipos
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── interfaces/   # Tipos TypeScript (frontend)
│   │   ├── schemas/      # Schemas Zod
│   │   └── services/     # Configuração do Axios
│   └── ...
├── docker-compose.yml
└── docker-compose.dev.yml
```

## 📄 Licença

MIT