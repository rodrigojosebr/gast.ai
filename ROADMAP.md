# 🗺️ Plano de Melhorias: Gastos KV MVP

Este documento descreve o roteiro para evoluir a arquitetura, estilo e funcionalidades do projeto, focando na transição para um sistema Multi-usuário SaaS escalável com PostgreSQL.

## 🔄 Fluxo de Desenvolvimento

Para manter a organização, utilizaremos o seguinte fluxo:
1. **Source of Truth**: A branch `main` contém o código estável e o `ROADMAP.md` atualizado.
2. **Feature Branches**: Cada item deste roadmap será implementado em uma branch separada (ex: `feature/nome-da-tarefa`).
3. **Atualização do Roadmap**: Ao concluir uma tarefa na branch, marcamos o item como concluído `[x]`.
4. **Merge**: Após a validação, a branch é mergeada na `main`.

---

## 🎨 1. Estilização e UI Declarativa
- [x] **Instalar e Configurar PandaCSS**
- [x] **Migrar Estilos Inline para PandaCSS**

## 🧩 2. Componentização e Arquitetura
- [x] **Atomic Design (Pastas)**
- [x] **Extração de Componentes**

## 🧠 3. Separação de Lógica (Hooks e Contextos)
- [ ] **3.1 Isolamento do Reconhecimento de Voz** (Em andamento)
- [ ] **3.2 Isolamento das Chamadas de API**
- [ ] **3.3 Gerenciamento de Estado Global do Usuário**

---

## 🏗️ 4. Infraestrutura e Banco de Dados (Neon PostgreSQL) - *Em andamento (branch: feature/postgres-prisma)*
O objetivo é abandonar o Vercel KV em favor de um banco relacional robusto e serverless usando Neon.

- [ ] **4.1 Criação do Banco Neon**
    - Criar conta no Neon (neon.tech) e provisionar um novo projeto PostgreSQL (Free Tier).
    - Obter a `DATABASE_URL` (Connection String) e adicionar ao `.env.local`.
- [x] **4.2 Configuração do Prisma ORM**
    - Executar `npm install prisma --save-dev` e `npm install @prisma/client`.
    - Executar `npx prisma init` para gerar a pasta `prisma/` e o `.env`.
    - Configurar o `schema.prisma` para usar o provider `postgresql` e a `env("DATABASE_URL")`.
- [x] **4.3 Modelagem de Dados (`schema.prisma`)**
    - Criar o modelo `User` (`id` UUID, `name` String, `email` String UNIQUE, `passwordHash` String, `createdAt` DateTime).
    - Criar o modelo `Expense` (`id` UUID, `amountCents` Int, `description` String, `paymentMethod` String, `date` DateTime, `rawText` String, `userId` UUID).
    - Estabelecer relacionamento 1:N entre `User` e `Expense`.
- [x] **4.4 Sincronização e Geração do Client**
    - Executar `npx prisma db push` para criar as tabelas no Neon.
    - Executar `npx prisma generate` para criar o cliente TypeScript tipado.
    - Opcional: Popular dados de teste via `npx prisma studio`.

## 🏛️ 5. Arquitetura Limpa (Repositories e Schemas) - *Concluído*
O objetivo é separar a camada de acesso a dados e adicionar validação estrita.

- [x] **5.1 Padrão Repository**
    - Criar `repositories/userRepository.ts` (operações Prisma para User).
    - Criar `repositories/expenseRepository.ts` (operações Prisma para Expense).
- [x] **5.2 Validação Estrita com Zod**
    - Instalar `zod`.
    - Criar `schemas/expenseSchema.ts` e `schemas/authSchema.ts`.
- [x] **5.3 Refatoração da API Core**
    - Atualizar `POST /api/gasto` para validar payload via Zod e salvar via `ExpenseRepository`.
    - Atualizar `GET /api/export.csv` para usar o repositório.

## 🔐 6. Autenticação Multi-usuário (NextAuth.js) - *Concluído*
O objetivo é criar um sistema real de sessão e login.

- [x] **6.1 Interfaces de Cadastro e Login**
    - Criar páginas `/register` e `/login` seguindo o design system do PandaCSS.
    - Criar endpoint `POST /api/auth/register` (usando `bcryptjs` e `UserRepository`).
- [x] **6.2 Integração NextAuth**
    - Configurar `app/api/auth/[...nextauth]/route.ts` com `CredentialsProvider`.
    - Validar login contra o PostgreSQL.
