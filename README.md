# Trip Planner API

Este é o projeto de back-end para uma aplicação de planejamento de viagens. A API permite que os usuários criem viagens, convidem participantes, gerenciem atividades e compartilhem links importantes.

## ✨ Funcionalidades

- **Gerenciamento de Viagens:** Crie, atualize e obtenha detalhes de uma viagem.
- **Gerenciamento de Participantes:** Convide participantes para uma viagem por e-mail e confirme a presença deles.
- **Planejamento de Atividades:** Crie e liste atividades para uma viagem específica.
- **Compartilhamento de Links:** Crie e liste links importantes (reservas, ingressos, etc.) para uma viagem.
- **Notificações por E-mail:** Envia e-mails de confirmação para o criador da viagem e convites para os participantes(simula um servidor SMTP ).

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para o JavaScript no servidor.
- **Fastify**: Framework web de alta performance e baixo overhead.
- **TypeScript**: Superset do JavaScript para tipagem estática e código mais robusto.
- **Prisma**: ORM de última geração para Node.js e TypeScript, usado para interagir com o banco de dados.
- **Zod**: Biblioteca para validação de schemas com foco em TypeScript.
- **Day.js**: Biblioteca para manipulação e formatação de datas.
- **Nodemailer**: Módulo para envio de e-mails.

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/IsaaczZj/trip-planner-back-end.git
    ```

2.  **Acesse o diretório do projeto:**

    ```bash
    cd trip-planner-back-end
    ```

3.  **Instale as dependências:** (Recomendado usar `pnpm`)

    ```bash
    pnpm install
    ```

4.  **Crie o arquivo de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    DATABASE_URL="CONEXAO_BANCO"
    API_BASE_URL="ENDEREÇO_API"
    WEB_BASE_URL="ENDEREÇO_WEB"
    PORT=3333
    ```

5.  **Execute as migrações do banco de dados:**
    Este comando irá criar o banco de dados SQLite e aplicar as tabelas definidas no schema.

    ```bash
    pnpm exec prisma migrate dev
    ```

6.  **Execute o servidor de desenvolvimento:**

    ```bash
    pnpm dev
    ```

7.  A API estará disponível no endereço `http://localhost:3333`.

## 📂 Estrutura do Projeto

```
.
├── prisma/
│   ├── migrations/         # Arquivos de migração do banco de dados
│   ├── dev.db              # Banco de dados SQLite (desenvolvimento)
│   └── schema.prisma       # Schema do banco de dados
├── src/
│   ├── erros/              # Classes de erro customizadas
│   ├── lib/                # Módulos compartilhados (Prisma, Day.js, Nodemailer)
│   ├── routes/             # Definição de todas as rotas da API
│   ├── env.ts              # Validação das variáveis de ambiente com Zod
│   ├── error-handler.ts    # Handler de erro global
│   └── server.ts           # Ponto de entrada da aplicação Fastify
├── .env.example            # Exemplo de arquivo de variáveis de ambiente
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```
