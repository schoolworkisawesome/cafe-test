import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: true, attachments: true },
  });
  if (!news) notFound();

  const images = news.attachments.filter((a) => a.isImage);
  const files = news.attachments.filter((a) => !a.isImage);

  return (
    <div className="max-w-3xl">
      <Link href="/news" className="text-sm text-ink/60 hover:underline">
        ← 목록으로
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink mt-3 mb-2">{news.title}</h1>
      <p className="text-xs text-ink/50 mb-6">
        {news.author.name} · {news.createdAt.toLocaleString("ko-KR")}
      </p>

      {images.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-[4/3] card overflow-hidden">
              <Image src={img.url} alt={img.filename} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="card p-8 whitespace-pre-wrap leading-relaxed text-ink/90 mb-6">
        {news.content}
      </div>

      {files.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-medium text-ink mb-3">첨부파일</p>
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-clay underline"
                >
                  {f.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
