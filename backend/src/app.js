import { createRouter } from './shared/http/router.js';
import { sendJson } from './shared/http/response.js';
import { createModuleRegistry } from './shared/modules/module-registry.js';

export const createApp = ({ env, logger, database }) => {
  const router = createRouter();
  const modules = createModuleRegistry();
  const context = { env, logger, modules, database };

  router.add('GET', '/', async (_request, response) => {
    sendJson(response, 200, {
      name: env.appName,
      status: 'online',
      modules: modules.list(),
    });
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
