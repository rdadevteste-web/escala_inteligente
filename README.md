# ERP Aeroportuario

Base inicial de documentacao e desenvolvimento para estruturar um ERP de servicos aeroportuarios, com foco em arquitetura modular, banco robusto e auditoria completa.

## Estrutura

```text
docs/
  01-visao-geral.md
  02-modulos.md
  03-tabelas.md
  04-regras-de-negocio.md
  05-auditoria-e-logs.md
  06-modelo-logico-mvp.md
  07-arquitetura-backend.md
backend/
  package.json
  .env.example
  src/
database/
  migrations/
    001_initial_foundation.sql
  seeds/
  diagramas/
    mvp-dicionario-dados.csv
frontend/
```

## Documentos

* [Visao geral](docs/01-visao-geral.md)
* [Modulos](docs/02-modulos.md)
* [Tabelas por modulo](docs/03-tabelas.md)
* [Regras de negocio](docs/04-regras-de-negocio.md)
* [Auditoria e logs](docs/05-auditoria-e-logs.md)
* [Modelo logico MVP](docs/06-modelo-logico-mvp.md)
* [Arquitetura backend](docs/07-arquitetura-backend.md)
* [Dicionario de dados MVP CSV](database/diagramas/mvp-dicionario-dados.csv)

## Backend inicial

A primeira base do backend foi criada em Node.js ESM, com modulos isolados para `administracao`, `comercial`, `operacional`, `rh` e `auditoria`.

### Executar localmente

```powershell
cd backend
Copy-Item .env.example .env
node src/server.js
```

Rotas iniciais:

* `GET /`
* `GET /health`
* `GET /api/v1/administracao`
* `GET /api/v1/administracao/usuarios`
* `GET /api/v1/comercial`
* `GET /api/v1/operacional`
* `GET /api/v1/rh`
* `GET /api/v1/auditoria`

## Banco de dados

A migration [001_initial_foundation.sql](database/migrations/001_initial_foundation.sql) cria a base inicial de Administracao, `auditoria_logs`, `sistema_logs` e triggers para rastrear `insert`, `update` e `delete` nas tabelas criadas.

## Proximo passo recomendado

Conectar o backend ao PostgreSQL e evoluir o modulo de Administracao para CRUD completo, mantendo o mesmo padrao para os demais modulos.
