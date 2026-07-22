# Meta App — Acompanhamento de Metas Diárias

App React Native (Expo) com backend NestJS para acompanhamento de metas e checklists diários. O usuário define metas, adiciona itens ao checklist do dia, e conclui o dia — ao concluir, o checklist é limpo para o novo dia.

## Estrutura do Projeto (Monorepo)

```
├── frontend/          # App React Native (Expo)
│   ├── src/
│   ├── package.json
│   ├── app.json
│   └── ...
├── backend/           # API NestJS + SQLite
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── goals/
│   │   ├── checklist/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── ...
├── .github/
│   └── workflows/
│       └── ci.yml     # CI/CD pipeline
├── README.md
└── .gitignore
```

## Visão Geral

O app permite que o usuário gerencie suas metas e checklists diários de forma simples:

- **Metas**: Metas persistentes definidas pelo usuário
- **Checklist Diário**: Itens específicos do dia que podem ser marcados como concluídos
- **Concluir por hoje**: Desmarca todos os itens do checklist (não apaga, não avança o dia)
- **Autenticação**: Sistema simples de login/registro via backend

## Principais Funcionalidades

- **Gestão de Metas**: Criar e gerenciar metas persistentes
- **Checklist Diário**: Adicionar itens ao checklist do dia e marcá-los como concluídos
- **Concluir por hoje**: Botão para desmarcar todos os itens do checklist (não apaga, não avança o dia)
- **Autenticação**: Sistema de registro e login com email e senha

### Fluxo de Autenticação

A feature `auth/` gerencia login e registro com o mesmo padrão de camadas:

```
features/auth/
  AuthContainer.tsx       # Container — gerencia qual tela exibir (login/registro)
  AuthScreen.tsx          # Screen — recebe props e renderiza formulário
  hooks/
    useAuth.ts            # Hook — encapsula formulário (RHF + Zod) e submit
  services/
    authApi.ts            # Service — POST /auth/login e /auth/register
```

- `AuthContainer` decide se mostra login ou registro, e usa `useAuthStore` (Zustand) para redirecionar após autenticação
- `AuthScreen` é uma view pura que recebe `mode`, `onSubmit`, `errors` do Container
- `useAuth` hook gerencia estado do formulário e chama `authApi`
- Schemas de validação (Zod) em `schemas/authSchemas.ts` com mensagens em português

### Componentes Compartilhados

| Componente | Descrição |
|------------|-----------|
| `CustomButton` | Botão com variantes `primary`, `secondary`, `danger`, suporte a `loading` e `disabled` |
| `FormInput` | Input com label, placeholder, `secureTextEntry` e exibição de erro |
| `ControlledFormInput` | Wrapper que integra `FormInput` com React Hook Form (`Controller`) |
| `ConfirmModal` | Modal de confirmação com dois botões para ações destrutivas |
| `Alert` | Sistema de toasts com `alert.success()`, `alert.error()` e `alert.info()` via `react-native-toast-message` |

### Tela de Checklist

A tela principal exibe:
- **Header**: Data formatada em português + botão de logout
- **Barra de progresso**: Percentual de itens concluídos
- **Input rápido**: Adicionar item ao checklist do dia
- **Lista de itens**: Cada item com checkbox (toggle) e botão de deletar (com confirmação)
- **Footer**: Botões para criar nova meta e concluir por hoje

## Como Rodar o Projeto

### Frontend

```bash
cd frontend
pnpm install
pnpm start          # Expo Go
# ou
pnpm android        # Emulador Android
pnpm test           # Testes
pnpm typecheck      # TypeScript
pnpm biome:check    # Lint + formatação
```

### Backend

```bash
cd backend
pnpm install
pnpm dev            # Desenvolvimento com hot reload
pnpm start          # Produção
pnpm test           # Testes
pnpm typecheck      # TypeScript
pnpm lint           # Lint + formatação
```

O backend usa SQLite em memória por padrão (via `better-sqlite3`). Nenhuma configuração de banco é necessária para desenvolvimento.

## Testes

```bash
# Backend (Vitest) — 5 suites, 26 testes
cd backend
pnpm test

# Frontend (Jest + React Native Testing Library) — 15 suites, 79 testes
cd frontend
pnpm test
```

### Frontend — Estrutura de Testes

Os testes espelham a estrutura de `src/` usando imports **relativos**:

