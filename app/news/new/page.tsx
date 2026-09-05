import { redirect } from "next/navigation";
import { auth } from "@/auth";
import NewNewsForm from "./NewNewsForm";

export default async function NewNewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="section-title text-2xl mb-8">소식 올리기</h1>
      <NewNewsForm />
    </div>
  );
}
