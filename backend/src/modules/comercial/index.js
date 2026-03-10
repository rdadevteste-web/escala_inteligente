import { sendJson } from '../../shared/http/response.js';

export const createComercialModule = () => ({
  key: 'comercial',
  name: 'Comercial',
  version: '1.0.0',
  description: 'Clientes, contratos, precificacao e demandas extraordinarias.',
  registerRoutes(router) {
    router.add('GET', '/api/v1/comercial', async (_request, response) => {
      sendJson(response, 200, {
        module: 'comercial',
        status: 'ready-for-development',
      });
    });
  },
});
