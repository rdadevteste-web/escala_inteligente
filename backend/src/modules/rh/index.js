import { sendJson } from '../../shared/http/response.js';

export const createRhModule = () => ({
  key: 'rh',
  name: 'RH',
  version: '1.0.0',
  description: 'Colaboradores, treinamentos, jornadas, afastamentos e ferias.',
  registerRoutes(router) {
    router.add('GET', '/api/v1/rh', async (_request, response) => {
      sendJson(response, 200, {
        module: 'rh',
        status: 'ready-for-development',
      });
    });
  },
});
