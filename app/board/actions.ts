"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createPost(formData: FormData) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) throw new Error("로그인이 필요합니다.");

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  if (!title || !content) throw new Error("제목과 내용을 입력해주세요.");

  const post = await prisma.boardPost.create({
    data: { title, content, authorId: user.id },
  });

  revalidatePath("/board");
  redirect(`/board/${post.id}`);
}

export async function createComment(postId: string, formData: FormData) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) throw new Error("로그인이 필요합니다.");

  const content = (formData.get("content") as string)?.trim();
  if (!content) throw new Error("댓글 내용을 입력해주세요.");

  await prisma.comment.create({
    data: { content, authorId: user.id, postId },
  });

  revalidatePath(`/board/${postId}`);
}
