const profileColumns = `
  id,
  nome,
  descricao,
  status,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createProfileRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${profileColumns}
       FROM perfis_acesso
       WHERE deleted_at IS NULL
       ORDER BY id ASC`,
    );

    return result.rows;
  },

  async findById(id) {
    const result = await database.query(
      `SELECT ${profileColumns}
       FROM perfis_acesso
       WHERE id = $1
         AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0] ?? null;
  },

  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO perfis_acesso (
          nome,
          descricao,
          created_by,
          updated_by,
          status
        ) VALUES ($1, $2, $3, $3, $4)
        RETURNING ${profileColumns}`,
        [input.nome, input.descricao, actorId, input.status],
      );

      return result.rows[0];
    });
  },

  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE perfis_acesso
         SET nome = $2,
             descricao = $3,
             status = $4,
             updated_by = $5
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${profileColumns}`,
        [id, input.nome, input.descricao, input.status, actorId],
      );

      return result.rows[0] ?? null;
    });
  },

  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE perfis_acesso
         SET deleted_at = NOW(),
             deleted_by = $2,
             updated_by = $2,
             status = 'inativo'
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${profileColumns}`,
        [id, actorId],
      );

      return result.rows[0] ?? null;
    });
  },
});
