import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!notice) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/notices" className="text-sm text-ink/60 hover:underline">
        ← 목록으로
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-3 mb-2">{notice.title}</h1>
      <p className="text-xs text-ink/50 mb-6">
        {notice.author.name} · {notice.createdAt.toLocaleString("ko-KR")}
      </p>
      <div className="card p-8 whitespace-pre-wrap leading-relaxed text-ink/90">
        {notice.content}
      </div>
    </div>
  );
}
