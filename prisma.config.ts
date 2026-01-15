import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config();

export default defineConfig({
  experimental: {
    extensions: true,
    externalTables: true,
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  schema: 'prisma/schema',
  migrations: {
    seed: 'ts-node prisma/seeds/seed.ts',
  },
});
