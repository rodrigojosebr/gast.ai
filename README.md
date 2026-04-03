# 💰 Gast.ai

O **Gast.ai** é um assistente financeiro moderno e inteligente, *voice-first*, projetado para simplificar drasticamente o registro de despesas diárias. Esqueça planilhas complexas ou aplicativos com menus infinitos: basta abrir o app, falar o que gastou e deixar que a Inteligência Artificial cuide do resto.

O projeto evoluiu de um MVP simples para uma plataforma SaaS multi-usuário robusta, utilizando uma arquitetura escalável e tecnologias de ponta.

---

## ✨ Funcionalidades em Destaque

*   **🎙️ Registro por Voz Inteligente:** Pressione o microfone e fale naturalmente: *"Paguei 50 reais de gasolina no Pix agora pouco"*. O app entende gírias, contextos e datas relativas (ex: "ontem", "anteontem").
*   **🤖 Cérebro Gemini AI:** Alimentado pelo modelo `gemini-2.0-flash-lite`, o sistema realiza o parsing do áudio para JSON estruturado, extraindo valor, descrição, categoria e método de pagamento com precisão, corrigindo automaticamente erros de transcrição.
*   **🤵‍♂️ Gastão - Seu Mentor Sarcástico:** O "Gastão" analisa seu comportamento financeiro em tempo real. Ele fornece feedbacks bem-humorados e análises críticas sobre seus gastos via streaming de texto, ajudando você a refletir antes da próxima compra.
*   **📊 Dashboard & Gestão:** Visualize todos os seus gastos em uma interface limpa e organizada. Edite ou exclua registros com facilidade e acompanhe seu total mensal acumulado.
*   **📱 PWA (Progressive Web App):** Instale o Gast.ai na tela inicial do seu celular (Android ou iOS) para uma experiência de app nativo, com carregamento instantâneo e ícone dedicado.
*   **🔐 Autenticação Segura:** Sistema completo de login e cadastro integrado ao NextAuth.js, garantindo que seus dados financeiros sejam privados e acessíveis apenas por você.
*   **🌐 Fuso Horário Inteligente:** O app detecta automaticamente sua localização para garantir que gastos feitos próximos à meia-noite sejam registrados no dia correto do seu calendário local.

---

## 🛠️ Stack Tecnológica

*   **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **IA:** [Google Gemini SDK](https://ai.google.dev/)
*   **Estilização:** [PandaCSS](https://panda-css.com/) (Type-safe, zero-runtime CSS-in-JS)
*   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (via [Neon Serverless](https://neon.tech/))
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Autenticação:** [Auth.js](https://authjs.dev/) (NextAuth)
*   **Validação:** [Zod](https://zod.dev/)

---

## 🚀 Como Rodar Localmente

### 1. Clonar e Instalar
```bash
git clone <URL_DO_REPOSITORIO>
cd gast-ai
npm install
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
```bash
# Banco de Dados
DATABASE_URL="postgresql://user:password@neon-host/dbname?sslmode=require"

# Inteligência Artificial
GEMINI_API_KEY="sua_chave_do_google_ai_studio"

# Autenticação
NEXTAUTH_SECRET="uma_string_aleatoria_segura"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Preparar o Banco de Dados
Gere o cliente do Prisma e sincronize as tabelas:
```bash
npx prisma generate
npx prisma db push
```

### 4. Iniciar o Desenvolvimento
```bash
npm run dev
```

---

## 🏗️ Arquitetura do Projeto

O Gast.ai segue o **Repository Pattern** e princípios de **Clean Architecture** para garantir manutenibilidade:

*   `/app`: Rotas, páginas e API Handlers do Next.js.
*   `/components`: UI Components organizados por responsabilidade (layout, features, ui).
*   `/repositories`: Camada de abstração de dados (isolando o Prisma do restante da lógica).
*   `/services`: Lógica de negócio complexa (ex: Integração com Gemini, Cálculos de IA).
*   `/schemas`: Validação de contratos de dados usando Zod.
*   `/hooks`: Lógica de estado reutilizável (Voz, Autenticação, etc).

---

## 🗺️ Roadmap
Para detalhes sobre o progresso do desenvolvimento e próximas tasks, consulte o arquivo [ROADMAP.md](./ROADMAP.md).
