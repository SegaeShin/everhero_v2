import type { PortfolioItem } from "@/types";
import type { RebalanceSimulation } from "@/lib/rebalance-simulation";

interface RebalanceSimulationCardProps {
  simulation: RebalanceSimulation;
}

const categoryLabels: Record<PortfolioItem["category"], string> = {
  equity: "주식형",
  bond: "채권형",
  deposit: "원리금보장",
  mixed: "혼합형",
  tdf: "TDF",
  alternative: "대안투자"
};

function toneClass(tone: "up" | "down" | "neutral") {
  if (tone === "up") {
    return "text-emerald-600";
  }

  if (tone === "down") {
    return "text-red-600";
  }

  return "text-slate-500";
}

export function RebalanceSimulationCard({
  simulation
}: RebalanceSimulationCardProps) {
  return (
    <section className="card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-everhero-red">상품 전환 시뮬레이션</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            현재 구성 vs 권장 구성 비교
          </h3>
        </div>
        <p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          {simulation.headline}
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {simulation.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">현재</p>
                <p className="text-lg font-semibold text-slate-900">{metric.current}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">권장</p>
                <p className="text-lg font-semibold text-slate-900">{metric.recommended}</p>
              </div>
            </div>
            <p className={`mt-3 text-sm font-semibold ${toneClass(metric.tone)}`}>
              {metric.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-slate-900">전환 제안 구성</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 font-medium">상품명</th>
                  <th className="py-3 font-medium">유형</th>
                  <th className="py-3 font-medium">현재</th>
                  <th className="py-3 font-medium">권장</th>
                </tr>
              </thead>
              <tbody>
                {simulation.allocationRows.map((row) => (
                  <tr key={row.productName} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{row.productName}</td>
                    <td className="py-3 text-slate-600">{categoryLabels[row.category]}</td>
                    <td className="py-3 text-slate-600">{row.currentAllocation}%</td>
                    <td className="py-3 font-semibold text-everhero-red">
                      {row.recommendedAllocation}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">제안 근거</p>
          <div className="mt-4 space-y-3">
            {simulation.rationale.map((line) => (
              <div
                key={line}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
