export type ProductCategory =
  | "equity"
  | "bond"
  | "deposit"
  | "mixed"
  | "tdf"
  | "alternative";

export type RiskFlag =
  | "risk_asset_over"
  | "high_fee"
  | "low_return"
  | "no_diversification"
  | "age_mismatch";

export interface PortfolioItem {
  productName: string;
  category: ProductCategory;
  allocation: number;
  returnRate: number;
  feeRate: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  joinDate: string;
  birthYear: number;
  balance: number;
  monthlyContribution: number;
  portfolio: PortfolioItem[];
  returnRate: number;
  riskFlags: RiskFlag[];
}

export interface CompanyProfile {
  name: string;
  industry: string;
  employeeCount: number;
  pensionType: string;
  provider: string;
}

export interface ProductCatalogItem {
  name: string;
  category: ProductCategory;
  returnRate: number;
  feeRate: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
}

export interface BenchmarkData {
  industry: string;
  averageFeeRate: number;
  averageReturnRate: number;
  kospiReturnRate: number;
  depositRate: number;
}

export interface RuleScoreDetail {
  key:
    | "riskScore"
    | "feeScore"
    | "returnScore"
    | "diversificationScore"
    | "ageAlignmentScore";
  label: string;
  score: number;
  message: string;
}

export interface DiagnosisResult {
  overallScore: number;
  riskScore: number;
  feeScore: number;
  returnScore: number;
  diversificationScore: number;
  ageAlignmentScore: number;
  aiComment: string;
  recommendations: string[];
  ruleDetails: RuleScoreDetail[];
}
