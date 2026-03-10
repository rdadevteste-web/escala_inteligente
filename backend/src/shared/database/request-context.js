export const getActorIdFromRequest = (request) => {
  const headerValue = request.headers['x-user-id'];

  if (!headerValue) {
    return null;
  }

  const parsed = Number(headerValue);
  return Number.isFinite(parsed) ? parsed : null;
};
