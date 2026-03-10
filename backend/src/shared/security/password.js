import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export const hashPassword = async (plainPassword) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(plainPassword, salt, KEY_LENGTH);
  return `${salt}:${Buffer.from(derivedKey).toString('hex')}`;
};

export const verifyPassword = async (plainPassword, passwordHash) => {
  if (!passwordHash || !passwordHash.includes(':')) {
    return false;
  }

  const [salt, storedKey] = passwordHash.split(':');
  const derivedKey = await scrypt(plainPassword, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedKey, 'hex');
  const derivedBuffer = Buffer.from(derivedKey);

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedBuffer);
};
