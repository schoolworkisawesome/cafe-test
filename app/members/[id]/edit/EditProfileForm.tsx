"use client";

import { useState } from "react";
import Image from "next/image";
import { updateProfile } from "../actions";

export default function EditProfileForm({
  userId,
  initialBio,
  initialPhotoUrl,
}: {
  userId: string;
  initialBio: string;
  initialPhotoUrl: string | null;
}) {
  const [bio, setBio] = useState(initialBio);
  const [preview, setPreview] = useState<string | null>(initialPhotoUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let photoUrl: string | null = null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "이미지 업로드에 실패했습니다.");
        }
        const data = await res.json();
        photoUrl = data.url;
      }

      await updateProfile(userId, { bio, photoUrl });
    } catch (err: any) {
      setError(err.message || "저장에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-sageLight relative shrink-0">
          {preview ? (
            <Image src={preview} alt="미리보기" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/40 text-sm">
              사진
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">프로필 사진</label>
          <input type="file" accept="image/*" onChange={onFileChange} className="text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink/70">자기소개</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="w-full border border-line rounded px-3 py-2 bg-white"
          placeholder="나를 소개하는 글을 자유롭게 적어보세요."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

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
