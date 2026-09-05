"use client";

import { useState } from "react";
import { createNews } from "../actions";

export default function NewNewsForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const attachments = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`파일 업로드 중... (${i + 1}/${files.length})`);
        const fd = new FormData();
        fd.append("file", files[i]);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "파일 업로드에 실패했습니다.");
        }
        const data = await res.json();
        attachments.push(data);
      }
      setProgress("");
      await createNews(title, content, attachments);
    } catch (err: any) {
      setError(err.message || "등록에 실패했습니다.");
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm mb-1 text-ink/70">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-ink/70">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          className="w-full border border-line rounded px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-ink/70">사진 · 파일 첨부 (여러 개 가능)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm"
        />
        {files.length > 0 && (
          <ul className="text-xs text-ink/60 mt-2 space-y-1">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && <p className="text-sm text-ink/60">{progress}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-ink text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "등록 중..." : "등록하기"}
      </button>
    </form>
  );
}
