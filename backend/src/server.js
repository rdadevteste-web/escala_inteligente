import http from 'node:http';
import { createApp } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/logger/logger.js';

const app = createApp({ env, logger });

const server = http.createServer((request, response) => app.handle(request, response));

server.listen(env.port, () => {
  logger.info('HTTP server started', {
    appName: env.appName,
    nodeEnv: env.nodeEnv,
    port: env.port,
  });
});