- [x] **6.3 Proteção de Rotas**
    - Proteger rotas client-side (`/voice`) redirecionando não autenticados para `/login`.
    - Atualizar APIs para extraírem o `userId` exclusivamente da sessão segura.

## 📊 7. Dashboard e Gestão de Gastos (CRUD)
O objetivo é permitir a visualização e exclusão de gastos (features inviáveis no KV).

- [x] **7.1 Endpoint de Listagem e Deleção**
- [x] **7.2 Interface do Dashboard**

## 🤖 8. Inteligência Artificial (Gemini AI)
O objetivo é substituir a lógica frágil de Regex por um LLM capaz de interpretar contexto, gírias e valores complexos falados pelo usuário.

- [x] **8.1 Integração do SDK GenAI**
    - Instalar o SDK do Google Gemini (usando `gemini-2.5-flash`).
    - Criar o serviço `services/aiParserService.ts` centralizando a lógica.
- [x] **8.2 Prompt Engineering para JSON e Extração Inteligente**
    - Criar o prompt de sistema que instrui a IA a receber o texto bruto e devolver um JSON estrito.
    - Extração dinâmica de valores, descrições, **data relativa** (ex: "ontem", "dia 15") e **método de pagamento** (`paymentMethod` como Crédito, Débito, Pix, Dinheiro).
- [x] **8.3 Refatoração do Endpoint de Gastos e Limpeza de Código**
    - Atualizar `POST /api/gasto` para usar a IA em vez das funções manuais obsoletas.
    - Remover funções baseadas em Regex antigas (`parseAmountCents`, `detectBank`, etc.) do arquivo `lib/gastos.ts`.
- [x] **8.4 Melhorias de UX e Transições Suaves**
    - Adicionar animações de carregamento (`fadeIn` e `slideDown` via PandaCSS).
    - Exibir frases divertidas ciclando em sincronia com a espera da IA (ex: "Abrindo a carteira...", "Fazendo as contas...") até a conclusão da requisição.
    - **Microfone Inteligente:** Implementação de escuta contínua com encerramento automático após 3 segundos de silêncio para acomodar falas pausadas.
    - **Branding:** Rebranding completo para "Gast.ai" com novo Favicon e logo no cabeçalho.
- [x] **8.5 Feedback Financeiro Imediato**
    - Cálculo dinâmico e exibição do total gasto no mês atual logo após o registro da despesa.
    - Formatação monetária padronizada (pt-BR) e mensagens de sucesso personalizadas com o nome do usuário.
- [x] **8.6 Análise Financeira Avançada (Gastão Persona)**
    - Implementado `GET /api/analyze` usando o modelo `gemini-2.5-flash-lite` com *streaming de texto* em tempo real.
    - Criação da persona **"Gastão"**, mascote sarcástico e amigável, com regras rígidas no prompt para evitar markdown e focar em conselhos construtivos e diretos.
    - Modal na UI projetado para simular o efeito "máquina de escrever" do ChatGPT e lidar com overflow na tela de forma otimizada.
    - Controle refinado de **Temperatura da IA** (`0.1` para cálculos e extrações assertivas e `0.3` para respostas orgânicas do Gastão).
- [x] **8.7 Correção de Fuso Horário Local**
    - Identificação e captura do fuso horário dinâmico do cliente (`Intl.DateTimeFormat().resolvedOptions().timeZone`) no frontend.
    - Envio do cabeçalho `x-timezone` para o backend para corrigir discrepâncias de data (UTC x América Latina) tanto na extração via Gemini quanto na exibição nativa.

## 📱 9. Progressive Web App (PWA) e Mobile-First
O objetivo é tornar o app instalável na tela inicial do celular (parecendo um app nativo) e preparar o terreno para publicação nas App Stores.

- [x] **9.1 Configuração PWA no Next.js**
- [x] **9.2 Service Workers e Ícones**
- [x] **9.3 Instalação Cross-Platform (Prompt Inteligente)**
    - Implementação do evento `beforeinstallprompt` para Android/Desktop.
    - Modal de instrução personalizado para usuários de iOS (Safari).
- [ ] **9.4 Ajustes de UX para Mobile**
    - Impedir o "pull-to-refresh" indesejado na tela de voz.
    - Garantir que a UI fique perfeita na "safe area" de iPhones (sem sobrepor a notch ou barra inferior).
