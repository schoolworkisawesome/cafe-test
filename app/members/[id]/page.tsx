import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.user.findUnique({ where: { id } });
  if (!member) notFound();

  const session = await auth();
  const isSelfOrAdmin =
    (session?.user as any)?.id === member.id ||
    (session?.user as any)?.role === "ADMIN";

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-8 text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-sageLight relative mx-auto mb-4">
          {member.photoUrl ? (
            <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/40 font-display text-3xl">
              {member.name.slice(0, 1)}
            </div>
          )}
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">{member.name}</h1>
        <p className="text-sm text-ink/50 mb-4">
          {member.role === "ADMIN"
            ? "담임 선생님"
            : member.studentNumber
            ? `${member.studentNumber}번`
            : "학생"}
        </p>
        <p className="text-ink/80 whitespace-pre-wrap leading-relaxed text-left border-t border-line pt-4">
          {member.bio || "아직 자기소개가 없습니다."}
        </p>

        {isSelfOrAdmin && (
          <Link
            href={`/members/${member.id}/edit`}
            className="inline-block mt-6 text-sm text-clay underline"
          >
            프로필 수정하기
          </Link>
        )}
      </div>
    </div>
  );
}
