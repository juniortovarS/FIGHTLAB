const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Junior Tovar', email: 'juniortovar601@gmail.com', role: 'admin' },
    { name: 'Admin FightLab', email: 'adminfightlab@gmail.com', role: 'admin' },
    // Agrega aquí los otros 3 usuarios que tienes en local
    // { name: 'Nombre', email: 'correo@ejemplo.com', role: 'alumno' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: 'Activo',
      },
    });
  }
  console.log('Base de datos sincronizada con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
