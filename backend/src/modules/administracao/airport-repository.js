const airportColumns = `
  id,
  nome,
  codigo_iata,
  codigo_icao,
  cidade,
  estado,
  pais,
  status,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by
`;

export const createAirportRepository = (database) => ({
  async findAll() {
    const result = await database.query(
      `SELECT ${airportColumns}
       FROM aeroportos
       WHERE deleted_at IS NULL
       ORDER BY nome ASC`,
    );

    return result.rows;
  },
  async findById(id) {
    const result = await database.query(
      `SELECT ${airportColumns}
       FROM aeroportos
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0] ?? null;
  },
  async create(input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `INSERT INTO aeroportos (
          nome, codigo_iata, codigo_icao, cidade, estado, pais,
          created_by, updated_by, status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8)
        RETURNING ${airportColumns}`,
        [input.nome, input.codigoIata, input.codigoIcao, input.cidade, input.estado, input.pais, actorId, input.status],
      );
      return result.rows[0];
    });
  },
  async update(id, input, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE aeroportos
         SET nome = $2,
             codigo_iata = $3,
             codigo_icao = $4,
             cidade = $5,
             estado = $6,
             pais = $7,
             status = $8,
             updated_by = $9
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${airportColumns}`,
        [id, input.nome, input.codigoIata, input.codigoIcao, input.cidade, input.estado, input.pais, input.status, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
  async softDelete(id, actorId) {
    return database.withUserContext(actorId, async (client) => {
      const result = await client.query(
        `UPDATE aeroportos
         SET deleted_at = NOW(), deleted_by = $2, updated_by = $2, status = 'inativo'
         WHERE id = $1 AND deleted_at IS NULL
         RETURNING ${airportColumns}`,
        [id, actorId],
      );
      return result.rows[0] ?? null;
    });
  },
});
