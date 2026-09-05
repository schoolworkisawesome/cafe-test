import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminSiteForm from "./AdminSiteForm";
import AdminMemberRow from "./AdminMemberRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/login");

  const [site, members] = await Promise.all([
    prisma.siteInfo.findUnique({ where: { id: 1 } }),
    prisma.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div>
        <h1 className="section-title text-2xl mb-6">메인 페이지 · 학급 소개 관리</h1>
        <AdminSiteForm
          initial={{
            className: site?.className ?? "우리 반",
            teacherName: site?.teacherName ?? "",
            introTitle: site?.introTitle ?? "학급 소개",
            introContent: site?.introContent ?? "",
            mainImageUrl: site?.mainImageUrl ?? null,
          }}
        />
      </div>

      <div>
        <h2 className="section-title text-xl mb-6">구성원 관리</h2>
        <div className="card divide-y divide-line">
          {members.map((m) => (
            <AdminMemberRow
              key={m.id}
              id={m.id}
              name={m.name}
              email={m.email}
              role={m.role}
              studentNumber={m.studentNumber}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
