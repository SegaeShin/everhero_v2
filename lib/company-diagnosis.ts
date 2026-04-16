import { benchmarkData } from "@/lib/mock-benchmark";
import { employees } from "@/lib/mock-data";
import { formatAmount } from "@/lib/format";
import type { RiskFlag } from "@/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getWeightedFee(employeeIndex: number) {
  return employees[employeeIndex].portfolio.reduce(
    (sum, item) => sum + (item.allocation / 100) * item.feeRate,
    0
  );
}

function countRiskFlags(flag: RiskFlag) {
  return employees.filter((employee) => employee.riskFlags.includes(flag)).length;
}

const averageReturnRate = average(employees.map((employee) => employee.returnRate));
const averageFeeRate = average(employees.map((_, index) => getWeightedFee(index)));
const totalBalance = employees.reduce((sum, employee) => sum + employee.balance, 0);

const productUsageMap = new Map<
  string,
  {
    name: string;
    memberCount: number;
    allocationSum: number;
    averageReturnRate: number;
  }
>();

employees.forEach((employee) => {
  employee.portfolio.forEach((item) => {
    const current = productUsageMap.get(item.productName);

    if (current) {
      current.memberCount += 1;
      current.allocationSum += item.allocation;
      current.averageReturnRate += item.returnRate;
      return;
    }

    productUsageMap.set(item.productName, {
      name: item.productName,
      memberCount: 1,
      allocationSum: item.allocation,
      averageReturnRate: item.returnRate
    });
  });
});

export const companyDiagnosis = {
  summaryCards: [
    {
      label: "평균 수익률",
      value: `${averageReturnRate.toFixed(1)}%`,
      helper: `업종 평균 대비 ${(averageReturnRate - benchmarkData.averageReturnRate).toFixed(1)}%p`
    },
    {
      label: "평균 수수료",
      value: `${averageFeeRate.toFixed(2)}%`,
      helper: `업종 평균 ${benchmarkData.averageFeeRate.toFixed(2)}%`
    },
    {
      label: "분석 대상 적립금",
      value: formatAmount(totalBalance),
      helper: `샘플 직원 ${employees.length}명 기준`
    },
    {
      label: "저성과 직원 비중",
      value: `${((countRiskFlags("low_return") / employees.length) * 100).toFixed(0)}%`,
      helper: `수익률 부진 ${countRiskFlags("low_return")}명`
    }
  ],
  benchmarkRows: [
    {
      label: "평균 수익률",
      companyValue: averageReturnRate,
      benchmarkValue: benchmarkData.averageReturnRate,
      suffix: "%"
    },
    {
      label: "평균 수수료",
      companyValue: averageFeeRate,
      benchmarkValue: benchmarkData.averageFeeRate,
      suffix: "%"
    },
    {
      label: "KOSPI 비교",
      companyValue: averageReturnRate,
      benchmarkValue: benchmarkData.kospiReturnRate,
      suffix: "%"
    },
    {
      label: "예금 금리 비교",
      companyValue: averageReturnRate,
      benchmarkValue: benchmarkData.depositRate,
      suffix: "%"
    }
  ],
  riskBreakdown: [
    {
      flag: "risk_asset_over" as const,
      label: "위험자산 초과",
      count: countRiskFlags("risk_asset_over"),
      tone: "bg-red-500"
    },
    {
      flag: "low_return" as const,
      label: "저수익",
      count: countRiskFlags("low_return"),
      tone: "bg-red-500"
    },
    {
      flag: "high_fee" as const,
      label: "수수료 과다",
      count: countRiskFlags("high_fee"),
      tone: "bg-amber-500"
    },
    {
      flag: "age_mismatch" as const,
      label: "연령 부적합",
      count: countRiskFlags("age_mismatch"),
      tone: "bg-amber-500"
    },
    {
      flag: "no_diversification" as const,
      label: "미분산",
      count: countRiskFlags("no_diversification"),
      tone: "bg-amber-500"
    }
  ],
  topProducts: Array.from(productUsageMap.values())
    .map((item) => ({
      ...item,
      averageReturnRate: item.averageReturnRate / item.memberCount
    }))
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 6),
  insightLines: [
    averageReturnRate >= benchmarkData.averageReturnRate
      ? `샘플 직원 평균 수익률은 ${averageReturnRate.toFixed(1)}%로 업종 평균을 상회합니다.`
      : `샘플 직원 평균 수익률은 ${averageReturnRate.toFixed(1)}%로 업종 평균을 하회합니다.`,
    averageFeeRate > benchmarkData.averageFeeRate
      ? `평균 수수료가 업종 평균보다 높아 상품 정리와 전환 제안이 필요한 상태입니다.`
      : `평균 수수료는 업종 평균 범위 내로 관리되고 있습니다.`,
    `위험 플래그는 ${countRiskFlags("low_return") + countRiskFlags("high_fee") + countRiskFlags("risk_asset_over")}건이 핵심 점검 포인트입니다.`
  ]
};
