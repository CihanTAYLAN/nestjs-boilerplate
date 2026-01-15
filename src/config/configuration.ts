export default () => ({
  app: {
    name: process.env.APP_NAME || 'nestjs-boilerplate',
    description:
      process.env.APP_DESCRIPTION || 'NestJS Boilerplate Backend',
    port: parseInt(process.env.APP_PORT || '8000', 10),
    url: process.env.APP_URL || 'http://127.0.0.1:8000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    cors: process.env.APP_CORS?.split('|') || ['http://localhost:3000'],
    env: process.env.NODE_ENV || 'development',
    appInternalApiKey: process.env.APP_API_KEY,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  documentation: {
    user: process.env.DOC_USER || 'apidoc',
    password: process.env.DOC_PASS || 'apidoc',
  },
  mail: {
    encryption: process.env.MAIL_ENCRYPTION || 'tls',
    fromAddress:
      process.env.MAIL_FROM_ADDRESS || 'noreply@nestjs-boilerplate.com',
    fromName: process.env.MAIL_FROM_NAME || 'NestJS Boilerplate',
    host: process.env.MAIL_HOST,
    mailer: process.env.MAIL_MAILER || 'smtp',
    password: process.env.MAIL_PASSWORD,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    username: process.env.MAIL_USERNAME,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    useSSL: process.env.REDIS_USE_SSL === 'true',
    redisDatabase: process.env.REDIS_DB_NUMBER || '0',
  },
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    type: process.env.CACHE_TYPE || 'memory', // 'memory' or 'redis'
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour default
    max: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10), // max items in memory cache
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  },
});
