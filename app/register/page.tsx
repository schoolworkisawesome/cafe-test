"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      studentNumber: formData.get("studentNumber")
        ? Number(formData.get("studentNumber"))
        : null,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "회원가입에 실패했습니다.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="section-title text-2xl mb-8">회원가입</h1>
      <form action={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1 text-ink/70">이름</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">번호 (선택)</label>
          <input
            name="studentNumber"
            type="number"
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
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
            minLength={6}
            className="w-full border border-line rounded px-3 py-2 bg-white"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-ink text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4 text-center">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-clay underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
