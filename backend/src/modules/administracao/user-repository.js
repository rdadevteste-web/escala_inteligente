const userColumns = `
  id,
  nome,
  email,
  login,
  status,
  ultimo_acesso_em,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createUserRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${userColumns}
       FROM usuarios
       WHERE deleted_at IS NULL
       ORDER BY id ASC`,
    );

    return result.rows;
  },

  async findById(id) {
    const result = await database.query(
      `SELECT ${userColumns}
       FROM usuarios
       WHERE id = $1
         AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0] ?? null;
  },

  async findAuthByLogin(login) {
    const result = await database.query(
      `SELECT id, nome, email, login, senha_hash, status
       FROM usuarios
       WHERE login = $1
         AND deleted_at IS NULL`,
      [login],
    );

    return result.rows[0] ?? null;
  },

  async touchLastAccess(id) {
    await database.query(
      `UPDATE usuarios
       SET ultimo_acesso_em = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [id],
    );
  },

  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO usuarios (
          nome,
          email,
          login,
          senha_hash,
          created_by,
          updated_by,
          status
        ) VALUES ($1, $2, $3, $4, $5, $5, $6)
        RETURNING ${userColumns}`,
        [
          input.nome,
          input.email,
          input.login,
          input.senhaHash,
          actorId,
          input.status,
        ],
      );

      return result.rows[0];
    });
  },

  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE usuarios
         SET nome = $2,
             email = $3,
             login = $4,
             status = $5,
             updated_by = $6
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${userColumns}`,
        [id, input.nome, input.email, input.login, input.status, actorId],
      );

      return result.rows[0] ?? null;
    });
  },

  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE usuarios
         SET deleted_at = NOW(),
             deleted_by = $2,
             updated_by = $2,
             status = 'inativo'
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING ${userColumns}`,
        [id, actorId],
      );

      return result.rows[0] ?? null;
    });
  },
});
