"use client";

import { useState, useTransition } from "react";
import { setMemberRole, setStudentNumber } from "./actions";

export default function AdminMemberRow({
  id,
  name,
  email,
  role,
  studentNumber,
}: {
  id: string;
  name: string;
  email: string;
  role: string;
  studentNumber: number | null;
}) {
  const [num, setNum] = useState(studentNumber?.toString() ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
      <div>
        <p className="text-sm font-medium text-ink">
          {name} <span className="text-xs text-ink/40">({email})</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onBlur={() =>
            startTransition(() => {
              setStudentNumber(id, num ? Number(num) : null);
            })
          }
          placeholder="번호"
          className="w-16 border border-line rounded px-2 py-1 text-sm bg-white"
        />
        <select
          value={role}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() => {
              setMemberRole(id, e.target.value as "ADMIN" | "STUDENT");
            })
          }
          className="border border-line rounded px-2 py-1 text-sm bg-white"
        >
          <option value="STUDENT">학생</option>
          <option value="ADMIN">선생님(관리자)</option>
        </select>
      </div>
    </div>
  );
}
