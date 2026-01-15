// Validation schema for environment variables
// You can install joi for more advanced validation: npm install joi
// For now, we'll keep it simple or use class-validator

export const validationSchema = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_PORT: parseInt(process.env.APP_PORT || '8000', 10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
