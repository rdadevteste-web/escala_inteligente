import { AppError } from '../errors/app-error.js';
import { sendJson, sendNotFound } from './response.js';

const normalizePath = (pathname) => pathname.replace(/\/+$/, '') || '/';
const splitPath = (pathname) => normalizePath(pathname).split('/').filter(Boolean);

const matchRoute = (routePath, pathname) => {
  const routeSegments = splitPath(routePath);
  const pathnameSegments = splitPath(pathname);

  if (routeSegments.length !== pathnameSegments.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < routeSegments.length; index += 1) {
    const expected = routeSegments[index];
    const actual = pathnameSegments[index];

    if (expected.startsWith(':')) {
      params[expected.slice(1)] = actual;
      continue;
    }

    if (expected !== actual) {
      return null;
    }
  }

  return params;
};

export const createRouter = () => {
  const routes = [];

  const add = (method, path, handler) => {
    routes.push({ method, path, handler });
  };

  const handle = async (request, response, context) => {
    const pathname = normalizePath(new URL(request.url, 'http://localhost').pathname);
    const route = routes.find((candidate) => {
      if (candidate.method !== request.method) {
        return false;
      }

      return matchRoute(candidate.path, pathname) !== null;
    });

    if (!route) {
      sendNotFound(response);
      return;
    }

    const params = matchRoute(route.path, pathname) ?? {};

    try {
      await route.handler(request, response, {
        ...context,
        params,
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendJson(response, error.statusCode, {
          error: error.name,
          message: error.message,
          details: error.details,
        });
        return;
      }

      context.logger.error('Unhandled request error', {
        method: request.method,
        pathname,
        error: error.message,
        stack: error.stack,
      });

      sendJson(response, 500, {
        error: 'InternalServerError',
        message: 'Erro interno do servidor.',
      });
    }
  };

  return { add, handle };
};
