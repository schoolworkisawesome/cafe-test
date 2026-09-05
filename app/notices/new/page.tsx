import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createNotice } from "../actions";

export default async function NewNoticePage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="section-title text-2xl mb-8">공지 작성</h1>
      <form action={createNotice} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1 text-ink/70">제목</label>
          <input
            name="title"
            required
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">내용</label>
          <textarea
            name="content"
            required
            rows={10}
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-ink text-white hover:opacity-90"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
