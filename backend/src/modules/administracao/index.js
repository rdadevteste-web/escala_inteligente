import { sendJson } from '../../shared/http/response.js';
import { createAdministracaoService } from './service.js';

export const createAdministracaoModule = () => {
  const service = createAdministracaoService();

  return {
    key: 'administracao',
    name: 'Administracao',
    version: '1.0.0',
    description: 'Cadastros estruturais, acesso e parametros do ERP.',
    registerRoutes(router) {
      router.add('GET', '/api/v1/administracao', async (_request, response) => {
        sendJson(response, 200, service.getOverview());
      });

      router.add('GET', '/api/v1/administracao/usuarios', async (_request, response) => {
        sendJson(response, 200, {
          items: service.listSeedUsers(),
        });
      });
    },
  };
};
