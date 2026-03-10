BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_row_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  IF TG_OP = 'INSERT' THEN
    NEW.created_at = COALESCE(NEW.created_at, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS auditoria_logs (
  id BIGSERIAL PRIMARY KEY,
  tabela_nome VARCHAR(120) NOT NULL,
  registro_id BIGINT,
  acao VARCHAR(30) NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  usuario_id BIGINT,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_origem VARCHAR(45),
  origem_sistema VARCHAR(30),
  observacoes TEXT
);

CREATE TABLE IF NOT EXISTS sistema_logs (
  id BIGSERIAL PRIMARY KEY,
  tipo_log VARCHAR(30) NOT NULL,
  modulo VARCHAR(80) NOT NULL,
  mensagem TEXT NOT NULL,
  detalhes TEXT,
  stack_trace TEXT,
  usuario_id BIGINT,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  origem VARCHAR(30)
);

CREATE OR REPLACE FUNCTION audit_row_changes()
RETURNS TRIGGER AS $$
DECLARE
  actor_id BIGINT;
  old_payload JSONB;
  new_payload JSONB;
BEGIN
  BEGIN
    actor_id := NULLIF(current_setting('app.current_user_id', true), '')::BIGINT;
  EXCEPTION
    WHEN OTHERS THEN
      actor_id := NULL;
  END;

  IF TG_OP = 'INSERT' THEN
    old_payload := NULL;
    new_payload := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    old_payload := to_jsonb(OLD);
    new_payload := to_jsonb(NEW);
  ELSE
    old_payload := to_jsonb(OLD);
    new_payload := NULL;
  END IF;

  INSERT INTO auditoria_logs (
    tabela_nome,
    registro_id,
    acao,
    dados_anteriores,
    dados_novos,
    usuario_id,
    data_hora,
    origem_sistema
  ) VALUES (
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    LOWER(TG_OP),
    old_payload,
    new_payload,
    actor_id,
    NOW(),
    'database-trigger'
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS empresas (
  id BIGSERIAL PRIMARY KEY,
  razao_social VARCHAR(180) NOT NULL,
  nome_fantasia VARCHAR(180),
  cnpj VARCHAR(18),
  telefone VARCHAR(30),
  email VARCHAR(150),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,
  deleted_by BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS aeroportos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  codigo_iata VARCHAR(3),
  codigo_icao VARCHAR(4),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  pais VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,
  deleted_by BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS filiais (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES empresas(id),
  aeroporto_id BIGINT REFERENCES aeroportos(id),
  nome VARCHAR(150) NOT NULL,
  sigla VARCHAR(20),
  cnpj VARCHAR(18),
  telefone VARCHAR(30),
  email VARCHAR(150),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,
  deleted_by BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  login VARCHAR(80) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  ultimo_acesso_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT,
  updated_by BIGINT,
  deleted_by BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

ALTER TABLE empresas
  ADD CONSTRAINT fk_empresas_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_empresas_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_empresas_deleted_by FOREIGN KEY (deleted_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE aeroportos
  ADD CONSTRAINT fk_aeroportos_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_aeroportos_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_aeroportos_deleted_by FOREIGN KEY (deleted_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE filiais
  ADD CONSTRAINT fk_filiais_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_filiais_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_filiais_deleted_by FOREIGN KEY (deleted_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuarios_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_usuarios_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_usuarios_deleted_by FOREIGN KEY (deleted_by) REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS perfis_acesso (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS permissoes (
  id BIGSERIAL PRIMARY KEY,
  modulo VARCHAR(80) NOT NULL,
  acao VARCHAR(80) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS usuario_perfis (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  perfil_id BIGINT NOT NULL REFERENCES perfis_acesso(id),
  filial_id BIGINT REFERENCES filiais(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS perfil_permissoes (
  id BIGSERIAL PRIMARY KEY,
  perfil_id BIGINT NOT NULL REFERENCES perfis_acesso(id),
  permissao_id BIGINT NOT NULL REFERENCES permissoes(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS cargos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  nivel VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS funcoes_operacionais (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  requer_treinamento BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS tipos_jornada (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  carga_horaria_semanal NUMERIC(5,2) NOT NULL,
  horas_dia_padrao NUMERIC(4,2) NOT NULL,
  escala_base VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS escalas_modelo (
  id BIGSERIAL PRIMARY KEY,
  tipo_jornada_id BIGINT NOT NULL REFERENCES tipos_jornada(id),
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  quantidade_dias_trabalho INT NOT NULL,
  quantidade_dias_folga INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  updated_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  deleted_by BIGINT REFERENCES usuarios(id) DEFERRABLE INITIALLY DEFERRED,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo'
);

CREATE INDEX IF NOT EXISTS idx_auditoria_logs_tabela_registro ON auditoria_logs (tabela_nome, registro_id);
CREATE INDEX IF NOT EXISTS idx_sistema_logs_modulo_data ON sistema_logs (modulo, data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios (status);
CREATE INDEX IF NOT EXISTS idx_usuario_perfis_usuario ON usuario_perfis (usuario_id);
CREATE INDEX IF NOT EXISTS idx_perfil_permissoes_perfil ON perfil_permissoes (perfil_id);

DROP TRIGGER IF EXISTS trg_empresas_timestamps ON empresas;
CREATE TRIGGER trg_empresas_timestamps BEFORE INSERT OR UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_empresas_audit ON empresas;
CREATE TRIGGER trg_empresas_audit AFTER INSERT OR UPDATE OR DELETE ON empresas FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_aeroportos_timestamps ON aeroportos;
CREATE TRIGGER trg_aeroportos_timestamps BEFORE INSERT OR UPDATE ON aeroportos FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_aeroportos_audit ON aeroportos;
CREATE TRIGGER trg_aeroportos_audit AFTER INSERT OR UPDATE OR DELETE ON aeroportos FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_filiais_timestamps ON filiais;
CREATE TRIGGER trg_filiais_timestamps BEFORE INSERT OR UPDATE ON filiais FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_filiais_audit ON filiais;
CREATE TRIGGER trg_filiais_audit AFTER INSERT OR UPDATE OR DELETE ON filiais FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_usuarios_timestamps ON usuarios;
CREATE TRIGGER trg_usuarios_timestamps BEFORE INSERT OR UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_usuarios_audit ON usuarios;
CREATE TRIGGER trg_usuarios_audit AFTER INSERT OR UPDATE OR DELETE ON usuarios FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_perfis_acesso_timestamps ON perfis_acesso;
CREATE TRIGGER trg_perfis_acesso_timestamps BEFORE INSERT OR UPDATE ON perfis_acesso FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_perfis_acesso_audit ON perfis_acesso;
CREATE TRIGGER trg_perfis_acesso_audit AFTER INSERT OR UPDATE OR DELETE ON perfis_acesso FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_permissoes_timestamps ON permissoes;
CREATE TRIGGER trg_permissoes_timestamps BEFORE INSERT OR UPDATE ON permissoes FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_permissoes_audit ON permissoes;
CREATE TRIGGER trg_permissoes_audit AFTER INSERT OR UPDATE OR DELETE ON permissoes FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_usuario_perfis_timestamps ON usuario_perfis;
CREATE TRIGGER trg_usuario_perfis_timestamps BEFORE INSERT OR UPDATE ON usuario_perfis FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_usuario_perfis_audit ON usuario_perfis;
CREATE TRIGGER trg_usuario_perfis_audit AFTER INSERT OR UPDATE OR DELETE ON usuario_perfis FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_perfil_permissoes_timestamps ON perfil_permissoes;
CREATE TRIGGER trg_perfil_permissoes_timestamps BEFORE INSERT OR UPDATE ON perfil_permissoes FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_perfil_permissoes_audit ON perfil_permissoes;
CREATE TRIGGER trg_perfil_permissoes_audit AFTER INSERT OR UPDATE OR DELETE ON perfil_permissoes FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_cargos_timestamps ON cargos;
CREATE TRIGGER trg_cargos_timestamps BEFORE INSERT OR UPDATE ON cargos FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_cargos_audit ON cargos;
CREATE TRIGGER trg_cargos_audit AFTER INSERT OR UPDATE OR DELETE ON cargos FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_funcoes_operacionais_timestamps ON funcoes_operacionais;
CREATE TRIGGER trg_funcoes_operacionais_timestamps BEFORE INSERT OR UPDATE ON funcoes_operacionais FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_funcoes_operacionais_audit ON funcoes_operacionais;
CREATE TRIGGER trg_funcoes_operacionais_audit AFTER INSERT OR UPDATE OR DELETE ON funcoes_operacionais FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_tipos_jornada_timestamps ON tipos_jornada;
CREATE TRIGGER trg_tipos_jornada_timestamps BEFORE INSERT OR UPDATE ON tipos_jornada FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_tipos_jornada_audit ON tipos_jornada;
CREATE TRIGGER trg_tipos_jornada_audit AFTER INSERT OR UPDATE OR DELETE ON tipos_jornada FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

DROP TRIGGER IF EXISTS trg_escalas_modelo_timestamps ON escalas_modelo;
CREATE TRIGGER trg_escalas_modelo_timestamps BEFORE INSERT OR UPDATE ON escalas_modelo FOR EACH ROW EXECUTE FUNCTION set_row_timestamps();
DROP TRIGGER IF EXISTS trg_escalas_modelo_audit ON escalas_modelo;
CREATE TRIGGER trg_escalas_modelo_audit AFTER INSERT OR UPDATE OR DELETE ON escalas_modelo FOR EACH ROW EXECUTE FUNCTION audit_row_changes();

COMMIT;
