export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-5xl mx-auto px-5 py-8 text-sm text-ink/60 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} 우리 반 홈페이지</span>
        <span>Made with Next.js · Vercel</span>
      </div>
    </footer>
  );
}
