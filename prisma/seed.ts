import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteInfo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const adminEmail = process.env.ADMIN_EMAIL || "teacher@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme1234";
  const adminName = process.env.ADMIN_NAME || "선생님";

  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log(`관리자 계정 생성 완료: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
