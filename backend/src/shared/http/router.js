import { AppError } from '../errors/app-error.js';
import { sendJson, sendNotFound } from './response.js';

const normalizePath = (pathname) => pathname.replace(/\/+$/, '') || '/';

export const createRouter = () => {
  const routes = [];

  const add = (method, path, handler) => {
    routes.push({ method, path, handler });
  };

  const handle = async (request, response, context) => {
    const pathname = normalizePath(new URL(request.url, 'http://localhost').pathname);
    const route = routes.find((candidate) => candidate.method === request.method && candidate.path === pathname);

    if (!route) {
      sendNotFound(response);
      return;
    }

    try {
      await route.handler(request, response, context);
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
