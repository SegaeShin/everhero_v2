import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";

import { diagnoseEmployee } from "@/lib/diagnosis-rules";
import { formatAmount } from "@/lib/format";
import { employees } from "@/lib/mock-data";
import type { PortfolioItem, RiskFlag } from "@/types";

interface EmployeeDetailPageProps {
  params: {
    id: string;
  };
}

const flagBadgeMap: Record<RiskFlag, { label: string; className: string }> = {
  risk_asset_over: {
    label: "위험자산 초과",
    className: "bg-red-50 text-red-700 ring-red-200"
  },
  low_return: {
    label: "저수익",
    className: "bg-red-50 text-red-700 ring-red-200"
  },
  high_fee: {
    label: "수수료↑",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  no_diversification: {
    label: "미분산",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  age_mismatch: {
    label: "연령부적합",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  }
};

const categoryLabels: Record<PortfolioItem["category"], string> = {
  equity: "주식형",
  bond: "채권형",
  deposit: "원리금보장",
  mixed: "혼합형",
  tdf: "TDF",
  alternative: "대안투자"
};

function getCategoryTone(category: PortfolioItem["category"]) {
  switch (category) {
    case "equity":
      return "bg-red-500";
    case "mixed":
      return "bg-orange-500";
    case "tdf":
      return "bg-blue-500";
    case "bond":
      return "bg-emerald-500";
    case "deposit":
      return "bg-slate-500";
    case "alternative":
      return "bg-violet-500";
    default:
      return "bg-slate-500";
  }
}

function getScoreTone(score: number) {
  if (score < 40) {
    return "text-red-600";
  }

  if (score < 70) {
    return "text-amber-600";
  }

  return "text-emerald-600";
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const employee = employees.find((item) => item.id === params.id);

  if (!employee) {
    notFound();
  }

  const diagnosis = diagnoseEmployee(employee);

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-everhero-red">직원 상세</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">{employee.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {employee.department} · {employee.birthYear}년생 · 입사일 {employee.joinDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={"/employees" as Route}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              목록으로
            </Link>
            <Link
              href={`/diagnosis?employeeId=${employee.id}` as Route}
              className="inline-flex items-center rounded-xl bg-everhero-red px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              진단 보기
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              적립금
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatAmount(employee.balance)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              월 납입액
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {employee.monthlyContribution.toLocaleString("ko-KR")}원
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              수익률
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {employee.returnRate.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              진단 점수
            </p>
            <p className={`mt-2 text-lg font-semibold ${getScoreTone(diagnosis.overallScore)}`}>
              {diagnosis.overallScore}점
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-everhero-red">포트폴리오 구성</p>
              <p className="mt-1 text-sm text-slate-500">
                상품별 비중과 성과를 한 번에 확인할 수 있습니다.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              상품 {employee.portfolio.length}개
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {employee.portfolio.map((item) => (
              <div key={item.productName}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {categoryLabels[item.category]} · 수수료 {item.feeRate.toFixed(2)}% · 수익률{" "}
                      {item.returnRate.toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{item.allocation}%</p>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${getCategoryTone(item.category)}`}
                    style={{ width: `${item.allocation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">현재 플래그와 권고</p>
          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              {employee.riskFlags.length > 0 ? (
                employee.riskFlags.map((flag) => (
                  <span
                    key={flag}
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                      flagBadgeMap[flag].className
                    }`}
                  >
                    {flagBadgeMap[flag].label}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  우량
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {diagnosis.recommendations.map((recommendation, index) => (
              <div
                key={recommendation}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                우선순위 {index + 1}. {recommendation}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">핵심 진단 항목</p>
          <div className="mt-5 space-y-4">
            {diagnosis.ruleDetails.map((rule) => (
              <div key={rule.key}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-slate-900">{rule.label}</p>
                  <p className={`text-sm font-semibold ${getScoreTone(rule.score)}`}>
                    {rule.score}점
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      rule.score < 40
                        ? "bg-red-500"
                        : rule.score < 70
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${rule.score}%` }}
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{rule.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">진단 요약</p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              {diagnosis.aiComment.split("\n").map((line, index) => {
                if (!line.trim()) {
                  return <div key={index} className="h-1" />;
                }

                if (line.startsWith("## ")) {
                  return (
                    <h4 key={index} className="pt-2 text-lg font-semibold text-slate-900">
                      {line.replace("## ", "")}
                    </h4>
                  );
                }

                if (line.startsWith("- ")) {
                  return (
                    <p key={index} className="pl-4">
                      • {line.replace("- ", "")}
                    </p>
                  );
                }

                return <p key={index}>{line}</p>;
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
