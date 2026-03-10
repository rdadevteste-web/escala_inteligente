const write = (level, message, context = {}) => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.log(JSON.stringify(payload));
};

export const logger = {
  info(message, context) {
    write('info', message, context);
  },
  error(message, context) {
    write('error', message, context);
  },
};
