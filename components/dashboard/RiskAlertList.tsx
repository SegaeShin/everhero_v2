import Link from "next/link";
import type { Route } from "next";

import { employees, riskFlagLabels } from "@/lib/mock-data";
import type { RiskFlag } from "@/types";

const riskAlertStyles: Record<RiskFlag, { tone: string; dot: string; helper: string }> = {
  risk_asset_over: {
    tone: "border-red-200 bg-red-50/70 hover:bg-red-50",
    dot: "bg-red-500",
    helper: "위험자산 70% 초과 가능성이 있습니다."
  },
  low_return: {
    tone: "border-red-200 bg-red-50/70 hover:bg-red-50",
    dot: "bg-red-500",
    helper: "수익률이 벤치마크를 하회하는 직원군입니다."
  },
  high_fee: {
    tone: "border-amber-200 bg-amber-50/80 hover:bg-amber-50",
    dot: "bg-amber-500",
    helper: "수수료 과다 상품 비중을 점검해야 합니다."
  },
  age_mismatch: {
    tone: "border-amber-200 bg-amber-50/80 hover:bg-amber-50",
    dot: "bg-amber-500",
    helper: "연령 대비 위험자산 배분이 맞지 않을 수 있습니다."
  },
  no_diversification: {
    tone: "border-amber-200 bg-amber-50/80 hover:bg-amber-50",
    dot: "bg-amber-500",
    helper: "단일 상품 또는 안전자산 집중도가 높습니다."
  }
};

const riskAlertOrder: RiskFlag[] = [
  "risk_asset_over",
  "low_return",
  "high_fee",
  "age_mismatch",
  "no_diversification"
];

const riskAlertSummary = riskAlertOrder
  .map((flag) => ({
    flag,
    label: riskFlagLabels[flag],
    count: employees.filter((employee) => employee.riskFlags.includes(flag)).length
  }))
  .filter((item) => item.count > 0);

export function RiskAlertList() {
  return (
    <section className="card">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-everhero-red">위험 포트폴리오 알림</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            위험 유형별로 빠르게 직원 목록으로 이동
          </h3>
        </div>
        <p className="text-sm text-slate-500">클릭 시 해당 플래그로 직원 목록을 필터링합니다.</p>
      </div>

      <div className="mt-6 grid gap-3">
        {riskAlertSummary.map((item) => {
          const style = riskAlertStyles[item.flag];

          return (
            <Link
              key={item.flag}
              href={`/employees?filter=${item.flag}` as Route}
              className={`group flex items-center justify-between rounded-xl border px-4 py-4 transition ${style.tone}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{style.helper}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-semibold text-slate-900">{item.count}명</p>
                <p className="mt-1 text-sm text-slate-500 group-hover:text-slate-700">
                  직원 목록 보기
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
