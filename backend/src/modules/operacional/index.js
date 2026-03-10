import { sendJson } from '../../shared/http/response.js';

export const createOperacionalModule = () => ({
  key: 'operacional',
  name: 'Operacional',
  version: '1.0.0',
  description: 'Atendimentos, alocacoes, postos, turnos e escala inteligente.',
  registerRoutes(router) {
    router.add('GET', '/api/v1/operacional', async (_request, response) => {
      sendJson(response, 200, {
        module: 'operacional',
        status: 'ready-for-development',
      });
    });
  },
});
