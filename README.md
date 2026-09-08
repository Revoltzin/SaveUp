# 💰 SaveUp

**SaveUp** é o backend de um aplicativo mobile focado em ajudar pessoas a tomarem decisões financeiras mais inteligentes — e a de fato guardar dinheiro, usando gamificação e gatilhos de dopamina a favor do usuário, em vez de contra ele.

Este repositório contém **apenas a API**. O app mobile (frontend) ainda será desenvolvido em uma etapa posterior.

> 📌 Este README é um documento vivo — ele cresce junto com o projeto. Cada fase concluída é registrada aqui.

---

## 🧭 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Stack tecnológica](#-stack-tecnológica)
- [Segurança](#-segurança)
- [Modelo de dados](#-modelo-de-dados)
- [Endpoints disponíveis](#-endpoints-disponíveis)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como rodar localmente](#-como-rodar-localmente)
- [Roadmap](#-roadmap)

---

## 📖 Sobre o projeto

A ideia por trás do SaveUp é simples: guardar dinheiro é difícil porque a recompensa é distante e abstrata. O app ataca esse problema tornando o progresso **visível e recompensador** — cada meta de economia tem um valor-alvo e um valor atual, calculado a partir dos aportes que o usuário registra ao longo do caminho.

Recursos de recomendação com IA estão no radar, mas **propositalmente fora de escopo por enquanto** — a prioridade atual é ter uma base de backend sólida, segura e bem testada antes de adicionar inteligência por cima dela.

---

## 🛠 Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript (strict mode) |
| Framework web | Express 5 |
| Banco de dados | PostgreSQL |
| ORM | Prisma 7 (driver adapter `@prisma/adapter-pg`) |
| Autenticação | JWT (`jsonwebtoken`) + `bcrypt` |
| Validação | Zod |
| Rate limiting | `express-rate-limit` |
| Lint/format | ESLint (flat config) + Prettier |
| Dev runtime | `tsx watch` |

---

## 🔐 Segurança

Segurança foi tratada como requisito desde o início, não como reboco:

- **Senhas** nunca armazenadas em texto puro — hash com `bcrypt` (12 salt rounds)
- **JWT** assinado com segredo forte, expiração de 1h, payload mínimo (`{ sub: userId }`)
- **Validação de entrada** via Zod em todo endpoint que recebe body — bloqueia mass assignment por padrão
- **Proteção contra IDOR**: todo recurso (`SavingsGoal`, `Contribution`) valida posse do usuário antes de qualquer leitura/escrita. Tentar acessar um recurso de outro usuário retorna `404` genérico — nunca revela que o recurso existe
- **Rate limiting** em duas camadas: limite generoso global (100 req/15min) e limite restrito nas rotas de autenticação (10 req/15min), mitigando brute-force e credential stuffing
- **Auditoria manual de autorização** já realizada e documentada, cobrindo todos os endpoints existentes

Pendências conhecidas (não bloqueantes, registradas para correção futura): headers de segurança via `helmet`, tratamento correto de payload muito grande (`413`), e configuração de `trust proxy` antes de qualquer deploy atrás de proxy reverso.

---

## 🗂 Modelo de dados

O schema completo já contempla o domínio financeiro do app, mas **nem todo model tem endpoints expostos ainda** (marcado abaixo):

| Model | Status da API | Descrição |
|---|---|---|
| `User` | ✅ Exposto | Conta do usuário |
| `SavingsGoal` | ✅ Exposto | Meta de economia (valor-alvo, prazo, status) |
| `Contribution` | ✅ Exposto | Aporte feito em direção a uma meta |
| `Category` | 🔲 Só no schema | Categoria de transação (receita/despesa) |
| `Transaction` | 🔲 Só no schema | Lançamento financeiro |
| `Budget` | 🔲 Só no schema | Orçamento por categoria/período |

Valores monetários são sempre `Decimal`, nunca `Float` — evitando erros de arredondamento em dinheiro. O valor atual guardado numa meta (`currentAmount`) não é uma coluna armazenada: é calculado dinamicamente somando os aportes (`Contribution`) daquela meta.

---

## 🔌 Endpoints disponíveis

### Autenticação (públicos)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cria uma conta |
| `POST` | `/auth/login` | Autentica e retorna um JWT |

### Usuário (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/me` | Retorna os dados do usuário logado |

### Metas de economia — `SavingsGoal` (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/goals` | Cria uma meta |
| `GET` | `/goals` | Lista as metas do usuário (com `currentAmount`) |
| `GET` | `/goals/:id` | Detalha uma meta (com `currentAmount`) |
| `PATCH` | `/goals/:id` | Atualiza parcialmente uma meta |
| `DELETE` | `/goals/:id` | Remove uma meta |

### Aportes — `Contribution` (autenticado, aninhado em uma meta)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/goals/:id/contributions` | Registra um aporte na meta |
| `GET` | `/goals/:id/contributions` | Lista os aportes da meta |

Todas as rotas autenticadas exigem o header `Authorization: Bearer <token>`, obtido via `/auth/login`.

---

## 📁 Estrutura do projeto

```
src/
  config/env.ts           # variáveis de ambiente tipadas
  controllers/             # recebem req/res, validam com zod, chamam services
  services/                 # lógica de negócio + acesso ao banco (Prisma)
  routes/                   # definição das rotas por domínio
  schemas/                  # validação de input (zod)
  middlewares/             # autenticação, rate limiting, tratamento de erros
  errors/                    # classe de erro customizada (AppError)
  lib/prisma.ts             # instância única do Prisma Client
  utils/                     # jwt, hash de senha
prisma/
  schema.prisma            # modelo de dados
```

---

## 🚀 Como rodar localmente

**Pré-requisitos:** Node.js, Docker (para o banco Postgres)

```bash
# 1. Instale as dependências
npm install

# 2. Suba o banco de dados
docker compose up -d

# 3. Configure as variáveis de ambiente (crie um .env na raiz)
PORT=3000
DATABASE_URL="postgresql://rachadinha:rachadinha@localhost:5432/rachadinha?schema=public"
JWT_SECRET="troque-por-um-valor-aleatorio-forte"
NODE_ENV=development

# 4. Rode as migrations
npx prisma migrate dev

# 5. Suba o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000`. `GET /health` confirma que está no ar.

---

## 🗺 Roadmap

- [x] **Fase 0** — Setup do projeto (Express, Prisma, Postgres, TypeScript)
- [x] **Fase 1** — Autenticação (registro, login, JWT, rota protegida)
- [x] **Fase 2** — CRUD do domínio principal (`SavingsGoal` e `Contribution`), com auditoria de segurança e testes manuais completos
- [ ] **Fase 3** — CRUD de `Transaction`, `Category` e `Budget`
- [ ] **Fase 4** — Camada de gamificação (a peça central da proposta do app)
- [ ] **Fase 5** — Testes automatizados
- [ ] **Fase 6** — Documentação de API formal (ex: OpenAPI/Swagger) e preparação para deploy
- [ ] **Futuro** — Recomendações inteligentes com IA
- [ ] **Futuro** — Aplicativo mobile (frontend)

---

<p align="center">Construído com atenção a segurança e boas práticas, um bloco de cada vez.</p>