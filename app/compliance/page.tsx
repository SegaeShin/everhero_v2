import Link from "next/link";
import type { Route } from "next";

import {
  complianceLogs,
  complianceScore,
  complianceSummaryCards,
  complianceTasks
} from "@/lib/compliance-data";

function statusTone(status: "completed" | "in_progress" | "pending" | "overdue") {
  switch (status) {
    case "completed":
      return {
        label: "완료",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
      };
    case "in_progress":
      return {
        label: "진행 중",
        className: "bg-blue-50 text-blue-700 ring-blue-200"
      };
    case "pending":
      return {
        label: "대기",
        className: "bg-slate-100 text-slate-700 ring-slate-200"
      };
    case "overdue":
      return {
        label: "지연",
        className: "bg-red-50 text-red-700 ring-red-200"
      };
  }
}

export default function CompliancePage() {
  const completedCount = complianceTasks.filter((task) => task.status === "completed").length;
  const urgentTasks = complianceTasks.filter((task) => task.status === "overdue");

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-everhero-red">컴플라이언스</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              퇴직연금 운영 준수 현황 보드
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              교육, 디폴트옵션, 실물이전 대응, 고수수료 상품 점검 등 운영 의무를 한눈에
              관리합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Compliance Score</p>
            <p className="mt-2 text-3xl font-semibold">{complianceScore}점</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {complianceSummaryCards.map((card) => (
          <div key={card.label} className="card">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-everhero-red">운영 체크리스트</p>
              <p className="mt-1 text-sm text-slate-500">
                지금 바로 처리해야 할 의무 항목과 담당 조직을 확인합니다.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              완료 {completedCount}/{complianceTasks.length}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {complianceTasks.map((task) => {
              const tone = statusTone(task.status);

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                          {task.category}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${tone.className}`}
                        >
                          {tone.label}
                        </span>
                      </div>
                      <p className="mt-3 font-medium text-slate-900">{task.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                    </div>

                    <div className="min-w-[120px] text-sm text-slate-500">
                      <p>담당: {task.owner}</p>
                      <p className="mt-1">기한: {task.dueLabel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className="card">
            <p className="text-sm font-semibold text-everhero-red">우선 조치 항목</p>
            <div className="mt-5 space-y-3">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-4"
                >
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                  <p className="mt-3 text-sm font-medium text-red-700">
                    {task.owner} · {task.dueLabel}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <p className="text-sm font-semibold text-everhero-red">추천 액션</p>
            <div className="mt-5 space-y-3">
              <Link
                href={"/employees?filter=high_fee" as Route}
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition hover:bg-white"
              >
                고수수료 직원 목록 바로 보기
              </Link>
              <Link
                href={"/employees?filter=risk_asset_over" as Route}
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition hover:bg-white"
              >
                위험자산 초과 직원 안내 준비
              </Link>
              <Link
                href={"/diagnosis?tab=company" as Route}
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition hover:bg-white"
              >
                전사 진단 탭에서 현황 다시 보기
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="card">
        <p className="text-sm font-semibold text-everhero-red">최근 운영 로그</p>
        <div className="mt-5 grid gap-3">
          {complianceLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-start md:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{log.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{log.detail}</p>
              </div>
              <p className="text-sm text-slate-500">{log.timestamp}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
