"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createNotice(formData: FormData) {
  const session = await auth();
  const user = session?.user as any;

  if (!user || user.role !== "ADMIN") {
    throw new Error("관리자만 공지를 작성할 수 있습니다.");
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const notice = await prisma.notice.create({
    data: { title, content, authorId: user.id },
  });

  revalidatePath("/notices");
  redirect(`/notices/${notice.id}`);
}
