import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    orderBy: [{ studentNumber: { sort: "asc", nulls: "last" } }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="section-title text-3xl mb-8">구성원 소개</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {members.map((m) => (
          <Link
            key={m.id}
            href={`/members/${m.id}`}
            className="card p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-sageLight relative mb-3">
              {m.photoUrl ? (
                <Image src={m.photoUrl} alt={m.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink/40 font-display text-xl">
                  {m.name.slice(0, 1)}
                </div>
              )}
            </div>
            <p className="font-medium text-ink">{m.name}</p>
            <p className="text-xs text-ink/50">
              {m.role === "ADMIN" ? "선생님" : m.studentNumber ? `${m.studentNumber}번` : "학생"}
            </p>
          </Link>
        ))}
        {members.length === 0 && (
          <p className="text-ink/50 col-span-full">등록된 구성원이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
