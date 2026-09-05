import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [items, session] = await Promise.all([
    prisma.news.findMany({
      include: { author: true, attachments: true },
      orderBy: { createdAt: "desc" },
    }),
    auth(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-3xl">소식</h1>
        {session?.user ? (
          <Link
            href="/news/new"
            className="px-4 py-2 rounded bg-ink text-white text-sm hover:opacity-90"
          >
            소식 올리기
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-clay underline">
            로그인 후 글을 쓸 수 있어요
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((n) => {
          const thumb = n.attachments.find((a) => a.isImage);
          return (
            <Link
              key={n.id}
              href={`/news/${n.id}`}
              className="card overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-[16/9] bg-sageLight">
                {thumb ? (
                  <Image src={thumb.url} alt={n.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/40 text-sm">
                    사진 없음
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-ink truncate">{n.title}</p>
                <p className="text-xs text-ink/50 mt-1">
                  {n.author.name} · {n.createdAt.toLocaleDateString("ko-KR")}
                </p>
              </div>
            </Link>
          );
        })}
        {items.length === 0 && (
          <p className="text-ink/50 col-span-full text-center py-8">
            등록된 소식이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
