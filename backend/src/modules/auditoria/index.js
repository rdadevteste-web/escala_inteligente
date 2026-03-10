import { sendJson } from '../../shared/http/response.js';

export const createAuditoriaModule = () => ({
  key: 'auditoria',
  name: 'Auditoria',
  version: '1.0.0',
  description: 'Logs de auditoria de negocio e logs tecnicos do sistema.',
  registerRoutes(router) {
    router.add('GET', '/api/v1/auditoria', async (_request, response) => {
      sendJson(response, 200, {
        module: 'auditoria',
        status: 'ready-for-development',
        logs: ['auditoria_logs', 'sistema_logs'],
      });
    });
  },
});
