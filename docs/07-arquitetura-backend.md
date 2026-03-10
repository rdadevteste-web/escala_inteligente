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
* A funcao `audit_row_changes()` registra `insert`, `update` e `delete` em `auditoria_logs`.
* A funcao `set_row_timestamps()` padroniza `created_at` e `updated_at`.
* `sistema_logs` fica reservado para falhas tecnicas, integracoes e eventos de runtime.
* O backend passa o usuario operador para o banco pelo header `x-user-id`, permitindo preencher o contexto `app.current_user_id` para as triggers de auditoria.

## CRUD inicial implementado

O modulo `administracao` ja possui CRUD inicial de `usuarios`:

* `GET /api/v1/administracao/usuarios`
* `GET /api/v1/administracao/usuarios/:id`
* `POST /api/v1/administracao/usuarios`
* `PUT /api/v1/administracao/usuarios/:id`
* `DELETE /api/v1/administracao/usuarios/:id`

## Proximo incremento sugerido

1. Aplicar a migration em um PostgreSQL real.
2. Implementar persistencia de perfis, permissoes e filiais.
3. Criar segunda migration com Comercial, RH e Operacional.
4. Adicionar autenticacao e hash real de senha.
