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
  scripts/
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
    001_admin_bootstrap.md
  diagramas/
    mvp-dicionario-dados.csv
frontend/
  index.html
  app.css
  app.js
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
* [Bootstrap admin seed](database/seeds/001_admin_bootstrap.md)

## Backend inicial

A base do backend foi criada em Node.js ESM, com modulos isolados para `administracao`, `comercial`, `operacional`, `rh` e `auditoria`, conexao PostgreSQL via `pg`, autenticacao por Bearer token e autorizacao inicial por permissao.

### Executar localmente

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run seed:admin
node src/server.js
```

### Teste via frontend

Com o backend rodando, abra [http://localhost:3000/app](http://localhost:3000/app).

Essa interface minima permite:

* fazer login com o usuario bootstrap
* visualizar o token emitido
* consultar `usuarios`, `perfis`, `permissoes`, `aeroportos`, `filiais` e `cargos`

Credenciais padrao do bootstrap:

* login: `admin`
* senha: `Admin@123`

### Fluxo minimo de acesso

1. Aplicar migrations no PostgreSQL.
2. Rodar `npm.cmd run seed:admin` em `backend/`.
3. Fazer login em `POST /api/v1/administracao/auth/login` ou via `/app`.
4. Enviar `Authorization: Bearer <token>` nas rotas protegidas.

## Banco de dados

As migrations [001_initial_foundation.sql](database/migrations/001_initial_foundation.sql), [002_admin_uniqueness.sql](database/migrations/002_admin_uniqueness.sql), [003_admin_rbac_indexes.sql](database/migrations/003_admin_rbac_indexes.sql) e [004_admin_structure_uniqueness.sql](database/migrations/004_admin_structure_uniqueness.sql) cobrem fundacao administrativa, auditoria, RBAC e integridade estrutural.

## Proximo passo recomendado

Abrir `funcoes_operacionais`, `tipos_jornada` e `escalas_modelo`, e em seguida iniciar o modulo Comercial.
