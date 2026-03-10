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
  scripts/
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

* As migrations `001` a `004` constroem a base inicial de Administracao, RBAC, auditoria e integridade estrutural.
* A funcao `audit_row_changes()` registra `insert`, `update` e `delete` em `auditoria_logs`.
* A funcao `set_row_timestamps()` padroniza `created_at` e `updated_at`.
* `sistema_logs` fica reservado para falhas tecnicas, integracoes e eventos de runtime.
* O backend passa o usuario operador ao banco a partir do bearer token, preenchendo `app.current_user_id` para as triggers de auditoria.

## Autenticacao e autorizacao iniciais

* Senhas sao armazenadas com hash via `scrypt` nativo do Node.
* O endpoint `POST /api/v1/administracao/auth/login` valida `login` e `senha`.
* O login retorna token assinado em HMAC SHA-256 com `sub`, perfis e permissoes.
* As rotas administrativas exigem Bearer token e validam permissao por chave como `administracao:gerenciar_usuarios`.

## Bootstrap inicial

* O script `backend/scripts/seed-admin.js` cria o bootstrap de acesso.
* Ele cria ou atualiza usuario administrador, perfil Administrador, permissoes administrativas e vinculos RBAC.
* O script e idempotente para os registros principais do bootstrap.

## CRUD inicial implementado

O modulo `administracao` ja possui CRUD inicial para:

* `usuarios`
* `perfis_acesso`
* `permissoes`
* `usuario_perfis`
* `perfil_permissoes`
* `aeroportos`
* `filiais`
* `cargos`

## Proximo incremento sugerido

1. Criar middleware reutilizavel para anexar sessao autenticada ao contexto da request.
2. Abrir `funcoes_operacionais`, `tipos_jornada` e `escalas_modelo`.
3. Depois iniciar Comercial no mesmo padrao.
