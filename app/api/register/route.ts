import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { name, email, password, studentNumber } = body as {
    name?: string;
    email?: string;
    password?: string;
    studentNumber?: number | null;
  };

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "이름, 이메일, 비밀번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: "이미 가입된 이메일입니다." },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      studentNumber: studentNumber ?? null,
      role: "STUDENT",
    },
  });

  return NextResponse.json({ ok: true });
}
