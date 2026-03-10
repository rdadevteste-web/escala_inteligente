# Arquitetura Backend Inicial

## Premissas

* Arquitetura modular por dominio de negocio.
* Nenhum modulo acessa implementacao interna de outro modulo diretamente.
* Regras compartilhadas ficam apenas em `src/shared`.
* Banco PostgreSQL com auditoria central e exclusao logica.
* Cada tabela criada no MVP precisa ter `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by` e `status`.

## Estrutura inicial

```text
backend/
  src/
    app.js
    server.js
    shared/
      config/
      database/
      errors/
      http/
      logger/
      modules/
      security/
    modules/
      administracao/
      comercial/
      operacional/
      rh/
      auditoria/
```

## Regras de modularidade

* Cada modulo expoe apenas um `index.js` para registrar rotas.
* Servicos e repositorios ficam dentro do proprio modulo.
* Quando um modulo precisar de dados de outro, a comunicacao deve acontecer por contratos explicitos, nunca por importacao transversal de detalhes internos.
* Infraestrutura tecnica comum nao pode conter regra de negocio de dominio.

## Banco e auditoria

* A migration `database/migrations/001_initial_foundation.sql` cria a base de Administracao e a infraestrutura de logs.
* A migration `database/migrations/002_admin_uniqueness.sql` adiciona indices unicos para segurar integridade sem depender apenas da aplicacao.
* A migration `database/migrations/003_admin_rbac_indexes.sql` melhora consulta dos vinculos de acesso.
* A funcao `audit_row_changes()` registra `insert`, `update` e `delete` em `auditoria_logs`.
* A funcao `set_row_timestamps()` padroniza `created_at` e `updated_at`.
* `sistema_logs` fica reservado para falhas tecnicas, integracoes e eventos de runtime.
* O backend passa o usuario operador para o banco pelo header `x-user-id`, permitindo preencher o contexto `app.current_user_id` para as triggers de auditoria.

## Autenticacao inicial

* Senhas passam a ser armazenadas com hash via `scrypt` nativo do Node.
* O endpoint `POST /api/v1/administracao/auth/login` valida `login` e `senha`.
* O login retorna um token assinado em HMAC SHA-256 e a lista de perfis do usuario.
* O segredo do token e configurado em `AUTH_TOKEN_SECRET`.

## CRUD inicial implementado

O modulo `administracao` ja possui CRUD inicial para:

* `usuarios`
* `perfis_acesso`
* `permissoes`
* vinculo `usuario_perfis`
* vinculo `perfil_permissoes`

## Proximo incremento sugerido

1. Aplicar middleware de autorizacao usando o token emitido no login.
2. Criar CRUD de `filiais`, `aeroportos` e `cargos`.
3. Depois abrir Comercial, RH e Operacional no mesmo padrao.
