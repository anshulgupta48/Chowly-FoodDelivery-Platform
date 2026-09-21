import 'dotenv/config';
import { getEnv } from '../utils/get-env';

const envConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: Number(getEnv('PORT', '8000')),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', ''),
  MONGODB_URI: getEnv('MONGODB_URI'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
});

export const Env = envConfig();
