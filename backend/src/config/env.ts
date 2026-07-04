import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variável de ambiente ${key} não definida`);
  return value;
};

export const env = {
  PORT: getEnv('PORT'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  PEPPER: getEnv('PEPPER'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),
};