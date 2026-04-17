import { feeAnalysis, riskAssetRatio } from "@/lib/diagnosis-rules";
import { formatAmount } from "@/lib/format";
import { productCatalog } from "@/lib/mock-data";
import type { Employee, PortfolioItem, ProductCategory } from "@/types";

interface SimulationMetric {
  label: string;
  current: string;
  recommended: string;
  delta: string;
  tone: "up" | "down" | "neutral";
}

interface SimulationAllocationRow {
  productName: string;
  category: ProductCategory;
  currentAllocation: number;
  recommendedAllocation: number;
}

export interface RebalanceSimulation {
  headline: string;
  rationale: string[];
  metrics: SimulationMetric[];
  allocationRows: SimulationAllocationRow[];
  recommendedPortfolio: PortfolioItem[];
}

function weightedReturn(portfolio: PortfolioItem[]) {
  return portfolio.reduce((sum, item) => sum + (item.allocation / 100) * item.returnRate, 0);
}

function weightedFee(portfolio: PortfolioItem[]) {
  return portfolio.reduce((sum, item) => sum + (item.allocation / 100) * item.feeRate, 0);
}

function product(name: string) {
  const found = productCatalog.find((item) => item.name === name);

  if (!found) {
    throw new Error(`Unknown product: ${name}`);
  }

  return found;
}

function createPortfolio(
  items: Array<{ name: string; allocation: number }>
): PortfolioItem[] {
  return items.map(({ name, allocation }) => {
    const found = product(name);

    return {
      productName: found.name,
      category: found.category,
      allocation,
      returnRate: found.returnRate,
      feeRate: found.feeRate,
      riskLevel: found.riskLevel
    };
  });
}

