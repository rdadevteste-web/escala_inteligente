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
* Servicos ficam dentro do proprio modulo.
* Quando um modulo precisar de dados de outro, a comunicacao deve acontecer por contratos explicitos, nunca por importacao transversal de detalhes internos.
* Infraestrutura tecnica comum nao pode conter regra de negocio de dominio.

## Banco e auditoria

* A migration `database/migrations/001_initial_foundation.sql` cria a base de Administracao e a infraestrutura de logs.
* A funcao `audit_row_changes()` registra `insert`, `update` e `delete` em `auditoria_logs`.
* A funcao `set_row_timestamps()` padroniza `created_at` e `updated_at`.
* `sistema_logs` fica reservado para falhas tecnicas, integracoes e eventos de runtime.

## Proximo incremento sugerido

1. Adicionar camada de persistencia PostgreSQL no backend.
2. Implementar CRUD completo do modulo de Administracao.
3. Criar segunda migration com Comercial, RH e Operacional.
4. Adicionar autenticacao e propagacao de `app.current_user_id` para auditoria automatica.
