BEGIN;

CREATE INDEX IF NOT EXISTS idx_usuario_perfis_usuario_status
  ON usuario_perfis (usuario_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_perfil_permissoes_perfil_status
  ON perfil_permissoes (perfil_id, status)
  WHERE deleted_at IS NULL;

COMMIT;
