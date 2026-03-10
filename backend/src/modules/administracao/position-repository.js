const positionColumns = `
  id,
  nome,
  descricao,
  nivel,
  status,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createPositionRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${positionColumns}
       FROM cargos
       WHERE deleted_at IS NULL
       ORDER BY nome ASC`,
    );
    return result.rows;
  },
  async findById(id) {
    const result = await database.query(
      `SELECT ${positionColumns}
       FROM cargos
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0] ?? null;
  },
  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO cargos (
          nome, descricao, nivel, created_by, updated_by, status
        ) VALUES ($1,$2,$3,$4,$4,$5)
        RETURNING ${positionColumns}`,
        [input.nome, input.descricao, input.nivel, actorId, input.status],
      );
      return result.rows[0];
    });
  },
  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE cargos
         SET nome = $2,
             descricao = $3,
             nivel = $4,
             status = $5,
             updated_by = $6
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${positionColumns}`,
        [id, input.nome, input.descricao, input.nivel, input.status, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE cargos
         SET deleted_at = NOW(), deleted_by = $2, updated_by = $2, status = 'inativo'
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${positionColumns}`,
        [id, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
});
