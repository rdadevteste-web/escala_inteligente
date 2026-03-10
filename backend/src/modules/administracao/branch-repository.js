const branchColumns = `
  id,
  empresa_id,
  aeroporto_id,
  nome,
  sigla,
  cnpj,
  telefone,
  email,
  status,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createBranchRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${branchColumns}
       FROM filiais
       WHERE deleted_at IS NULL
       ORDER BY nome ASC`,
    );
    return result.rows;
  },
  async findById(id) {
    const result = await database.query(
      `SELECT ${branchColumns}
       FROM filiais
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0] ?? null;
  },
  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO filiais (
          empresa_id, aeroporto_id, nome, sigla, cnpj, telefone, email,
          created_by, updated_by, status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9)
        RETURNING ${branchColumns}`,
        [input.empresaId, input.aeroportoId, input.nome, input.sigla, input.cnpj, input.telefone, input.email, actorId, input.status],
      );
      return result.rows[0];
    });
  },
  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE filiais
         SET empresa_id = $2,
             aeroporto_id = $3,
             nome = $4,
             sigla = $5,
             cnpj = $6,
             telefone = $7,
             email = $8,
             status = $9,
             updated_by = $10
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${branchColumns}`,
        [id, input.empresaId, input.aeroportoId, input.nome, input.sigla, input.cnpj, input.telefone, input.email, input.status, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE filiais
         SET deleted_at = NOW(), deleted_by = $2, updated_by = $2, status = 'inativo'
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${branchColumns}`,
        [id, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
});
