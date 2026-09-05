import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user as any;

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-ink tracking-tight">
          우리 반 홈페이지
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-ink">
          <Link className="nav-link" href="/about">학급 소개</Link>
          <Link className="nav-link" href="/notices">공지사항</Link>
          <Link className="nav-link" href="/board">소통방</Link>
          <Link className="nav-link" href="/members">구성원</Link>
          <Link className="nav-link" href="/news">소식</Link>
          {user?.role === "ADMIN" && (
            <Link className="nav-link text-clay" href="/admin">관리자</Link>
          )}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden sm:inline text-ink/70">{user.name}님</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="px-3 py-1.5 rounded border border-line hover:bg-sageLight transition">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 rounded border border-line hover:bg-sageLight transition">
                로그인
              </Link>
              <Link href="/register" className="px-3 py-1.5 rounded bg-sage text-white hover:opacity-90 transition">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="md:hidden flex gap-4 overflow-x-auto px-5 pb-3 text-sm font-body">
        <Link href="/about">학급 소개</Link>
        <Link href="/notices">공지사항</Link>
        <Link href="/board">소통방</Link>
        <Link href="/members">구성원</Link>
        <Link href="/news">소식</Link>
      </div>
    </header>
  );
}
