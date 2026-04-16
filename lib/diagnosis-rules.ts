import { benchmarkData } from "@/lib/mock-benchmark";
import type { DiagnosisResult, Employee, PortfolioItem, RuleScoreDetail } from "@/types";

const CURRENT_YEAR = 2026;

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getEstimatedRiskAssetRatio(portfolio: PortfolioItem[]) {
  return portfolio.reduce((sum, item) => {
    if (item.category === "equity" || item.category === "alternative") {
      return sum + item.allocation;
    }

    if (item.category === "mixed") {
      return sum + item.allocation * 0.5;
    }

    // TDF는 은퇴시점에 따라 위험자산 비중이 달라지는 상품이라 데모에서는 위험자산 60%로 간주합니다.
    if (item.category === "tdf") {
      return sum + item.allocation * 0.6;
    }

    return sum;
  }, 0);
}

export function riskAssetRatio(portfolio: PortfolioItem[]) {
  const ratio = getEstimatedRiskAssetRatio(portfolio);

  if (ratio <= 70) {
    return { ratio, score: 100 };
  }

  if (ratio < 80) {
    return {
      ratio,
      score: clampScore((80 - ratio) * 10)
    };
  }

  return { ratio, score: 0 };
}

export function feeAnalysis(portfolio: PortfolioItem[]) {
  const weightedFee = portfolio.reduce(
    (sum, item) => sum + (item.allocation / 100) * item.feeRate,
    0
  );

  const benchmarkFee = benchmarkData.averageFeeRate;
  const maxFee = benchmarkFee * 1.5;

  if (weightedFee <= benchmarkFee) {
    return { weightedFee, score: 100 };
  }

  if (weightedFee >= maxFee) {
    return { weightedFee, score: 0 };
  }

  const progress = (weightedFee - benchmarkFee) / (maxFee - benchmarkFee);

  return {
    weightedFee,
    score: clampScore(100 - progress * 100)
  };
}

export function returnBenchmark(returnRate: number) {
  const { depositRate, averageReturnRate, kospiReturnRate } = benchmarkData;

  if (returnRate < depositRate) {
    const progress = Math.max(returnRate, 0) / depositRate;
    return { score: clampScore(progress * 30) };
  }

  if (returnRate < averageReturnRate) {
    const progress = (returnRate - depositRate) / (averageReturnRate - depositRate);
    return { score: clampScore(30 + progress * 40) };
  }

  if (returnRate < kospiReturnRate) {
    const progress = (returnRate - averageReturnRate) / (kospiReturnRate - averageReturnRate);
    return { score: clampScore(70 + progress * 20) };
  }

  const upsideRange = Math.max(kospiReturnRate * 0.3, 1);
  const progress = Math.min((returnRate - kospiReturnRate) / upsideRange, 1);

  return { score: clampScore(90 + progress * 10) };
}

export function diversification(portfolio: PortfolioItem[]) {
  const hhi = portfolio.reduce((sum, item) => sum + (item.allocation / 100) ** 2, 0);

  if (hhi <= 0.2) {
    return { hhi, score: 100 };
  }

  const progress = (hhi - 0.2) / 0.8;

  return {
    hhi,
    score: clampScore(100 - progress * 100)
  };
}

export function ageAlignment(birthYear: number, portfolio: PortfolioItem[]) {
  const age = CURRENT_YEAR - birthYear;
  const recommendedRiskAssetRatio = Math.max(20, 100 - age);
  const actualRiskAssetRatio = getEstimatedRiskAssetRatio(portfolio);
  const gap = Math.abs(actualRiskAssetRatio - recommendedRiskAssetRatio);

  let score = 20;

  if (gap <= 10) {
    score = 100;
  } else if (gap <= 20) {
    score = clampScore(100 - ((gap - 10) / 10) * 40);
  } else if (gap < 30) {
    score = clampScore(60 - ((gap - 20) / 10) * 40);
  }

  return {
    age,
    recommendedRiskAssetRatio,
    actualRiskAssetRatio,
    gap,
    score
  };
}

