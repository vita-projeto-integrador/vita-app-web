# VITA Web

Plataforma web do **VITA**, um sistema que identifica a **pinta preta dos citros** (*Phyllosticta citricarpa*) em fotos de tangerina Ponkan usando visão computacional.

Este repositório é o painel web do projeto. É por ele que o produtor ou o estudante consulta as análises que fez, envia fotos pelo computador, acompanha os resultados e vê no mapa onde a doença apareceu.

> Projeto Integrador da Fatec, desenvolvido pela equipe **ByteForge**. Ainda está em construção: algumas telas já conversam com a API e outras ainda mostram dados de exemplo. A lista de features abaixo deixa claro o que é o quê.

---

## Sumário

- [Por que o VITA existe](#por-que-o-vita-existe)
- [Onde o Web entra no projeto](#onde-o-web-entra-no-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como rodar](#como-rodar)
- [Features](#features)
- [Equipe](#equipe)

---

## Por que o VITA existe

A tangerina Ponkan é uma das culturas mais importantes do Vale do Ribeira, e boa parte da produção vem da agricultura familiar. A pinta preta é uma doença causada por fungo que mancha a casca e derruba o fruto antes da hora. Fruto manchado perde valor de venda. Além disso, as lesões da pinta preta podem ser confundidas com dano mecânico ou de inseto, então nem sempre o produtor tem certeza do que está vendo.

A ideia do VITA é dar ao produtor uma segunda opinião rápida: ele tira fotos do fruto, uma rede neural convolucional (CNN) classifica a imagem como **com** ou **sem** pinta preta, e o sistema sugere um plano de ação. Com a localização das fotos, também dá para ver no mapa onde a doença está aparecendo.

## Onde o Web entra no projeto

O VITA é dividido em alguns repositórios na organização `vita-projeto-integrador`:

| Repositório | O que faz |
| --- | --- |
| **Web** (este) | Painel de gestão e consulta: histórico, upload pelo computador, detalhes e mapa |
| `vita-app-mobile` | App Android (React Native + Expo), usado em campo, direto na câmera do celular |
| `vita-api` | API REST em TypeScript: usuários, análises, fila de processamento, imagens |
| `vita-ai` | Treino da CNN e o serviço de inferência que a API vai consumir |
| `vita-database` | Modelagem do banco de dados |

O app mobile é a ferramenta de campo. O Web é a ferramenta de escritório, onde se olha o histórico com calma e se gerencia as análises. Os dois usam a mesma API e o mesmo contrato.

## Tecnologias

| Tecnologia | Para que usamos |
| --- | --- |
| [Next.js 16](https://nextjs.org/) (App Router) | Rotas, páginas e Server Actions |
| React 19 + React Compiler | Interface; o compilador cuida da memoização que antes era feita à mão |
| TypeScript | Tipagem do código e do contrato com a API |
| Tailwind CSS 4 + shadcn/ui (Radix) | Estilo e componentes acessíveis (dialog, sheet, dropdown, tooltip...) |
| React Hook Form + Zod 4 | Formulários e validação (as mesmas regras da API) |
| Axios | Chamadas HTTP para a API, sempre a partir do servidor Next |
| TanStack Table | Tabela de análises com paginação controlada pela API |
| React Leaflet | Mapa de análises |
| Recharts | Gráficos do dashboard |
| Framer Motion | Animações da landing page |
| `server-only` | Garante que o código que fala com a API nunca vá parar no navegador |

## Arquitetura

### Pastas

```
src/
├── app/                  # rotas (App Router)
│   ├── (marketing)/      # landing page pública
│   ├── (auth)/           # login e cadastro
│   └── app/              # área logada: dashboard, análises, mapa, conta...
├── actions/              # Server Actions chamadas pelo navegador (ex.: logout)
├── services/             # tudo que fala com a API (só roda no servidor)
│   ├── api.ts            # instância do axios + token do cookie
│   ├── request.ts        # helper único: trata sucesso, erro e sessão vencida
│   ├── session.ts        # grava e apaga os cookies de sessão
│   ├── auth.ts           # login e cadastro
│   └── analysis.ts       # lista, detalhes, upload e mapa
├── types/api.ts          # tipos do contrato da API (espelho dos DTOs)
├── lib/                  # funções puras: rótulos, datas, JWT, mapa
├── schemas/              # validações Zod dos formulários
├── components/
│   ├── ui/               # componentes base (shadcn)
│   └── layout/           # componentes das telas (tabela, folha de detalhes, mapa...)
└── proxy.ts              # protege /app e redireciona quem não está logado
```

### Como uma tela fala com a API

O navegador **nunca** chama a API diretamente. Quem chama é o servidor Next, por meio das Server Actions em `src/services`:

```
Componente (navegador)
   │  chama listAnalyses(page)
   ▼
Server Action em services/analysis.ts   ← roda no servidor Next
   │  request() pega o token do cookie httpOnly
   ▼
API (vita-api)  →  { success, message, data }
   │
   ▼
ApiResult<T> volta para o componente: { success: true, data } ou { success: false, message, errors }
```

Fizemos assim por três motivos:

1. **O token fica num cookie `httpOnly`.** O JavaScript da página não consegue ler esse cookie, então um script malicioso também não consegue.
2. **Os erros chegam sempre no mesmo formato.** As telas não precisam de `try/catch`: elas olham `response.success` e mostram `response.message`.
3. **Sessão vencida é tratada num lugar só.** Quando a API responde 401, o `request()` apaga os cookies e manda para o `/login`.

### Contrato com a API

Os tipos em `src/types/api.ts` são uma cópia dos DTOs da API. Duas regras que vale saber antes de mexer:

- **Nomes dos campos:** os campos de domínio vêm em português (`criado_em`, `total_imagens`, `classificacao`). O envelope (`success`, `message`, `data`) e a paginação (`items`, `page`, `total_pages`) vêm em inglês.
- **Imagens:** a API não manda o caminho do arquivo. Ela manda uma **URL assinada**, que vale por 60 minutos. Por isso as imagens usam `unoptimized` no `<Image>`: o navegador busca a imagem direto na API, sem passar pelo otimizador do Next, que recusa endereços locais como `localhost`.

## Como rodar

### Requisitos

- Node.js 20.9 ou mais novo
- npm
- A **API VITA rodando** (veja o README do `vita-api`). Sem ela, o login não funciona.

### Passo a passo

1. Clone e instale:

   ```bash
   git clone <url-do-repositorio>
   cd <pasta-do-repositorio>
   npm install
   ```

2. Crie o `.env.local` a partir do exemplo:

   ```bash
   cp .env.example .env.local
   ```

   ```bash
   # endereço da API (lido só no servidor Next)
   API_URL=http://localhost:8080/api

   # endereço das imagens: igual ao STORAGE_PUBLIC_URL da API
   FILES_URL=http://localhost:8080/api/files
   ```

3. Suba em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000).

4. Entre com um usuário do seed da API:

   | E-mail | Senha |
   | --- | --- |
   | `produtor@vita.dev` | `senha123` |
   | `estudante@vita.dev` | `senha123` |

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento, recompila a cada alteração |
| `npm run build` | Gera a versão de produção |
| `npm start` | Serve a versão de produção (precisa de um `build` antes) |
| `npm run lint` | Roda o ESLint |

### Problemas que já tivemos

- **Mudei o código e o `npm start` não mudou nada.** O `next start` só serve o último build. Rode `npm run build` de novo, ou use `npm run dev` enquanto estiver desenvolvendo.
- **As imagens não aparecem.** Abra a imagem em uma nova guia e veja a resposta. Na maioria das vezes, o `FILES_URL` daqui está diferente do `STORAGE_PUBLIC_URL` da API.
- **Testando junto com o celular.** Se a API estiver no IP da rede (ex.: `http://192.168.0.10:8080`), use esse mesmo IP no `API_URL` e no `FILES_URL`. O navegador da sua máquina também alcança esse endereço.
- **O build falha baixando fontes.** O `next/font/google` baixa as fontes Lexend, Inter e Geist durante o build, então ele precisa de internet.

## Features

### Funcionando com a API

- [x] Landing page do projeto (apresentação, dispositivos, tecnologias, equipe, perguntas frequentes)
- [x] Cadastro em etapas, com validação igual à da API. O perfil é definido pelo "Sou um estudante": marcado vira estudante, desmarcado vira produtor
- [x] Login e logout, com sessão em cookie `httpOnly` que dura o mesmo que o token
- [x] Proteção da área logada: quem não está logado, ou tem a sessão vencida, vai para o `/login`
- [x] Lista de análises paginada, com status (Na fila, Processando, Finalizada, Falhou) e resultado
- [x] Upload de 1 a 4 imagens (JPG, PNG ou WEBP, até 5 MB cada), com prévia e validação antes do envio
- [x] Folha de detalhes: diagnóstico, confiança, tempo de execução, modelo, imagens e plano de ação
- [x] Mapa de análises com filtros de período, status e classe

## Equipe

**ByteForge**: Arthur Parra, Danieli Fiel, Guilherme Pereira, Gustavo Kletelinger e Matheus Oliveira.

Faculdade de Tecnologia do Estado de São Paulo (Fatec).
