BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_login_ativo
  ON usuarios (login)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_email_ativo
  ON usuarios (email)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_perfis_acesso_nome_ativo
  ON perfis_acesso (nome)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_permissoes_modulo_acao_ativo
  ON permissoes (modulo, acao)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuario_perfis_ativo
  ON usuario_perfis (usuario_id, perfil_id, COALESCE(filial_id, 0))
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_perfil_permissoes_ativo
  ON perfil_permissoes (perfil_id, permissao_id)
  WHERE deleted_at IS NULL;

COMMIT;
