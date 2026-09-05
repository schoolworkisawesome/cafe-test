import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import EditProfileForm from "./EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const currentUser = session?.user as any;
  if (!currentUser) redirect("/login");

  const member = await prisma.user.findUnique({ where: { id } });
  if (!member) notFound();

  if (currentUser.id !== member.id && currentUser.role !== "ADMIN") {
    redirect(`/members/${member.id}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="section-title text-2xl mb-8">프로필 수정</h1>
      <EditProfileForm
        userId={member.id}
        initialBio={member.bio ?? ""}
        initialPhotoUrl={member.photoUrl ?? null}
      />
    </div>
  );
}
