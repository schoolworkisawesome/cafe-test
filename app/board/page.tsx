import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const [posts, session] = await Promise.all([
    prisma.boardPost.findMany({
      include: { author: true, comments: true },
      orderBy: { createdAt: "desc" },
    }),
    auth(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-3xl">소통방</h1>
        {session?.user ? (
          <Link
            href="/board/new"
            className="px-4 py-2 rounded bg-ink text-white text-sm hover:opacity-90"
          >
            글쓰기
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-clay underline">
            로그인 후 글을 쓸 수 있어요
          </Link>
        )}
      </div>

      <div className="card divide-y divide-line">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/board/${p.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-sageLight/40 transition"
          >
            <span className="font-medium text-ink truncate">
              {p.title}{" "}
              <span className="text-xs text-clay font-normal ml-1">
                [{p.comments.length}]
              </span>
            </span>
            <span className="text-xs text-ink/50 shrink-0 ml-4">
              {p.author.name} · {p.createdAt.toLocaleDateString("ko-KR")}
            </span>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="px-5 py-8 text-ink/50 text-center">아직 등록된 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
