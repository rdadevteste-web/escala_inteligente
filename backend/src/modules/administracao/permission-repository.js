const permissionColumns = `
  id,
  modulo,
  acao,
  descricao,
  status,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createPermissionRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${permissionColumns}
       FROM permissoes
       WHERE deleted_at IS NULL
       ORDER BY modulo ASC, acao ASC`,
    );

    return result.rows;
  },

  async findById(id) {
    const result = await database.query(
      `SELECT ${permissionColumns}
       FROM permissoes
       WHERE id = $1
         AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0] ?? null;
  },

  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO permissoes (
          modulo,
          acao,
          descricao,
          created_by,
          updated_by,
          status
        ) VALUES ($1, $2, $3, $4, $4, $5)
        RETURNING ${permissionColumns}`,
        [input.modulo, input.acao, input.descricao, actorId, input.status],
      );

      return result.rows[0];
    });
  },

  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE permissoes
         SET modulo = $2,
             acao = $3,
             descricao = $4,
             status = $5,
             updated_by = $6
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${permissionColumns}`,
        [id, input.modulo, input.acao, input.descricao, input.status, actorId],
      );

      return result.rows[0] ?? null;
    });
  },

  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE permissoes
         SET deleted_at = NOW(),
             deleted_by = $2,
             updated_by = $2,
             status = 'inativo'
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${permissionColumns}`,
        [id, actorId],
      );

      return result.rows[0] ?? null;
    });
  },
});