| Source | Teste |
|--------|-------|
| `shared/CustomButton.tsx` | `__tests__/shared/CustomButton.test.tsx` |
| `shared/FormInput.tsx` | `__tests__/shared/FormInput.test.tsx` |
| `shared/ConfirmModal.tsx` | `__tests__/shared/ConfirmModal.test.tsx` |
| `shared/Alert.tsx` | `__tests__/shared/Alert.test.tsx` |
| `stores/authStore.ts` | `__tests__/features/auth/stores/authStore.test.ts` |
| `features/auth/schemas/authSchemas.ts` | `__tests__/features/auth/schemas/authSchemas.test.ts` |
| `features/auth/services/authApi.ts` | `__tests__/features/auth/services/authApi.test.ts` |
| `features/auth/hooks/useAuth.ts` | `__tests__/features/auth/hooks/useAuth.test.tsx` |
| `features/auth/AuthContainer.tsx` | `__tests__/features/auth/AuthContainer.test.tsx` |
| `features/auth/AuthScreen.tsx` | `__tests__/features/auth/AuthScreen.test.tsx` |
| `features/checklist/hooks/useDayProgress.ts` | `__tests__/features/checklist/hooks/useDayProgress.test.ts` |
| `features/checklist/hooks/useChecklist.ts` | `__tests__/features/checklist/hooks/useChecklist.test.tsx` |
| `features/checklist/services/checklistApi.ts` | `__tests__/features/checklist/services/checklistApi.test.ts` |
| `features/checklist/ChecklistContainer.tsx` | `__tests__/features/checklist/ChecklistContainer.test.tsx` |
| `features/checklist/ChecklistScreen.tsx` | `__tests__/features/checklist/ChecklistScreen.test.tsx` |

### Backend — Estrutura de Testes

Os testes usam `@nestjs/testing` + `supertest` ou testes de serviço diretos:

| Source | Teste |
|--------|-------|
| `health.controller.ts` | `health.test.ts` |
| `auth/auth.service.ts` | `auth/auth.test.ts` |
| `users/users.service.ts` | `users/users.service.test.ts` |
| `goals/goals.service.ts` | `goals/goals.test.ts` |
| `checklist/checklist.service.ts` | `checklist/checklist.test.ts` |

- Banco `:memory:` compartilhado via `test/helper.ts` (`getDb()` / `resetDb()`)
- Providers manuais com `{ provide: "DB_POOL", useFactory: getDb }`

- Stores são resetadas com `use[Nome]Store.setState({})` no `beforeEach`
- Chamadas HTTP mockadas com `jest.fn()` em `global.fetch`
- AsyncStorage mockado globalmente em `jest.setup.js`
## CI/CD

O projeto possui pipeline CI definido em `.github/workflows/ci.yml` com três jobs paralelos:

| Job | Passos |
|-----|--------|
| **Backend** | `pnpm install` → `typecheck` → `vitest` |
| **Frontend** | `pnpm install` → `typecheck` → `biome ci` → `jest` |
| **summary** | Consolida resultados de ambos em tabela |

## Variáveis de Ambiente


### Frontend (`frontend/.env`)

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL do backend |

### Backend (`backend/.env`)

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (default: 3001) |
| `DATABASE_PATH` | Caminho do arquivo SQLite (default: `./data/metaapp.db`) |
| `JWT_SECRET` | Chave secreta para JWT |

## Arquitetura Frontend (Camadas)

Cada feature segue uma arquitetura em camadas com separação clara entre lógica e view:

```
┌──────────────────────────┐
│        CONTAINER         │  Lógica — consome hooks e services
│  ┌────────────────────┐  │
│  │      HOOKS         │  │  Encapsula estado, efeitos, handlers
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │     SERVICES       │  │  Comunicação com API externa
│  └────────────────────┘  │
└──────────┬───────────────┘
           │ props (dados + callbacks)
           ▼
┌──────────────────────────┐
│         SCREEN           │  View pura — recebe props e renderiza
└──────────────────────────┘
```

### Regras
- **Container** nunca importa `react-native` ou JSX — só lógica
- **Screen** nunca chama hooks de estado/efeito diretamente — só recebe props do Container
- **Services** nunca importam hooks — só chamadas HTTP
- Expo Router aponta para o **Container**, que injeta props na Screen

### Exemplo por feature

```
features/checklist/
  ChecklistContainer.tsx   # Container — orquestra hooks e services
  ChecklistScreen.tsx      # Screen — view pura, recebe props
  hooks/
    useChecklist.ts        # Hook — estado, handlers, form
    useDayProgress.ts
  services/
    checklistApi.ts        # Service — chamadas HTTP ao backend
```

## Tecnologias

