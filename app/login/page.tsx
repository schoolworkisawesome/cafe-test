"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="section-title text-2xl mb-8">로그인</h1>
      <form action={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1 text-ink/70">이메일</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">비밀번호</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-ink text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4 text-center">
        아직 계정이 없으신가요?{" "}
        <Link href="/register" className="text-clay underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
