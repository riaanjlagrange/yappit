require('dotenv').config();
const prisma = require('./client');

async function main() {
  const roles = [{ name: 'ADMIN' }, { name: 'USER' }, { name: 'MODERATOR' }];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });
  }
  console.log('Roles seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
