import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  const [noticeCount, latestNotice, latestNews] = await Promise.all([
    prisma.notice.count(),
    prisma.notice.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.news.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-16">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="font-body text-sm tracking-widest text-clay mb-3">CLASS HOMEPAGE</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
            {site?.className ?? "우리 반"}
          </h1>
          <p className="text-ink/70 leading-relaxed mb-6">
            {site?.introTitle ?? "학급 소개"} · 담임 {site?.teacherName || "선생님"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/about" className="px-4 py-2 rounded bg-ink text-white text-sm hover:opacity-90">
              학급 소개 보기
            </Link>
            <Link href="/members" className="px-4 py-2 rounded border border-line text-sm hover:bg-sageLight">
              구성원 보기
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] card overflow-hidden">
          {site?.mainImageUrl ? (
            <Image src={site.mainImageUrl} alt={site.className} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/40 text-sm">
              관리자 페이지에서 대표 사진을 등록해주세요
            </div>
          )}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-clay text-white flex items-center justify-center font-display font-bold text-lg shadow-lg border-4 border-paper">
            {(site?.className ?? "우리반").slice(0, 2)}
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <Link href="/notices" className="card p-6 hover:shadow-md transition block">
          <p className="text-xs text-ink/50 mb-1">공지사항</p>
          <p className="font-display font-bold text-lg mb-2">전체 {noticeCount}건</p>
          <p className="text-sm text-ink/70 truncate">{latestNotice?.title ?? "등록된 공지가 없습니다"}</p>
        </Link>
        <Link href="/board" className="card p-6 hover:shadow-md transition block">
          <p className="text-xs text-ink/50 mb-1">소통방</p>
          <p className="font-display font-bold text-lg mb-2">함께 이야기해요</p>
          <p className="text-sm text-ink/70">게시판에서 자유롭게 소통해보세요</p>
        </Link>
        <Link href="/news" className="card p-6 hover:shadow-md transition block">
          <p className="text-xs text-ink/50 mb-1">소식</p>
          <p className="font-display font-bold text-lg mb-2">최근 소식</p>
          <p className="text-sm text-ink/70 truncate">{latestNews?.title ?? "등록된 소식이 없습니다"}</p>
        </Link>
      </section>
    </div>
  );
}
