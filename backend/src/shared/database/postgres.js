import pg from 'pg';

const { Pool } = pg;

export const createPostgresPool = (env, logger) => {
  const pool = new Pool({
    connectionString: env.databaseUrl,
    max: env.databasePoolMax,
  });

  pool.on('error', (error) => {
    logger.error('PostgreSQL pool error', {
      error: error.message,
      stack: error.stack,
    });
  });

  return {
    async query(text, params = []) {
      return pool.query(text, params);
    },
    async withUserContext(userId, callback) {
      const client = await pool.connect();

      try {
        if (userId) {
          await client.query('SELECT set_config($1, $2, true)', [
            'app.current_user_id',
            String(userId),
          ]);
        }

        return await callback(client);
      } finally {
        client.release();
      }
    },
    async close() {
      await pool.end();
    },
  };
};
