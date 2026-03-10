import { getActorIdFromRequest, requireAuthenticated, requirePermission } from '../../shared/database/request-context.js';
import { AppError } from '../../shared/errors/app-error.js';
import { readJson } from '../../shared/http/read-json.js';
import { sendJson } from '../../shared/http/response.js';
import { createAirportRepository } from './airport-repository.js';
import { createBranchRepository } from './branch-repository.js';
import { createPermissionRepository } from './permission-repository.js';
import { createPositionRepository } from './position-repository.js';
import { createProfilePermissionRepository } from './profile-permission-repository.js';
import { createProfileRepository } from './profile-repository.js';
import { createAdministracaoService } from './service.js';
import { createUserProfileRepository } from './user-profile-repository.js';
import { createUserRepository } from './user-repository.js';

const parseId = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new AppError('Identificador invalido.', 400);
  return parsed;
};

const withPermission = (env, permissionKey, handler) => async (request, response, context) => {
  requirePermission(request, env, permissionKey);
  return handler(request, response, context);
};

const withAuth = (env, handler) => async (request, response, context) => {
  requireAuthenticated(request, env);
  return handler(request, response, context);
};

export const createAdministracaoModule = () => ({
  key: 'administracao',
  name: 'Administracao',
  version: '1.0.0',
  description: 'Cadastros estruturais, acesso e parametros do ERP.',
  registerRoutes(router, context) {
    const service = createAdministracaoService({
      userRepository: createUserRepository(context.database),
      profileRepository: createProfileRepository(context.database),
      permissionRepository: createPermissionRepository(context.database),
      userProfileRepository: createUserProfileRepository(context.database),
      profilePermissionRepository: createProfilePermissionRepository(context.database),
      airportRepository: createAirportRepository(context.database),
      branchRepository: createBranchRepository(context.database),
      positionRepository: createPositionRepository(context.database),
      env: context.env,
    });
    const env = context.env;

    router.add('GET', '/api/v1/administracao', withAuth(env, async (_request, response) => {
      sendJson(response, 200, service.getOverview());
    }));

    router.add('POST', '/api/v1/administracao/auth/login', async (request, response) => {
      const payload = await readJson(request);
      const session = await service.login(payload);
      sendJson(response, 200, session);
    });

    router.add('GET', '/api/v1/administracao/usuarios', withPermission(env, 'administracao:gerenciar_usuarios', async (_request, response) => {
      sendJson(response, 200, { items: await service.listUsers() });
    }));
    router.add('GET', '/api/v1/administracao/usuarios/:id', withPermission(env, 'administracao:gerenciar_usuarios', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getUserById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/usuarios', withPermission(env, 'administracao:gerenciar_usuarios', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createUser(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/usuarios/:id', withPermission(env, 'administracao:gerenciar_usuarios', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updateUser(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/usuarios/:id', withPermission(env, 'administracao:gerenciar_usuarios', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deleteUser(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/perfis', withPermission(env, 'administracao:gerenciar_perfis', async (_request, response) => {
      sendJson(response, 200, { items: await service.listProfiles() });
    }));
    router.add('GET', '/api/v1/administracao/perfis/:id', withPermission(env, 'administracao:gerenciar_perfis', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getProfileById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/perfis', withPermission(env, 'administracao:gerenciar_perfis', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createProfile(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/perfis/:id', withPermission(env, 'administracao:gerenciar_perfis', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updateProfile(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/perfis/:id', withPermission(env, 'administracao:gerenciar_perfis', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deleteProfile(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));
    router.add('GET', '/api/v1/administracao/perfis/:id/permissoes', withPermission(env, 'administracao:gerenciar_perfis', async (_request, response, requestContext) => {
      sendJson(response, 200, { items: await service.listProfilePermissions(parseId(requestContext.params.id)) });
    }));
    router.add('POST', '/api/v1/administracao/perfis/:id/permissoes', withPermission(env, 'administracao:gerenciar_perfis', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.assignPermissionToProfile(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/perfis/:id/permissoes/:assignmentId', withPermission(env, 'administracao:gerenciar_perfis', async (request, response, requestContext) => {
      sendJson(response, 200, await service.unassignPermissionFromProfile(parseId(requestContext.params.id), parseId(requestContext.params.assignmentId), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/permissoes', withPermission(env, 'administracao:gerenciar_permissoes', async (_request, response) => {
      sendJson(response, 200, { items: await service.listPermissions() });
    }));
    router.add('GET', '/api/v1/administracao/permissoes/:id', withPermission(env, 'administracao:gerenciar_permissoes', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getPermissionById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/permissoes', withPermission(env, 'administracao:gerenciar_permissoes', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createPermission(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/permissoes/:id', withPermission(env, 'administracao:gerenciar_permissoes', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updatePermission(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/permissoes/:id', withPermission(env, 'administracao:gerenciar_permissoes', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deletePermission(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/usuarios/:id/perfis', withPermission(env, 'administracao:gerenciar_usuarios', async (_request, response, requestContext) => {
      sendJson(response, 200, { items: await service.listUserProfiles(parseId(requestContext.params.id)) });
    }));
    router.add('POST', '/api/v1/administracao/usuarios/:id/perfis', withPermission(env, 'administracao:gerenciar_usuarios', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.assignProfileToUser(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/usuarios/:id/perfis/:assignmentId', withPermission(env, 'administracao:gerenciar_usuarios', async (request, response, requestContext) => {
      sendJson(response, 200, await service.unassignProfileFromUser(parseId(requestContext.params.id), parseId(requestContext.params.assignmentId), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/aeroportos', withPermission(env, 'administracao:gerenciar_aeroportos', async (_request, response) => {
      sendJson(response, 200, { items: await service.listAirports() });
    }));
    router.add('GET', '/api/v1/administracao/aeroportos/:id', withPermission(env, 'administracao:gerenciar_aeroportos', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getAirportById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/aeroportos', withPermission(env, 'administracao:gerenciar_aeroportos', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createAirport(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/aeroportos/:id', withPermission(env, 'administracao:gerenciar_aeroportos', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updateAirport(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/aeroportos/:id', withPermission(env, 'administracao:gerenciar_aeroportos', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deleteAirport(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/filiais', withPermission(env, 'administracao:gerenciar_filiais', async (_request, response) => {
      sendJson(response, 200, { items: await service.listBranches() });
    }));
    router.add('GET', '/api/v1/administracao/filiais/:id', withPermission(env, 'administracao:gerenciar_filiais', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getBranchById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/filiais', withPermission(env, 'administracao:gerenciar_filiais', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createBranch(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/filiais/:id', withPermission(env, 'administracao:gerenciar_filiais', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updateBranch(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/filiais/:id', withPermission(env, 'administracao:gerenciar_filiais', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deleteBranch(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));

    router.add('GET', '/api/v1/administracao/cargos', withPermission(env, 'administracao:gerenciar_cargos', async (_request, response) => {
      sendJson(response, 200, { items: await service.listPositions() });
    }));
    router.add('GET', '/api/v1/administracao/cargos/:id', withPermission(env, 'administracao:gerenciar_cargos', async (_request, response, requestContext) => {
      sendJson(response, 200, await service.getPositionById(parseId(requestContext.params.id)));
    }));
    router.add('POST', '/api/v1/administracao/cargos', withPermission(env, 'administracao:gerenciar_cargos', async (request, response) => {
      const payload = await readJson(request);
      sendJson(response, 201, await service.createPosition(payload, getActorIdFromRequest(request, env)));
    }));
    router.add('PUT', '/api/v1/administracao/cargos/:id', withPermission(env, 'administracao:gerenciar_cargos', async (request, response, requestContext) => {
      const payload = await readJson(request);
      sendJson(response, 200, await service.updatePosition(parseId(requestContext.params.id), payload, getActorIdFromRequest(request, env)));
    }));
    router.add('DELETE', '/api/v1/administracao/cargos/:id', withPermission(env, 'administracao:gerenciar_cargos', async (request, response, requestContext) => {
      sendJson(response, 200, await service.deletePosition(parseId(requestContext.params.id), getActorIdFromRequest(request, env)));
    }));
  },
});
