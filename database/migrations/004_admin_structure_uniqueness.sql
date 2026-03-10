BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS uq_aeroportos_iata_ativo
  ON aeroportos (codigo_iata)
  WHERE deleted_at IS NULL AND codigo_iata IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_aeroportos_icao_ativo
  ON aeroportos (codigo_icao)
  WHERE deleted_at IS NULL AND codigo_icao IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_filiais_empresa_nome_ativo
  ON filiais (empresa_id, nome)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cargos_nome_ativo
  ON cargos (nome)
  WHERE deleted_at IS NULL;

COMMIT;
