"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type AttachmentInput = {
  url: string;
  filename: string;
  mimeType: string;
  isImage: boolean;
};

export async function createNews(
  title: string,
  content: string,
  attachments: AttachmentInput[]
) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) throw new Error("로그인이 필요합니다.");

  if (!title.trim() || !content.trim()) {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const news = await prisma.news.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      authorId: user.id,
      attachments: {
        create: attachments.map((a) => ({
          url: a.url,
          filename: a.filename,
          mimeType: a.mimeType,
          isImage: a.isImage,
        })),
      },
    },
  });

  revalidatePath("/news");
  redirect(`/news/${news.id}`);
}
