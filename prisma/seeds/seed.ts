import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

import { userSeed } from './seeder/user.seed';

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn', 'info'],
  errorFormat: 'pretty',
});

async function main() {
  console.log('🌱 Start seeding...\n');

  try {
    await userSeed(prisma);

    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
