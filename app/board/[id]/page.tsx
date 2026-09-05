import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createComment } from "../actions";

export const dynamic = "force-dynamic";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([
    prisma.boardPost.findUnique({
      where: { id },
      include: {
        author: true,
        comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    auth(),
  ]);
  if (!post) notFound();

  const addComment = createComment.bind(null, post.id);

  return (
    <div className="max-w-3xl">
      <Link href="/board" className="text-sm text-ink/60 hover:underline">
        ← 목록으로
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-3 mb-2">{post.title}</h1>
      <p className="text-xs text-ink/50 mb-6">
        {post.author.name} · {post.createdAt.toLocaleString("ko-KR")}
      </p>
      <div className="card p-8 whitespace-pre-wrap leading-relaxed text-ink/90 mb-8">
        {post.content}
      </div>

      <h2 className="font-display font-bold text-lg mb-4">댓글 {post.comments.length}개</h2>
      <div className="space-y-3 mb-6">
        {post.comments.map((c) => (
          <div key={c.id} className="card p-4">
            <p className="text-sm text-ink/90 whitespace-pre-wrap">{c.content}</p>
            <p className="text-xs text-ink/40 mt-2">
              {c.author.name} · {c.createdAt.toLocaleString("ko-KR")}
            </p>
          </div>
        ))}
        {post.comments.length === 0 && (
          <p className="text-sm text-ink/50">첫 댓글을 남겨보세요.</p>
        )}
      </div>

      {session?.user ? (
        <form action={addComment} className="flex gap-2">
          <input
            name="content"
            required
            placeholder="댓글을 입력하세요"
            className="flex-1 border border-line rounded px-3 py-2 bg-white text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-ink text-white text-sm hover:opacity-90"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-sm text-ink/50">
          <Link href="/login" className="text-clay underline">
            로그인
          </Link>{" "}
          후 댓글을 남길 수 있습니다.
        </p>
      )}
    </div>
  );
}
