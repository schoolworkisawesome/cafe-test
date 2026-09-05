"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function updateProfile(
  userId: string,
  data: { bio: string; photoUrl: string | null }
) {
  const session = await auth();
  const currentUser = session?.user as any;

  if (!currentUser) {
    throw new Error("로그인이 필요합니다.");
  }

  if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
    throw new Error("본인 또는 관리자만 수정할 수 있습니다.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      bio: data.bio,
      ...(data.photoUrl ? { photoUrl: data.photoUrl } : {}),
    },
  });

  revalidatePath(`/members/${userId}`);
  revalidatePath("/members");
  redirect(`/members/${userId}`);
}
