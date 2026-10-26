# SaepChef

Site de receitas onde qualquer pessoa pode navegar pelo cardápio e, depois de entrar com uma conta, cadastrar as próprias receitas com foto, ingredientes e modo de preparo.

O projeto é dividido em duas partes que se comunicam por uma API REST:

- **front-end:** a interface (HTML, CSS e JavaScript puro);
- **back-end:** a API em Node.js + Express, que lê e grava os dados no PostgreSQL.

## O que o site faz

- **Cardápio de receitas:** cards com foto, nome, origem, tipo, chef, ingredientes e modo de preparo.
- **Pesquisa por título:** filtra os cards enquanto você digita.
- **Filtro por tipo:** Doce, Salgado ou Agridoce.
- **Paginação:** o cardápio é dividido em páginas.
- **Login e registro:** o registro pede nome, e-mail e senha (mínimo de 6 caracteres). Toda conta nova é do tipo `comum`.
- **Criar receita:** disponível apenas para quem está logado. O chef que aparece no card é o usuário que cadastrou a receita.
- **Foto de perfil:** pode ser trocada pelo próprio usuário e fica salva no navegador (`localStorage`).

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | HTML, CSS, JavaScript (Fetch API) |
| Back-end | Node.js, Express, cors, dotenv, pg |
| Banco de dados | PostgreSQL (gerenciado com o pgAdmin 4) |

O back-end segue a arquitetura em camadas: **Routes → Controller → Service → Repository → Banco**.

## Estrutura do projeto

```
SaepChef/
├── back-end/
│   ├── .env                  # variáveis de ambiente (NÃO vai para o GitHub)
│   ├── package.json
│   └── src/
│       ├── Server/server.js  # inicia o servidor e entrega o front-end
│       ├── config/db.js      # conexão com o PostgreSQL
│       ├── Routes/           # rotas de usuários e receitas
│       ├── Controller/       # recebe a requisição e devolve a resposta
│       ├── Services/         # regras de negócio
│       └── Repositories/     # consultas SQL
├── front-end/
│   └── src/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── imagens/          # fotos das receitas (receita1.jpg, ...)
└── SAEPChef.sql              # criação das tabelas e dados iniciais
```

> Os nomes das pastas do back-end devem ser escritos **exatamente** iguais nos `import`/`require` (maiúsculas e minúsculas contam).

## Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS)
- [PostgreSQL](https://www.postgresql.org/download/) e o pgAdmin 4

### 1. Criar o banco de dados

1. No pgAdmin, conecte ao servidor local (host `localhost`, porta `5432`, usuário `postgres`).
2. Crie um banco chamado **`SAEPChef`**.
3. Abra o **Query Tool** nesse banco e execute, nesta ordem:
   1. `SAEPChef.sql` (tabelas e dados iniciais);
   2. `migracao.sql` (colunas adicionais usadas pelo site: tipo, ingredientes, preparo).

### 2. Configurar o `.env`

Dentro da pasta `back-end`, crie um arquivo chamado `.env` com o conteúdo abaixo, trocando a senha pela que você definiu ao instalar o PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=SAEPChef
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432
PORT=3000
```

| Variável | Para que serve |
|---|---|
| `DB_USER` | Usuário do PostgreSQL |
| `DB_HOST` | Endereço do servidor do banco |
| `DB_NAME` | Nome do banco (`SAEPChef`) |
| `DB_PASSWORD` | Senha do usuário do PostgreSQL |
| `DB_PORT` | Porta do PostgreSQL (padrão `5432`) |
| `PORT` | Porta em que a API/site vai rodar |

> **Importante:** nunca envie o `.env` para o GitHub. Crie um arquivo `.gitignore` na raiz com as linhas `.env` e `node_modules`.

### 3. Instalar as dependências e iniciar

Na pasta `back-end`:

```bash
npm install
npm run dev
```

No terminal deve aparecer:

```
Servidor rodando em http://localhost:3000
Banco conectado: { current_database: 'SAEPChef', current_schema: 'public' }
```

### 4. Acessar o site

Abra **http://localhost:3000** no navegador. O próprio servidor entrega o front-end, então não é preciso usar o Live Server.

## Contas de teste

O banco já vem com usuários cadastrados (senha de todos: `123456`):

| Tipo | E-mail |
|---|---|
| Chef | chef1@saepchef.com |
| Chef | chef2@saepchef.com |
| Chef | chef3@saepchef.com |
| Comum | usuario1@gmail.com |
| Comum | usuario2@gmail.com |
| Comum | usuario3@gmail.com |

Você também pode criar uma conta nova pela aba **Registrar**.

## Rotas da API

### Usuários (`/usuarios`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/usuarios` | Registra um usuário (`nome`, `email`, `senha`) |
| POST | `/usuarios/login` | Faz login (`email`, `senha`) |
| GET | `/usuarios` | Lista os usuários |
| GET | `/usuarios/:id` | Busca um usuário |
| PUT | `/usuarios/:id` | Atualiza um usuário |
| DELETE | `/usuarios/:id` | Exclui um usuário |

### Receitas (`/receitas`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/receitas` | Cria uma receita |
| GET | `/receitas` | Lista as receitas (com o nome do chef) |
| GET | `/receitas/:id` | Busca uma receita |
| PUT | `/receitas/:id` | Atualiza uma receita |
| DELETE | `/receitas/:id` | Exclui uma receita |

Exemplo de corpo para criar uma receita:

```json
{
  "titulo_receita": "Brigadeiro",
  "origem_receita": "Brasil",
  "tipo": "Doce",
  "ingredientes": ["Leite condensado", "Chocolate em pó", "Manteiga"],
  "preparo": "Misture tudo e leve ao fogo até desgrudar do fundo da panela.",
  "url_imagem": "brigadeiro.jpg",
  "id_usuario": 1
}
```

## Banco de dados

- **`tb_usuario`:** id, nome, nome de usuário, e-mail (único), senha, imagem, tipo (`comum` ou `chef`).
- **`tb_receita`:** id, título, origem, tipo (`Doce`, `Salgado` ou `Agridoce`), ingredientes, modo de preparo, imagem e o usuário que criou (chave estrangeira para `tb_usuario`).
- **`tb_favoritar`:** relaciona usuários e receitas favoritas (tabela criada, ainda não usada pelo site).

## Imagens das receitas

- As receitas cadastradas pelo site guardam a foto diretamente no banco (base64).
- As receitas iniciais guardam só o nome do arquivo (`receita1.jpg`, ...). Coloque essas imagens na pasta `front-end/src/imagens/` para que apareçam nos cards.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| "Não foi possível carregar as receitas" | O back-end não está rodando, ou a porta no `script.js`/`.env` não confere |
| `Erro de conexão` no terminal | Senha ou nome do banco incorretos no `.env`, ou o PostgreSQL está parado |
| `Cannot GET /` | O caminho da pasta do front-end no `server.js` está errado |
| `Cannot find module` | Nome de pasta com maiúscula/minúscula diferente nos imports |

## Limitações conhecidas

- As senhas ainda são salvas em texto puro no banco (o ideal é usar `bcrypt`).
- A sessão do usuário fica no `localStorage`, sem token de autenticação (o ideal é usar JWT).
- As fotos em base64 deixam o banco pesado (o ideal é usar `multer` e guardar só o nome do arquivo).

## Autor

Projeto desenvolvido como atividade de estudo. © SAEPChef 2026