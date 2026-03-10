import { getActorIdFromRequest } from '../../shared/database/request-context.js';
import { AppError } from '../../shared/errors/app-error.js';
import { readJson } from '../../shared/http/read-json.js';
import { sendJson } from '../../shared/http/response.js';
import { createAdministracaoService } from './service.js';
import { createUserRepository } from './user-repository.js';

const parseId = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError('Identificador invalido.', 400);
  }

  return parsed;
};

export const createAdministracaoModule = () => {
  return {
    key: 'administracao',
    name: 'Administracao',
    version: '1.0.0',
    description: 'Cadastros estruturais, acesso e parametros do ERP.',
    registerRoutes(router, context) {
      const service = createAdministracaoService({
        userRepository: createUserRepository(context.database),
      });

      router.add('GET', '/api/v1/administracao', async (_request, response) => {
        sendJson(response, 200, service.getOverview());
      });

      router.add('GET', '/api/v1/administracao/usuarios', async (_request, response) => {
        sendJson(response, 200, {
          items: await service.listUsers(),
        });
      });

      router.add('GET', '/api/v1/administracao/usuarios/:id', async (_request, response, requestContext) => {
        const user = await service.getUserById(parseId(requestContext.params.id));
        sendJson(response, 200, user);
      });

      router.add('POST', '/api/v1/administracao/usuarios', async (request, response) => {
        const actorId = getActorIdFromRequest(request);
        const payload = await readJson(request);
        const user = await service.createUser(payload, actorId);

        sendJson(response, 201, user);
      });

      router.add('PUT', '/api/v1/administracao/usuarios/:id', async (request, response, requestContext) => {
        const actorId = getActorIdFromRequest(request);
        const payload = await readJson(request);
        const user = await service.updateUser(parseId(requestContext.params.id), payload, actorId);

        sendJson(response, 200, user);
      });

      router.add('DELETE', '/api/v1/administracao/usuarios/:id', async (request, response, requestContext) => {
        const actorId = getActorIdFromRequest(request);
        const user = await service.deleteUser(parseId(requestContext.params.id), actorId);

        sendJson(response, 200, user);
      });
    },
  };
};
