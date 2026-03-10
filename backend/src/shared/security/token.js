import { createHmac } from 'node:crypto';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

export const signToken = (payload, secret, expiresInHours = 12) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const body = { ...payload, exp };
  const headerEncoded = encode(header);
  const bodyEncoded = encode(body);
  const signature = createHmac('sha256', secret)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest('base64url');

  return `${headerEncoded}.${bodyEncoded}.${signature}`;
};

export const verifyToken = (token, secret) => {
  const [headerEncoded, bodyEncoded, signature] = token.split('.');

  if (!headerEncoded || !bodyEncoded || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  const payload = decode(bodyEncoded);

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};
