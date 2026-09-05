"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "ADMIN") {
    throw new Error("관리자만 접근할 수 있습니다.");
  }
  return user;
}

export async function updateSiteInfo(data: {
  className: string;
  teacherName: string;
  introTitle: string;
  introContent: string;
  mainImageUrl: string | null;
}) {
  await requireAdmin();

  await prisma.siteInfo.upsert({
    where: { id: 1 },
    update: {
      className: data.className,
      teacherName: data.teacherName,
      introTitle: data.introTitle,
      introContent: data.introContent,
      ...(data.mainImageUrl ? { mainImageUrl: data.mainImageUrl } : {}),
    },
    create: {
      id: 1,
      className: data.className,
      teacherName: data.teacherName,
      introTitle: data.introTitle,
      introContent: data.introContent,
      mainImageUrl: data.mainImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
}

export async function setMemberRole(userId: string, role: "ADMIN" | "STUDENT") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
  revalidatePath("/members");
}

export async function setStudentNumber(userId: string, studentNumber: number | null) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { studentNumber } });
  revalidatePath("/admin");
  revalidatePath("/members");
}
