import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { userSeedData } from '../data/user.seed.data';

export async function userSeed(prisma: PrismaClient) {
  console.log('Seeding users...');

  for (const user of userSeedData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: bcrypt.hashSync(user.password, 10),
      },
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: bcrypt.hashSync(user.password, 10),
      },
    });
  }

  console.log('Users seeded successfully');
}
