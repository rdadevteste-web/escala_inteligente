const assignmentColumns = `
  up.id,
  up.usuario_id,
  up.perfil_id,
  up.filial_id,
  up.status,
  up.created_at,
  up.updated_at,
  p.nome AS perfil_nome
`;

export const createUserProfileRepository = (database) => ({
  async findByUserId(userId) {
    const result = await database.query(
      `SELECT ${assignmentColumns}
       FROM usuario_perfis up
       INNER JOIN perfis_acesso p ON p.id = up.perfil_id
       WHERE up.usuario_id = $1
         AND up.deleted_at IS NULL
       ORDER BY up.id ASC`,
      [userId],
    );

    return result.rows;
  },

  async findPermissionKeysByUserId(userId) {
    const result = await database.query(
      `SELECT DISTINCT CONCAT(pm.modulo, ':', pm.acao) AS permission_key
       FROM usuario_perfis up
       INNER JOIN perfil_permissoes pp ON pp.perfil_id = up.perfil_id AND pp.deleted_at IS NULL
       INNER JOIN permissoes pm ON pm.id = pp.permissao_id AND pm.deleted_at IS NULL
       WHERE up.usuario_id = $1
         AND up.deleted_at IS NULL
         AND up.status = 'ativo'`,
      [userId],
    );

    return result.rows.map((row) => row.permission_key);
  },

  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO usuario_perfis (
          usuario_id,
          perfil_id,
          filial_id,
          created_by,
          updated_by,
          status
        ) VALUES ($1, $2, $3, $4, $4, 'ativo')
        RETURNING id, usuario_id, perfil_id, filial_id, status, created_at, updated_at`,
        [input.usuarioId, input.perfilId, input.filialId, actorId],
      );

      return result.rows[0];
    });
  },

  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE usuario_perfis
         SET deleted_at = NOW(),
             deleted_by = $2,
             updated_by = $2,
             status = 'inativo'
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING id, usuario_id, perfil_id, filial_id, status, created_at, updated_at, deleted_at`,
        [id, actorId],
      );

      return result.rows[0] ?? null;
    });
  },
});
