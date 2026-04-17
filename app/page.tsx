import { RiskAlertList } from "@/components/dashboard/RiskAlertList";
import { StatCard } from "@/components/dashboard/StatCard";
import { getEmployees } from "@/lib/data";
import { formatAmount } from "@/lib/format";
import { benchmarkData } from "@/lib/mock-benchmark";
import type { RiskFlag } from "@/types";

const riskFlagLabels: Record<RiskFlag, string> = {
  risk_asset_over: "위험자산 초과",
  high_fee: "수수료 과다",
  low_return: "저수익",
  no_diversification: "분산 부족",
  age_mismatch: "연령 부적합"
};

function getWeightedFee(employee: { portfolio: Array<{ allocation: number; feeRate: number }> }) {
  return employee.portfolio.reduce(
    (sum, item) => sum + (item.allocation / 100) * item.feeRate,
    0
  );
}

export default async function DashboardPage() {
  const employees = await getEmployees();
  const totalBalance = employees.reduce((sum, employee) => sum + employee.balance, 0);
  const averageBalance = employees.length === 0 ? 0 : totalBalance / employees.length;
  const averageFee =
    employees.length === 0
      ? 0
      : employees.reduce((sum, employee) => sum + getWeightedFee(employee), 0) / employees.length;
  const averageReturn =
    employees.length === 0
      ? 0
      : employees.reduce((sum, employee) => sum + employee.returnRate, 0) / employees.length;
  const flaggedEmployees = employees.filter((employee) => employee.riskFlags.length > 0).length;
  const flaggedRatio = employees.length === 0 ? 0 : (flaggedEmployees / employees.length) * 100;
  const returnGap = averageReturn - benchmarkData.averageReturnRate;
  const feeGap = averageFee - benchmarkData.averageFeeRate;
  const riskFlagCounts = Object.entries(riskFlagLabels).map(([flag, label]) => ({
    flag: flag as RiskFlag,
    label,
    count: employees.filter((employee) => employee.riskFlags.includes(flag as RiskFlag)).length
  }));
  const topRiskFlag = [...riskFlagCounts].sort((a, b) => b.count - a.count)[0];
  const depositHeavyEmployees = employees.filter((employee) => {
    const depositAllocation = employee.portfolio
      .filter((item) => item.category === "deposit")
      .reduce((sum, item) => sum + item.allocation, 0);

    return depositAllocation >= 70;
  }).length;
  const benchmarkSummary = [
    {
      label: "평균 수익률",
      tone: returnGap >= 0 ? "emerald" : "red",
      message:
        returnGap >= 0
          ? `업종 평균 ${benchmarkData.averageReturnRate.toFixed(1)}% 대비 +${returnGap.toFixed(1)}%p 높습니다.`
          : `업종 평균 ${benchmarkData.averageReturnRate.toFixed(1)}% 대비 ${returnGap.toFixed(1)}%p 낮습니다.`
    },
    {
      label: "평균 수수료",
      tone: feeGap <= 0 ? "emerald" : "amber",
      message:
        feeGap <= 0
          ? `업종 평균 ${benchmarkData.averageFeeRate.toFixed(2)}% 이내로 관리되고 있습니다.`
          : `업종 평균 ${benchmarkData.averageFeeRate.toFixed(2)}% 대비 +${feeGap.toFixed(2)}%p 높아 점검이 필요합니다.`
    },
    {
      label: "예금 편중",
      tone: depositHeavyEmployees === 0 ? "emerald" : "slate",
      message:
        depositHeavyEmployees > 0
          ? `원리금보장 비중 70% 이상 직원이 ${depositHeavyEmployees}명 있습니다.`
          : "원리금보장 과도 편중 직원이 없습니다."
    }
  ] as const;

  const dashboardStats = [
    {
      label: "총 직원",
      value: `${employees.length.toLocaleString("ko-KR")}명`,
      subValue:
        flaggedEmployees > 0
          ? `${flaggedEmployees}명이 관리 필요 상태로 확인됩니다`
          : "현재 위험 플래그가 있는 직원이 없습니다",
      trend: "neutral" as const
    },
    {
      label: "총 적립금",
      value: formatAmount(totalBalance),
      subValue:
        employees.length > 0
          ? `직원 1인당 평균 ${formatAmount(Math.round(averageBalance))}`
          : "분석 가능한 직원 데이터가 없습니다",
      trend: "neutral" as const
    },
    {
      label: "평균 수익률",
      value: `${averageReturn.toFixed(1)}%`,
      subValue:
        returnGap >= 0
          ? `기준 수익률 ${benchmarkData.averageReturnRate.toFixed(1)}% 대비 +${returnGap.toFixed(1)}%p`
          : `기준 수익률 ${benchmarkData.averageReturnRate.toFixed(1)}% 대비 ${returnGap.toFixed(1)}%p`,
      trend: returnGap >= 0 ? ("up" as const) : ("down" as const)
    },
    {
      label: "관리 필요",
      value: `${flaggedEmployees}명`,
      subValue:
        flaggedEmployees > 0 && topRiskFlag?.count
          ? `전체의 ${flaggedRatio.toFixed(0)}% · ${topRiskFlag.label} 중심 점검 필요`
          : "현재 별도 후속 점검 대상이 없습니다",
      trend: flaggedEmployees > 0 ? ("down" as const) : ("up" as const)
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            subValue={stat.subValue}
            trend={stat.trend}
          />
        ))}
      </section>

      <section className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-everhero-red">벤치마크 요약</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              우리 회사 퇴직연금 운영 상태를 빠르게 해석
            </h3>
          </div>
          <p className="text-sm text-slate-500">{benchmarkData.industry} 업종 평균 기준 비교</p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {benchmarkSummary.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border px-4 py-4 ${
                item.tone === "emerald"
                  ? "border-emerald-200 bg-emerald-50/70"
                  : item.tone === "red"
                    ? "border-red-200 bg-red-50/70"
                    : item.tone === "amber"
                      ? "border-amber-200 bg-amber-50/80"
                      : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.message}</p>
            </div>
          ))}
        </div>
      </section>

      <RiskAlertList employees={employees} />
    </div>
  );
}
