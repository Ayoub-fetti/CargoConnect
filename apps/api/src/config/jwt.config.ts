import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiresIn: process.env.JWT_EXPIRATION || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
}));
