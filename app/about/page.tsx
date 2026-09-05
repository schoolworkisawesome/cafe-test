import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const site = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title text-3xl">{site?.introTitle ?? "학급 소개"}</h1>
        {isAdmin && (
          <Link href="/admin" className="text-sm text-clay underline">
            내용 수정하기
          </Link>
        )}
      </div>
      <div className="card p-8 whitespace-pre-wrap leading-relaxed text-ink/90">
        {site?.introContent ?? "학급 소개 내용이 아직 없습니다."}
      </div>
    </div>
  );
}
