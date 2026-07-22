# Meta App — Contexto do Projeto

## Visão Geral

Monorepo de um app React Native (Expo) + backend NestJS para acompanhamento de metas diárias com checklist. O usuário define metas, adiciona itens ao checklist do dia, e avança os dias — ao avançar, o checklist é limpo para o novo dia. UI em português brasileiro.

## Estrutura

```
frontend/          # App React Native (Expo)
  src/
    app/           # Expo Router (file-based routing)
    shared/        # Componentes compartilhados de UI
    features/      # Módulos por domínio (checklist/, auth/, …)
    styles/        # Design tokens (tokens.ts)
    utils/         # Utilitários globais
    lib/           # Wrappers de bibliotecas
    types.ts       # Tipos e constantes de negócio

backend/           # API NestJS + PostgreSQL
  src/
    auth/          # Módulo de autenticação
    users/         # Módulo de usuários
    app.module.ts  # Módulo raiz
    main.ts        # Entry point
```

## Convenções de Código

- **Named exports exclusivamente** — sem `export default`
- **PascalCase**: componentes, screens, stores, arquivos de rota
- **camelCase**: utilitários, schemas, variáveis, funções
- **Alias `@/`** mapeando `src/` no frontend (`import { X } from "@/shared/X"`)
- **Indentação**: tab · **Aspas**: duplas (Biome)
- **Idioma**: português brasileiro em toda UI, mensagens de validação, placeholders
- **Nomes de variáveis, funções e parâmetros em inglês** — português apenas em strings de UI
- **Props interface**: `ComponentNameProps`

## Arquitetura Frontend (Camadas)

```
┌──────────────────────────┐
│        CONTAINER         │  Lógica — consome hooks/services
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

Cada feature em `features/{dominio}/` segue esse padrão:

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

### Regras
- **Container** nunca importa `react-native` ou JSX — só lógica
- **Screen** nunca chama hooks de estado/efeito diretamente — só recebe props do Container
- **Services** nunca importam hooks — só chamadas HTTP (fetch/axios)
- Expo Router aponta para o **Container**, que injeta props na Screen

### Estado (Zustand)
- Stores com persist middleware + AsyncStorage
- Hook exportado como `use[Nome]Store`
- Reset em testes: `use[Nome]Store.setState({ ... })` no `beforeEach`

### Formulários
- React Hook Form + Zod + `@hookform/resolvers`
- Schema em `features/{feature}/schemas/` (camelCase)
- Controller + FormInput para integração

### UI
- Design tokens de `@/styles/tokens` (colors, spacing, borderRadius, fontSize, …)
- Componentes compartilhados em `@/shared/` (CustomButton, FormInput, ConfirmModal, …)
- Ícones: `@expo/vector-icons` (MaterialCommunityIcons)

### Navegação
- Expo Router (file-based routing em `src/app/`)
- Layout routes com `_layout.tsx` para grupos de rotas
- Tipagem com `useLocalSearchParams` e `useRouter` do `expo-router`

### Autenticação
- Telas de login e registro na mesma feature `auth/`
- Fluxo: `AuthContainer` gerencia qual tela exibir (login ou registro)
- `AuthScreen` recebe props (modo atual, handler de submit, erros)
- `useAuth` hook encapsula formulário (RHF + Zod) e chamada ao service
- `authApi` service faz POST para `/auth/login` e `/auth/register`
- Store `useAuthStore` (Zustand) salva token + user, usada pelo Container para decidir rota inicial

```
features/auth/
  AuthContainer.tsx
  AuthScreen.tsx
  hooks/
    useAuth.ts
  services/
    authApi.ts
```

### Checklist / Metas
- Tela principal exibe o dia atual e as metas do usuário
- Checklist com itens que podem ser marcados como concluídos
- Botão "Avançar Dia" limpa o checklist e incrementa o contador de dias
- Metas são persistentes (não somem ao avançar dia)
- Itens do checklist são específicos de cada dia

### Backend
- Módulo NestJS por domínio (auth, users, …)
- PostgreSQL com `pg` (pg-mem para testes)
- Testes usam `:memory:`
- Sistema de autenticação simples (registro + login)

### Banco de Dados

```sql
-- Tabela de usuários
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  createdAt   TEXT DEFAULT NOW()
);
```

## Testes

### Gerenciamento de Pacotes

- **pnpm** em cada projeto (`frontend/` e `backend/`) — sem workspace na raiz
- Sempre usar `pnpm install`, `pnpm add`, `pnpm remove` — nunca `npm`
- Lockfile: `pnpm-lock.yaml`

### Frontend (Jest + React Native Testing Library)
- `jest-expo` preset · Jest 29 (v30 é incompatível com `@react-native/jest-preset`)
- `render` e queries são **assíncronos** (`@testing-library/react-native` v14)
- Stores resetadas com `useXStore.setState()` no `beforeEach`
- Imports **relativos** nos testes (não usar `@/`)
- Arquivo: `{SourceName}.test.ts(x)` em `src/__tests__/`
- **Estrutura espelha a source**: `src/shared/X.tsx` → `src/__tests__/shared/X.test.tsx`, `src/features/X/stores/Y.ts` → `src/__tests__/features/X/stores/Y.test.ts`
- **Container/Screen**: `src/features/X/Container.ts` → `src/__tests__/features/X/Container.test.ts`

### Backend (Vitest + Supertest)
- `globals: true`, ambiente `node`
- `:memory:` pg-mem via `helper.ts`
- `createApp(db)` para cada suite
- Testes por módulo NestJS (auth, users, …)

## CI/CD

O pipeline CI (`main`) executa em paralelo backend e frontend, com sumário consolidado:

| Job | Passos |
|-----|--------|
| **Backend** | `pnpm install` → `typecheck` → `vitest` |
| **Frontend** | `pnpm install` → `typecheck` → `biome ci` → `jest` |
| **summary** | Consolida resultados de ambos em tabela |

Workflow: `.github/workflows/ci.yml`

## Regras de Workflow

Estas regras são obrigatórias em toda interação:

1. **Testes obrigatórios** — toda implementação deve incluir testes para a nova funcionalidade
2. **Suite de testes** — após qualquer alteração, rodar a suite de testes completa (`pnpm test` no frontend e backend)
3. **Typecheck + Biome** — após qualquer alteração, rodar `pnpm typecheck` e `pnpm biome check --write` em ambos projetos e corrigir todos os erros
4. **README** — toda nova feature, modificação ou correção deve atualizar o `README.md` refletindo o que mudou
