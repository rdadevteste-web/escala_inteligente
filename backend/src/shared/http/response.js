export const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
};

export const sendNotFound = (response) => {
  sendJson(response, 404, {
    error: 'Not Found',
    message: 'Rota nao encontrada.',
  });
};
