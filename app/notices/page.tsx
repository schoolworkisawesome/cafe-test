import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const [notices, session] = await Promise.all([
    prisma.notice.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    }),
    auth(),
  ]);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-3xl">공지사항</h1>
        {isAdmin && (
          <Link
            href="/notices/new"
            className="px-4 py-2 rounded bg-ink text-white text-sm hover:opacity-90"
          >
            공지 작성
          </Link>
        )}
      </div>

      <div className="card divide-y divide-line">
        {notices.map((n) => (
          <Link
            key={n.id}
            href={`/notices/${n.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-sageLight/40 transition"
          >
            <span className="font-medium text-ink truncate">{n.title}</span>
            <span className="text-xs text-ink/50 shrink-0 ml-4">
              {n.author.name} · {n.createdAt.toLocaleDateString("ko-KR")}
            </span>
          </Link>
        ))}
        {notices.length === 0 && (
          <p className="px-5 py-8 text-ink/50 text-center">등록된 공지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
