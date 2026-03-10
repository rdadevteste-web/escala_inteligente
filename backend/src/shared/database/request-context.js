import { AppError } from '../errors/app-error.js';
import { verifyToken } from '../security/token.js';

const parseBearerToken = (request) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const getAuthSessionFromRequest = (request, env) => {
  const token = parseBearerToken(request);

  if (!token) {
    return null;
  }

  return verifyToken(token, env.authTokenSecret);
};

export const requireAuthenticated = (request, env) => {
  const session = getAuthSessionFromRequest(request, env);

  if (!session) {
    throw new AppError('Autenticacao obrigatoria.', 401);
  }

  return session;
};

export const requirePermission = (request, env, permissionKey) => {
  const session = requireAuthenticated(request, env);
  const permissions = session.permissoes || [];

  if (!permissions.includes(permissionKey)) {
    throw new AppError('Permissao insuficiente.', 403, {
      required: permissionKey,
    });
  }

  return session;
};

export const getActorIdFromRequest = (request, env) => {
  const session = getAuthSessionFromRequest(request, env);

  if (session?.sub) {
    return Number(session.sub);
  }

  const headerValue = request.headers['x-user-id'];

  if (!headerValue) {
    return null;
  }

  const parsed = Number(headerValue);
  return Number.isFinite(parsed) ? parsed : null;
};