function recommendPortfolio(employee: Employee): PortfolioItem[] {
  const age = 2026 - employee.birthYear;
  const hasRiskOver = employee.riskFlags.includes("risk_asset_over");
  const hasLowReturn = employee.riskFlags.includes("low_return");
  const hasHighFee = employee.riskFlags.includes("high_fee");
  const hasNoDiversification = employee.riskFlags.includes("no_diversification");
  const hasAgeMismatch = employee.riskFlags.includes("age_mismatch");

  if (age >= 55) {
    return createPortfolio([
      { name: "KB온국민TDF2035", allocation: 25 },
      { name: "삼성채권안정펀드", allocation: 35 },
      { name: "KB국민은행 정기예금", allocation: 40 }
    ]);
  }

  if (hasRiskOver) {
    return createPortfolio([
      { name: "미래에셋전략배분TDF2045", allocation: 35 },
      { name: "삼성채권안정펀드", allocation: 30 },
      { name: "KB국민은행 정기예금", allocation: 20 },
      { name: "NH올시즌EMP", allocation: 15 }
    ]);
  }

  if (hasLowReturn || hasNoDiversification) {
    return createPortfolio([
      { name: "미래에셋전략배분TDF2045", allocation: 45 },
      { name: "KB한국성장주펀드", allocation: 20 },
      { name: "삼성채권안정펀드", allocation: 20 },
      { name: "KB국민은행 정기예금", allocation: 15 }
    ]);
  }

  if (hasHighFee) {
    return createPortfolio([
      { name: "KB한국성장주펀드", allocation: 30 },
      { name: "미래에셋전략배분TDF2045", allocation: 35 },
      { name: "삼성채권안정펀드", allocation: 20 },
      { name: "KB국민은행 정기예금", allocation: 15 }
    ]);
  }

  if (hasAgeMismatch || age >= 45) {
    return createPortfolio([
      { name: "KB온국민TDF2035", allocation: 35 },
      { name: "삼성채권안정펀드", allocation: 30 },
      { name: "한국밸류EMP혼합", allocation: 20 },
      { name: "KB국민은행 정기예금", allocation: 15 }
    ]);
  }

  return createPortfolio([
    { name: "미래에셋전략배분TDF2045", allocation: 40 },
    { name: "KB한국성장주펀드", allocation: 25 },
    { name: "NH올시즌EMP", allocation: 15 },
    { name: "삼성채권안정펀드", allocation: 20 }
  ]);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDelta(delta: number, suffix = "%p") {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}${suffix}`;
}

function metricTone(delta: number, higherIsBetter: boolean): "up" | "down" | "neutral" {
  if (Math.abs(delta) < 0.05) {
    return "neutral";
  }

  if (higherIsBetter) {
    return delta > 0 ? "up" : "down";
  }

  return delta < 0 ? "up" : "down";
}

export function createRebalanceSimulation(employee: Employee): RebalanceSimulation {
  const recommendedPortfolio = recommendPortfolio(employee);
  const currentExpectedReturn = weightedReturn(employee.portfolio);
  const recommendedExpectedReturn = weightedReturn(recommendedPortfolio);
  const currentFee = weightedFee(employee.portfolio);
  const recommendedFee = weightedFee(recommendedPortfolio);
  const currentRisk = riskAssetRatio(employee.portfolio).ratio;
  const recommendedRisk = riskAssetRatio(recommendedPortfolio).ratio;
  const annualFeeSaving = employee.balance * Math.max((currentFee - recommendedFee) / 100, 0);

  const allocationMap = new Map<string, SimulationAllocationRow>();

  employee.portfolio.forEach((item) => {
    allocationMap.set(item.productName, {
      productName: item.productName,
      category: item.category,
      currentAllocation: item.allocation,
      recommendedAllocation: 0
    });
  });

  recommendedPortfolio.forEach((item) => {
    const existing = allocationMap.get(item.productName);

    if (existing) {
      existing.recommendedAllocation = item.allocation;
      return;
    }

    allocationMap.set(item.productName, {
      productName: item.productName,
      category: item.category,
      currentAllocation: 0,
      recommendedAllocation: item.allocation
    });
  });

  const rationale = [
    `현재 위험자산 비율 ${formatPercent(currentRisk)}를 ${formatPercent(recommendedRisk)} 수준으로 조정하도록 설계했습니다.`,
    `가중 평균 수수료를 ${formatPercent(currentFee)}에서 ${formatPercent(recommendedFee)}로 낮추는 방향입니다.`,
    `단일 상품 집중을 줄이고 TDF·채권·예금 조합으로 분산 구조를 강화했습니다.`
  ];

  return {
    headline:
      annualFeeSaving > 0
        ? `연간 예상 비용 절감 ${formatAmount(annualFeeSaving)}`
        : "수수료 구조는 유사하지만 자산 배분 안정화 효과가 기대됩니다.",
    rationale,
    metrics: [
      {
        label: "가중 기대수익률",
        current: formatPercent(currentExpectedReturn),
        recommended: formatPercent(recommendedExpectedReturn),
        delta: formatDelta(recommendedExpectedReturn - currentExpectedReturn),
        tone: metricTone(recommendedExpectedReturn - currentExpectedReturn, true)
      },
      {
        label: "가중 평균 수수료",
        current: formatPercent(currentFee),
        recommended: formatPercent(recommendedFee),
        delta: formatDelta(recommendedFee - currentFee),
        tone: metricTone(recommendedFee - currentFee, false)
      },
      {
        label: "위험자산 비율",
        current: formatPercent(currentRisk),
        recommended: formatPercent(recommendedRisk),
        delta: formatDelta(recommendedRisk - currentRisk),
        tone: metricTone(Math.abs(70 - recommendedRisk) - Math.abs(70 - currentRisk), false)
      },
      {
        label: "수수료 점수",
        current: `${feeAnalysis(employee.portfolio).score}점`,
        recommended: `${feeAnalysis(recommendedPortfolio).score}점`,
        delta: `${feeAnalysis(recommendedPortfolio).score - feeAnalysis(employee.portfolio).score > 0 ? "+" : ""}${feeAnalysis(recommendedPortfolio).score - feeAnalysis(employee.portfolio).score}점`,
        tone: metricTone(
          feeAnalysis(recommendedPortfolio).score - feeAnalysis(employee.portfolio).score,
          true
        )
      }
    ],
    allocationRows: Array.from(allocationMap.values()).sort(
      (a, b) => b.recommendedAllocation - a.recommendedAllocation || b.currentAllocation - a.currentAllocation
    ),
    recommendedPortfolio
  };
}