### Frontend
- **Framework**: React Native (Expo SDK 53 — New Architecture habilitada)
- **Linguagem**: TypeScript 5.9
- **Importação**: Path alias `@/` apontando para `src/`
- **Gerenciamento de Estado**: Zustand + Persist Middleware
- **Formulários**: React Hook Form + Zod + `@hookform/resolvers`
- **Navegação**: Expo Router (file-based routing)
- **Tooling**: Biome (Linting & Formatting)
- **Gerenciamento de Pacotes**: pnpm
- **Testes**: Jest 29 + React Native Testing Library 12
- **Toast**: react-native-toast-message
- **Design System**: Tokens centralizados em `styles/tokens.ts`

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Gerenciamento de Pacotes**: pnpm
- **Banco**: SQLite (better-sqlite3)
- **Auth**: JWT (bcrypt + jsonwebtoken)
- **Testes**: Vitest + Supertest (SQLite em memória)

## Estrutura do Frontend

```text
frontend/src/
  app/                    # Expo Router (file-based routing)
    _layout.tsx           # Layout raiz (Stack navigator)
    index.tsx             # Tela inicial (auth ou checklist conforme estado)
  shared/                 # Componentes compartilhados de UI
    CustomButton.tsx      # Botão reutilizável (primary/secondary/danger)
    FormInput.tsx         # Input de formulário com label e erro
    ControlledFormInput.tsx  # Wrapper FormInput + React Hook Form
    ConfirmModal.tsx      # Modal de confirmação
    Alert.tsx             # Sistema de toasts (alert.success/error/info)
  features/               # Módulos por domínio
    auth/
      AuthContainer.tsx   # Container — gerencia estado do formulário
      AuthScreen.tsx      # Screen — formulário de login/registro
      schemas/
        authSchemas.ts    # Zod schemas de validação
      hooks/
        useAuth.ts        # Hook com submit e toggle modo
      services/
        authApi.ts        # Chamadas HTTP para /auth/*
    checklist/
      ChecklistContainer.tsx  # Container — orquestra hooks
      ChecklistScreen.tsx     # Screen — checklist diário com progresso
      hooks/
        useChecklist.ts      # Hook principal (carregar, adicionar, toggle, avançar)
        useDayProgress.ts    # Hook de cálculo de progresso
      services/
        checklistApi.ts      # Chamadas HTTP para /goals e /checklist
  stores/
    authStore.ts         # Zustand store com persist (AsyncStorage)
  styles/
    tokens.ts            # Design tokens (colors, spacing, fontSize, borderRadius)
  lib/
    asyncStorage.ts      # Wrapper AsyncStorage
  types.ts               # Tipos globais (User, Goal, ChecklistItem, DayData)
  __tests__/             # Testes espelhando a estrutura source
    shared/
      CustomButton.test.tsx
      FormInput.test.tsx
      ConfirmModal.test.tsx
      Alert.test.tsx
    features/
      auth/
        AuthContainer.test.tsx
        AuthScreen.test.tsx
        stores/authStore.test.ts
        schemas/authSchemas.test.ts
        services/authApi.test.ts
        hooks/useAuth.test.tsx
      checklist/
        ChecklistContainer.test.tsx
        ChecklistScreen.test.tsx
        hooks/useChecklist.test.tsx
        hooks/useDayProgress.test.ts
        services/checklistApi.test.ts
```

## Endpoints do Backend

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | — | Registrar novo usuário |
| POST | `/auth/login` | — | Login do usuário |
| GET | `/health` | — | Health check |
| GET | `/goals` | JWT | Listar metas |
| POST | `/goals` | JWT | Criar meta |
| DELETE | `/goals/:id` | JWT | Remover meta |
| GET | `/checklist?day=` | JWT | Listar itens do dia |
| POST | `/checklist` | JWT | Adicionar item |
| PATCH | `/checklist/:id` | JWT | Alternar item |
| DELETE | `/checklist/:id` | JWT | Remover item |
| POST | `/checklist/advance-day` | JWT | Concluir por hoje |

## Schema do Banco

O backend usa SQLite em memória com `better-sqlite3`. A função `now()` é registrada para retornar ISO string.

```sql
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  "createdAt" TEXT DEFAULT NOW()
);

CREATE TABLE goals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  "createdAt" TEXT DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE checklist_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  day         TEXT NOT NULL,
  title       TEXT NOT NULL,
  goal_id     INTEGER,
  completed   INTEGER DEFAULT 0,
  "createdAt" TEXT DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (goal_id) REFERENCES goals(id)
);
```

## Autor

**Desenvolvedor**: Arthur Pereira da Silva
**Portfólio**: [github.com/ArthurPdaSilva](https://github.com/ArthurPdaSilva)