export function overallScore(scores: Omit<DiagnosisResult, "overallScore" | "aiComment" | "recommendations" | "ruleDetails">) {
  const weighted =
    scores.riskScore * 0.3 +
    scores.feeScore * 0.2 +
    scores.returnScore * 0.2 +
    scores.diversificationScore * 0.15 +
    scores.ageAlignmentScore * 0.15;

  return clampScore(weighted);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function buildRuleDetails(employee: Employee, scores: {
  risk: ReturnType<typeof riskAssetRatio>;
  fee: ReturnType<typeof feeAnalysis>;
  performance: ReturnType<typeof returnBenchmark>;
  diversify: ReturnType<typeof diversification>;
  ageFit: ReturnType<typeof ageAlignment>;
}): RuleScoreDetail[] {
  return [
    {
      key: "riskScore",
      label: "위험자산 비율",
      score: scores.risk.score,
      message:
        scores.risk.ratio > 70
          ? `위험자산 비율 ${formatPercent(scores.risk.ratio)}로 DC형 한도(70%)를 초과합니다. 주식형 비중 축소 권장`
          : `위험자산 비율 ${formatPercent(scores.risk.ratio)}로 규제 한도 내에서 관리되고 있습니다.`
    },
    {
      key: "feeScore",
      label: "수수료 적정성",
      score: scores.fee.score,
      message:
        scores.fee.weightedFee > benchmarkData.averageFeeRate
          ? `가중 평균 수수료 ${formatPercent(scores.fee.weightedFee)}로 업종 평균(0.38%)보다 높습니다.`
          : `가중 평균 수수료 ${formatPercent(scores.fee.weightedFee)}로 업종 평균 이하입니다.`
    },
    {
      key: "returnScore",
      label: "수익률 성과",
      score: scores.performance.score,
      message:
        employee.returnRate < benchmarkData.depositRate
          ? `수익률 ${formatPercent(employee.returnRate)}로 예금 금리(${benchmarkData.depositRate.toFixed(1)}%)에도 못 미칩니다.`
          : employee.returnRate < benchmarkData.averageReturnRate
            ? `수익률 ${formatPercent(employee.returnRate)}로 업종 평균(${benchmarkData.averageReturnRate.toFixed(1)}%)을 하회합니다.`
            : `수익률 ${formatPercent(employee.returnRate)}로 업종 평균 대비 양호한 성과입니다.`
    },
    {
      key: "diversificationScore",
      label: "자산 분산도",
      score: scores.diversify.score,
      message:
        scores.diversify.hhi > 0.45
          ? `집중도(HHI ${scores.diversify.hhi.toFixed(2)})가 높습니다. 상품 수를 늘려 분산이 필요합니다.`
          : `집중도(HHI ${scores.diversify.hhi.toFixed(2)})가 비교적 안정적입니다.`
    },
    {
      key: "ageAlignmentScore",
      label: "연령 적합성",
      score: scores.ageFit.score,
      message:
        scores.ageFit.gap > 20
          ? `${scores.ageFit.age}세 기준 권장 위험자산 ${scores.ageFit.recommendedRiskAssetRatio.toFixed(0)}%와 차이가 큽니다.`
          : `${scores.ageFit.age}세 기준 권장 위험자산 ${scores.ageFit.recommendedRiskAssetRatio.toFixed(0)}%와 큰 차이가 없습니다.`
    }
  ];
}

function buildRecommendations(ruleDetails: RuleScoreDetail[]) {
  return ruleDetails
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((rule) => `${rule.label} 개선 우선순위 검토`);
}

function getOverallStatus(score: number) {
  if (score < 40) {
    return "위험";
  }

  if (score < 70) {
    return "주의";
  }

  return "양호";
}

export function createLocalAiComment(employee: Employee, result: DiagnosisResult) {
  const strengths = result.ruleDetails.filter((detail) => detail.score >= 70).slice(0, 2);
  const weaknesses = result.ruleDetails.filter((detail) => detail.score < 70).slice(0, 3);

  const lines = [
    "## 종합 진단",
    `${employee.name}님의 포트폴리오는 종합 ${result.overallScore}점으로 ${getOverallStatus(result.overallScore)} 수준입니다.`,
    weaknesses.length > 0
      ? `특히 ${weaknesses.map((item) => item.label).join(", ")} 측면에서 개선 여지가 확인됩니다.`
      : "전반적인 자산 배분과 성과 흐름이 비교적 안정적으로 관리되고 있습니다.",
    "",
    "## 주요 발견사항",
    ...strengths.map((item) => `- 강점: ${item.message}`),
    ...weaknesses.map((item) => `- 점검: ${item.message}`),
    "",
    "## 개선 권고사항",
    ...result.recommendations.map((recommendation, index) => `- 우선순위 ${index + 1}: ${recommendation}`),
    `- 상품 구성 점검: ${employee.portfolio.map((item) => item.productName).join(", ")} 조합을 재검토하세요.`,
    "",
    "## 참고사항",
    "- 투자 자문이 아닌 참고 정보입니다.",
    "- 본 데모의 상품명은 예시입니다."
  ];

  return lines.join("\n");
}

export function diagnoseEmployee(employee: Employee): DiagnosisResult {
  const risk = riskAssetRatio(employee.portfolio);
  const fee = feeAnalysis(employee.portfolio);
  const performance = returnBenchmark(employee.returnRate);
  const diversify = diversification(employee.portfolio);
  const ageFit = ageAlignment(employee.birthYear, employee.portfolio);

  const baseScores = {
    riskScore: risk.score,
    feeScore: fee.score,
    returnScore: performance.score,
    diversificationScore: diversify.score,
    ageAlignmentScore: ageFit.score
  };

  const ruleDetails = buildRuleDetails(employee, {
    risk,
    fee,
    performance,
    diversify,
    ageFit
  });

  const result: DiagnosisResult = {
    ...baseScores,
    overallScore: overallScore(baseScores),
    aiComment: "",
    recommendations: buildRecommendations(ruleDetails),
    ruleDetails
  };

  return {
    ...result,
    aiComment: createLocalAiComment(employee, result)
  };
}
