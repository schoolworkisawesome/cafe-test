"use client";

import { useState } from "react";
import Image from "next/image";
import { updateSiteInfo } from "./actions";

export default function AdminSiteForm({
  initial,
}: {
  initial: {
    className: string;
    teacherName: string;
    introTitle: string;
    introContent: string;
    mainImageUrl: string | null;
  };
}) {
  const [className, setClassName] = useState(initial.className);
  const [teacherName, setTeacherName] = useState(initial.teacherName);
  const [introTitle, setIntroTitle] = useState(initial.introTitle);
  const [introContent, setIntroContent] = useState(initial.introContent);
  const [preview, setPreview] = useState<string | null>(initial.mainImageUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    try {
      let mainImageUrl: string | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("대표 사진 업로드에 실패했습니다.");
        const data = await res.json();
        mainImageUrl = data.url;
      }

      await updateSiteInfo({
        className,
        teacherName,
        introTitle,
        introContent,
        mainImageUrl,
      });
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-32 aspect-[4/3] card overflow-hidden shrink-0">
          {preview ? (
            <Image src={preview} alt="대표 사진" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/40 text-xs">
              대표 사진
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">메인 대표 사진</label>
          <input type="file" accept="image/*" onChange={onFileChange} className="text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink/70">학급 이름</label>
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-ink/70">담임 선생님 이름</label>
        <input
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-ink/70">학급 소개 페이지 제목</label>
        <input
          value={introTitle}
          onChange={(e) => setIntroTitle(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-ink/70">학급 소개 내용</label>
        <textarea
          value={introContent}
          onChange={(e) => setIntroContent(e.target.value)}
          rows={8}
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-sage">저장되었습니다.</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-ink text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}
