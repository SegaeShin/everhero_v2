"use client";

import { useMemo, useState, useTransition } from "react";

import { saveEmployeeAction } from "@/app/actions/employee-actions";
import { employeeActionStatusOptions } from "@/lib/employee-actions";
import type { EmployeeAction, EmployeeActionStatus } from "@/types";

import { ActionStatusBadge } from "./ActionStatusBadge";

interface EmployeeActionPanelProps {
  employeeId: string;
  initialAction?: EmployeeAction | null;
  isSupabaseEnabled: boolean;
}

function getInitialStatus(action?: EmployeeAction | null): EmployeeActionStatus {
  return action?.status ?? "untouched";
}

export function EmployeeActionPanel({
  employeeId,
  initialAction,
  isSupabaseEnabled
}: EmployeeActionPanelProps) {
  const [status, setStatus] = useState<EmployeeActionStatus>(getInitialStatus(initialAction));
  const [ownerName, setOwnerName] = useState(initialAction?.ownerName ?? "");
  const [note, setNote] = useState(initialAction?.note ?? "");
  const [latestAction, setLatestAction] = useState<EmployeeAction | null>(initialAction ?? null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const previewAction =
    latestAction ??
    (initialAction
      ? {
          ...initialAction,
          status
        }
      : {
          id: "draft-action",
          employeeId,
          status,
          note,
          ownerName,
          createdAt: "",
          updatedAt: ""
        });

  const updatedAtLabel = useMemo(() => {
    if (!latestAction?.updatedAt) {
      return "아직 저장된 조치 이력이 없습니다.";
    }

    return new Date(latestAction.updatedAt).toLocaleString("ko-KR");
  }, [latestAction?.updatedAt]);

  const handleSave = () => {
    if (!isSupabaseEnabled) {
      setMessage("Supabase 연결 후 저장 기능을 사용할 수 있습니다.");
      return;
    }

    startTransition(async () => {
      const result = await saveEmployeeAction({
        employeeId,
        status,
        note,
        ownerName
      });

      if (!result.success) {
        setMessage(result.message ?? "저장 중 오류가 발생했습니다.");
        return;
      }

      if (!result.action) {
        setMessage("저장 결과를 확인하지 못했습니다. 다시 시도해 주세요.");
        return;
      }

      setLatestAction(result.action);
      setStatus(result.action.status);
      setOwnerName(result.action.ownerName);
      setNote(result.action.note);
      setMessage("조치 상태가 저장되었습니다.");
    });
  };

  return (
    <section className="card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-everhero-red">조치 관리</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            담당자 메모와 진행 상태를 함께 관리
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            직원 상태를 저장해 두면 목록과 대시보드에서 바로 이어서 관리할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            현재 상태
          </p>
          <ActionStatusBadge action={previewAction} />
          <p className="text-xs text-slate-500">최근 저장: {updatedAtLabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">조치 상태</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as EmployeeActionStatus)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-everhero-red focus:ring-2 focus:ring-red-100"
          >
            {employeeActionStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">담당자</span>
          <input
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            placeholder="예: 김지현 대리"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-everhero-red focus:ring-2 focus:ring-red-100"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">조치 메모</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={5}
          placeholder="예: 수익률 하락 사유 확인 필요. 다음 주 상담 예정."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-everhero-red focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          {!isSupabaseEnabled
            ? "현재는 읽기 전용 상태입니다. Supabase 연결 후 저장할 수 있습니다."
            : "저장 시 직원 목록과 상세 화면에 즉시 반영됩니다."}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-everhero-red px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isPending ? "저장 중..." : "조치 저장"}
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
    </section>
  );
}
