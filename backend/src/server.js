import http from 'node:http';
import { createApp } from './app.js';
import { env } from './shared/config/env.js';
import { createPostgresPool } from './shared/database/postgres.js';
import { logger } from './shared/logger/logger.js';

const database = createPostgresPool(env, logger);
const app = createApp({ env, logger, database });

const server = http.createServer((request, response) => app.handle(request, response));

server.listen(env.port, () => {
  logger.info('HTTP server started', {
    appName: env.appName,
    nodeEnv: env.nodeEnv,
    port: env.port,
  });
});

const shutdown = async () => {
  await database.close();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
