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
    004_admin_structure_uniqueness.sql
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

A base do backend foi criada em Node.js ESM, com modulos isolados para `administracao`, `comercial`, `operacional`, `rh` e `auditoria`, conexao PostgreSQL via `pg`, autenticacao por Bearer token e autorizacao inicial por permissao.

### Executar localmente

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
node src/server.js
```

### Fluxo minimo de acesso

1. Criar um usuario diretamente no banco ou via endpoint com contexto autorizado.
2. Vincular perfis e permissoes.
3. Fazer login em `POST /api/v1/administracao/auth/login`.
4. Enviar `Authorization: Bearer <token>` nas demais rotas protegidas.

### Rotas administrativas iniciais

* `POST /api/v1/administracao/auth/login`
* `GET|POST|PUT|DELETE /api/v1/administracao/usuarios...`
* `GET|POST|PUT|DELETE /api/v1/administracao/perfis...`
* `GET|POST|PUT|DELETE /api/v1/administracao/permissoes...`
* `GET|POST|DELETE /api/v1/administracao/usuarios/:id/perfis...`
* `GET|POST|DELETE /api/v1/administracao/perfis/:id/permissoes...`
* `GET|POST|PUT|DELETE /api/v1/administracao/aeroportos...`
* `GET|POST|PUT|DELETE /api/v1/administracao/filiais...`
* `GET|POST|PUT|DELETE /api/v1/administracao/cargos...`

## Banco de dados

As migrations [001_initial_foundation.sql](database/migrations/001_initial_foundation.sql), [002_admin_uniqueness.sql](database/migrations/002_admin_uniqueness.sql), [003_admin_rbac_indexes.sql](database/migrations/003_admin_rbac_indexes.sql) e [004_admin_structure_uniqueness.sql](database/migrations/004_admin_structure_uniqueness.sql) cobrem fundacao administrativa, auditoria, RBAC e integridade estrutural.

## Proximo passo recomendado

Criar seeds iniciais de permissoes e perfil administrador para permitir bootstrap completo do acesso sem insercao manual em banco.
