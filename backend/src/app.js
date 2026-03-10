import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRouter } from './shared/http/router.js';
import { sendJson } from './shared/http/response.js';
import { createModuleRegistry } from './shared/modules/module-registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../../frontend');

const serveFile = async (response, filePath, contentType) => {
  const content = await readFile(filePath);
  response.writeHead(200, { 'Content-Type': contentType });
  response.end(content);
};

export const createApp = ({ env, logger, database }) => {
  const router = createRouter();
  const modules = createModuleRegistry();
  const context = { env, logger, modules, database };

  router.add('GET', '/', async (_request, response) => {
    sendJson(response, 200, {
      name: env.appName,
      status: 'online',
      modules: modules.list(),
      frontend: '/app',
    });
  });

  router.add('GET', '/app', async (_request, response) => {
    await serveFile(response, path.join(frontendDir, 'index.html'), 'text/html; charset=utf-8');
  });

  router.add('GET', '/app.css', async (_request, response) => {
    await serveFile(response, path.join(frontendDir, 'app.css'), 'text/css; charset=utf-8');
  });

  router.add('GET', '/app.js', async (_request, response) => {
    await serveFile(response, path.join(frontendDir, 'app.js'), 'application/javascript; charset=utf-8');
  });

  router.add('GET', '/health', async (_request, response) => {
    sendJson(response, 200, {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  modules.registerRoutes(router, context);

  return {
    handle(request, response) {
      return router.handle(request, response, context);
    },
  };
};
