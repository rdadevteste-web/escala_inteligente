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
    002_admin_uniqueness.sql
    003_admin_rbac_indexes.sql
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

A base do backend foi criada em Node.js ESM, com modulos isolados para `administracao`, `comercial`, `operacional`, `rh` e `auditoria`, e conexao preparada para PostgreSQL via `pg`.

### Executar localmente

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
node src/server.js
```

Rotas de acesso e Administracao:

* `POST /api/v1/administracao/auth/login`
* `GET /api/v1/administracao/usuarios`
* `GET /api/v1/administracao/usuarios/:id`
* `POST /api/v1/administracao/usuarios`
* `PUT /api/v1/administracao/usuarios/:id`
* `DELETE /api/v1/administracao/usuarios/:id`
* `GET /api/v1/administracao/perfis`
* `GET /api/v1/administracao/perfis/:id`
* `POST /api/v1/administracao/perfis`
* `PUT /api/v1/administracao/perfis/:id`
* `DELETE /api/v1/administracao/perfis/:id`
* `GET /api/v1/administracao/perfis/:id/permissoes`
* `POST /api/v1/administracao/perfis/:id/permissoes`
* `DELETE /api/v1/administracao/perfis/:id/permissoes/:assignmentId`
* `GET /api/v1/administracao/permissoes`
* `GET /api/v1/administracao/permissoes/:id`
* `POST /api/v1/administracao/permissoes`
* `PUT /api/v1/administracao/permissoes/:id`
* `DELETE /api/v1/administracao/permissoes/:id`
* `GET /api/v1/administracao/usuarios/:id/perfis`
* `POST /api/v1/administracao/usuarios/:id/perfis`
* `DELETE /api/v1/administracao/usuarios/:id/perfis/:assignmentId`

Rotas modulares de base:

* `GET /`
* `GET /health`
* `GET /api/v1/comercial`
* `GET /api/v1/operacional`
* `GET /api/v1/rh`
* `GET /api/v1/auditoria`

Para propagar o usuario responsavel para auditoria automatica no banco, envie o header `x-user-id` nas operacoes de escrita.

## Banco de dados

As migrations [001_initial_foundation.sql](database/migrations/001_initial_foundation.sql), [002_admin_uniqueness.sql](database/migrations/002_admin_uniqueness.sql) e [003_admin_rbac_indexes.sql](database/migrations/003_admin_rbac_indexes.sql) criam a base inicial de Administracao, auditoria, unicidade e performance basica para RBAC.

## Proximo passo recomendado

Aplicar middleware de autorizacao com o token emitido no login e depois abrir `filiais`, `aeroportos` e `cargos` como proxima camada administrativa.
