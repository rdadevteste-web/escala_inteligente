const profilePermissionColumns = `
  pp.id,
  pp.perfil_id,
  pp.permissao_id,
  pp.status,
  pp.created_at,
  pp.updated_at,
  p.nome AS perfil_nome,
  pm.modulo,
  pm.acao
`;

export const createProfilePermissionRepository = (database) => ({
  async findByProfileId(profileId) {
    const result = await database.query(
      `SELECT ${profilePermissionColumns}
       FROM perfil_permissoes pp
       INNER JOIN perfis_acesso p ON p.id = pp.perfil_id
       INNER JOIN permissoes pm ON pm.id = pp.permissao_id
       WHERE pp.perfil_id = $1
         AND pp.deleted_at IS NULL
       ORDER BY pp.id ASC`,
      [profileId],
    );

    return result.rows;
  },

  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO perfil_permissoes (
          perfil_id,
          permissao_id,
          created_by,
          updated_by,
          status
        ) VALUES ($1, $2, $3, $3, 'ativo')
        RETURNING id, perfil_id, permissao_id, status, created_at, updated_at`,
        [input.perfilId, input.permissaoId, actorId],
      );

      return result.rows[0];
    });
  },

  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE perfil_permissoes
         SET deleted_at = NOW(),
             deleted_by = $2,
             updated_by = $2,
             status = 'inativo'
         WHERE id = $1
           AND deleted_at IS NULL
         RETURNING id, perfil_id, permissao_id, status, created_at, updated_at, deleted_at`,
        [id, actorId],
      );

      return result.rows[0] ?? null;
    });
  },
});
