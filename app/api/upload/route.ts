import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ message: "파일이 없습니다." }, { status: 400 });
  }

  const maxSizeBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxSizeBytes) {
    return NextResponse.json(
      { message: "파일 용량은 8MB 이하만 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({
    url: blob.url,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    isImage: file.type?.startsWith("image/") ?? false,
  });
}
