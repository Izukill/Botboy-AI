# Botboy AI - Assistente Virtual

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)

## 📑 Sumário

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivos e Funcionalidades](#-objetivos-e-funcionalidades)
- [🧪 Stack Tecnológica](#-stack-tecnológica)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚡ Quick Start](#-quick-start)
- [☁️ Infraestrutura e Deploy](#-infraestrutura-e-deploy)
- [🏗️ Arquitetura e Modelagem](#-arquitetura-e-modelagem)
- [📝 Padrão de Commits](#-padrão-de-commits)
- [📡 Referência da API](#-referência-da-api)

## 📖 Sobre o Projeto

O **Botboy AI** é uma plataforma de chatbot inteligente com uma interface imersiva inspirada em terminais retro e sistemas operacionais clássicos. O projeto foi construído utilizando um **Backend robusto em Spring Boot (Java)** para gerenciar a segurança e o banco de dados, integrado a um **Frontend moderno e dinâmico construído em Next.js**.

O sistema permite que os usuários interajam com a inteligência artificial tanto no modo "Guest" (sem salvar dados) quanto no modo autenticado (salvando o histórico de conversas no banco de dados).

## 🎯 Objetivos e Funcionalidades

* **Integração com IA:** Chatbot responsivo capaz de manter o contexto das conversas utilizando o AI SDK.
* **Sistema de Autenticação Dupla:** Permite o uso livre (Guest) ou o registro de contas com proteção JWT para salvar históricos de chat.
* **Gestão de Sessões:** Criação, carregamento e isolamento de múltiplas sessões de chat por usuário.
* **Personalização de Interface (Temas):** Sistema robusto de temas dinâmicos (Terminal Green, Windows 95, Akane/Hello Kitty e Cloud Blue) salvos via Cookies.
* **Acessibilidade e UX:** Trilha sonora de fundo (Lo-fi), painel de configurações, banners de consentimento de cookies e design 100% responsivo.

---

## 🧪 Stack Tecnológica

### Frontend

| Tecnologia | Descrição |
|------------|----------|
| Next.js | Framework React com SSR e App Router |
| React | Biblioteca de UI |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização avançada e customização de temas |
| Axios | Requisições HTTP e Interceptadores |
| Vercel AI SDK | Gerenciamento de estado do Chatbot |

### Backend

| Tecnologia | Descrição |
|------------|----------|
| Spring Boot 3 | Framework principal / API REST |
| Spring Security | Autenticação e Filtros de Segurança |
| Auth0 Java JWT | Geração e Validação de Tokens JWT |
| Spring Data JPA | Persistência e Mapeamento Objeto-Relacional |

### Infraestrutura

| Tecnologia | Descrição |
|------------|----------|
| Vercel | Deploy do Frontend |
| Render / AWS | Deploy do Backend |
| Docker | Containerização (opcional) |

---

## 📁 Estrutura do Projeto
```text
    Botboy-AI/
    ├── api/                          # Backend — Spring Boot
    │   └── src/
    │       ├── main/
    │       │   ├── java/
    │       │   │   └── org/Izuki/
    │       │   │       ├── config/       # Configurações de CORS e Security
    │       │   │       ├── controller/   # Endpoints (AuthController, etc)
    │       │   │       ├── dto/          # Data Transfer Objects (Records)
    │       │   │       ├── entity/       # Entidades do banco de dados (User)
    │       │   │       ├── mapper/       # Conversores (UserMapper)
    │       │   │       ├── repository/   # Interfaces do Spring Data JPA
    │       │   │       ├── security/     # TokenService e SecurityFilter
    │       │   │       ├── service/      # Regras de negócio (UserService)
    │       │   │       └── Application.java
    │       │   └── resources/
    │       │       └── application.properties # Configurações e JWT_SECRET
    │       └── pom.xml
    │
    ├── app/                          # Frontend — Next.js
    │   ├── api/                      # Rotas de API Internas (Vercel AI SDK)
    │   │   │                   
    │   │   │────chat/
    │   │   │    ├── [id]/
    │   │   │    │   └── route.ts  # Retorna o histórico de um chat específico
    │   │   │    └── route.ts      # Comunicação via streaming com a LLM
    │   │   │── history/
    │   │   │   └── route.ts      # Retorna a lista de sessões de chat salvas
    │   │   ├── components/           # Sidebar, ChatArea, CookieBanner, etc
    │   │   ├── contexts/             # AuthContext (Gerenciamento de Estado JWT)
    │   │   ├── login/                # Página de autenticação
    │   │   │   ├── page.tsx          
    │   │   │   └── register/         # Sub-rota para criação de conta
    │   │   │       └── page.tsx      
    │   │   ├── services/             # Configuração do Axios (api.ts)
    │   │   ├── globals.css           # Variáveis Tailwind e Temas
    │   │   ├── layout.tsx            # RootLayout com AuthProvider
    │   │   └── page.tsx              # Rota principal (Chat UI)
    │   └── tailwind.config.ts
```

## ⚡ Quick Start

### Pré-requisitos

- Node.js 18+
- Java 17 ou 21
- Maven
- Docker & Docker Compose

---

Siga os passos abaixo para rodar a aplicação localmente:

### 1. Clone o projeto
```bash
git clone https://github.com/Izukill/Botboy-AI
cd Botboy-AI
```
### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
cp .env.local.example .env.local
```
### 3. Subir o backend (docker)

```bash
docker compose up -d
cd api
./mvnw spring-boot:run
```


### API disponível em:

http://localhost:8080/swagger-ui/index.html

### 4. Subir o frontend

```bash

cd app

npm install

npm run dev
```
### Acesse:

http://localhost:3000

---
## ☁️ Infraestrutura e Deploy

```text

Frontend (Vercel)
        ↓
Backend (Render / Docker)
        ↓
Banco de Dados (PostgreSQL/AWS)

```

---

## 🏗️ Arquitetura e Modelagem

* Modelo MER (Modelo Entidade-Relacionamento) :

```text
erDiagram
    Users {
        VARCHAR id PK
        VARCHAR lookupId "UK"
        VARCHAR email "UK"
        VARCHAR password
    }

    ChatSessions {
        VARCHAR id PK
        VARCHAR title
        TIMESTAMP created_at
    }

    Messages {
        VARCHAR id PK
        VARCHAR role "user | ai"
        TEXT content
        TIMESTAMP timestamp
    }

    Users ||--o{ ChatSessions : "possui"
    ChatSessions ||--o{ Messages : "contém"
```

* Diagrama de Classes (Segurança e Usuários) :

```text
classDiagram
    direction BT

    class User {
        -String id
        -String lookupId
        -String email
        -String password
    }

    class UserDetails {
        <<interface>>
    }

    User ..|> UserDetails : implements

    class TokenService {
        +generateToken(User user) String
        +validateToken(String token) String
    }

    class SecurityFilter {
        -recoverToken(HttpServletRequest) String
        #doFilterInternal()
    }

    class UserService {
        +create(User user) User
    }

    class AuthController {
        +login(AuthenticationDTO) ResponseEntity
        +register(RegisterSaveRequestDTO) ResponseEntity
    }

    SecurityFilter --> TokenService : usa
    AuthController --> UserService : usa
```

---

## 📝 Padrão de Commits

Para manter o histórico do projeto limpo e rastreável, este repositório segue uma convenção rigorosa de commits:

| Tipo     | Descrição                                                                                   | Exemplo de Uso                                                  |
|:---------|:--------------------------------------------------------------------------------------------|:----------------------------------------------------------------|
| feat     | Introdução de um recurso totalmente novo no sistema ou no código.                           | feat: implementacao do endpoint de criar pedido                 |
| refactor | Refatoração de código, melhora de lógicas ou de algum sistema.                              | refactor: tela de admin.                                        |
| fix      | Resolução de um bug, erro ou ajuste de comportamento incorreto de algo já entregue.         | fix: correcao do calculo de valor total na classe Pedido        |
| remove   | Exclusão de arquivos, limpeza de código morto ou remoção de configurações antigas.          | remove: exclusao da antiga classe Cor, substituida por Variacao |
| chore    | Adição/Edição de documentação, limpeza de código morto ou remoção de configurações antigas. | chore: adição de arquivo readme.md configurado                  |

---

## 📡 Referência da API

### 🔗 Base URL

```
http://localhost:8080
```

---

### Autenticação (Público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autentica o usuário e retorna o Token JWT |
| `POST` | `/auth/register` | Cria uma nova conta de usuário no sistema |

**Exemplo de Requisição (Login / Register):**

```json
{
  "email": "user@botboy.com",
  "password": "sua_senha_secreta"
}
```

**Exemplo de Resposta (Login — 200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 💬 Chat e Histórico (Requer Token JWT)

> Todas as requisições abaixo exigem o token JWT no cabeçalho:
> ```
> Authorization: Bearer <seu_token_aqui>
> ```

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/history` | Retorna todas as sessões de chat do usuário logado |
| `GET` | `/api/chat/{chatId}` | Retorna as mensagens de uma sessão específica |
| `POST` | `/api/chat` | Processa uma nova mensagem e retorna a resposta da IA |

**Exemplo de Resposta (`GET /api/history` — 200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Dúvida sobre Spring Boot",
    "createdAt": "2026-05-04T14:30:00Z"
  }
]
```