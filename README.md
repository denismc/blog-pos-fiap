# Login Argon2id — Full-Stack Boilerplate

Boilerplate completo de autenticação e cadastro de usuários com foco em segurança, boas práticas e arquitetura escalável.

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

## 📋 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## ⚙️ Configuração

**1 → Clone o repositório**
```bash
git clone https://github.com/denismc/login-argon2id.git
cd login-argon2id
```

**2 → Configure as variáveis de ambiente do backend**
```bash
cp backend/.env.example backend/.env
```

Edite o `backend/.env` com seus valores:

PORT=3000
MONGODB_URI=mongodb://mongodb:27017/cadastro-usuarios
PEPPER=substitua_por_uma_string_longa_e_aleatoria
JWT_SECRET=substitua_por_uma_string_longa_e_aleatoria
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173

**3 → Configure as variáveis de ambiente do frontend**
```bash
cp frontend/.env.example frontend/.env
```

Edite o `frontend/.env` com seus valores:

VITE_API_URL=http://localhost:3000/api

## 🐳 Rodando com Docker

**Desenvolvimento**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Produção**
```bash
docker-compose up -d --build
```

## 🌐 Acessos

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 (dev) / http://localhost:80 (prod) |
| Backend API | http://localhost:3000 |
| MongoDB | localhost:27017 |

## 👤 Usuário padrão

Na primeira execução, um usuário administrador é criado automaticamente:

| Campo | Valor |
|-------|-------|
| Email | admin@admin.com |
| Senha | admin123 |

> ⚠️ Altere a senha do usuário padrão após o primeiro acesso!

## 📁 Estrutura

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

## 📄 Licença

MIT