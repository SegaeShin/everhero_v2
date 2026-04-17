import type { CompanyProfile, Employee, PortfolioItem, ProductCategory, RiskFlag } from "@/types";

import {
  companyProfile as fallbackCompanyProfile,
  employees as fallbackEmployees
} from "@/lib/mock-data";
import { getSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase";

interface SupabaseRiskFlagRow {
  flag: RiskFlag;
}

interface SupabasePortfolioRow {
  product_name: string;
  category: ProductCategory;
  allocation: number;
  return_rate: number;
  fee_rate: number;
  risk_level: 1 | 2 | 3 | 4 | 5;
}

interface SupabaseEmployeeRow {
  id: string;
  name: string;
  department: string;
  join_date: string;
  birth_year: number;
  balance: number;
  monthly_contribution: number;
  return_rate: number;
  employee_risk_flags?: SupabaseRiskFlagRow[] | null;
  employee_portfolios?: SupabasePortfolioRow[] | null;
}

interface SupabaseCompanyProfileRow {
  name: string;
  industry: string;
  employee_count: number;
  pension_type: string;
  provider: string;
}

function mapPortfolio(rows: SupabasePortfolioRow[] | null | undefined): PortfolioItem[] {
  return (rows ?? [])
    .map((item) => ({
      productName: item.product_name,
      category: item.category,
      allocation: Number(item.allocation),
      returnRate: Number(item.return_rate),
      feeRate: Number(item.fee_rate),
      riskLevel: item.risk_level
    }))
    .sort((a, b) => b.allocation - a.allocation);
}

function mapEmployee(row: SupabaseEmployeeRow): Employee {
  return {
    id: row.id,
    name: row.name,
    department: row.department,
    joinDate: row.join_date,
    birthYear: Number(row.birth_year),
    balance: Number(row.balance),
    monthlyContribution: Number(row.monthly_contribution),
    returnRate: Number(row.return_rate),
    riskFlags: (row.employee_risk_flags ?? []).map((item) => item.flag),
    portfolio: mapPortfolio(row.employee_portfolios)
  };
}

function mapCompanyProfile(row: SupabaseCompanyProfileRow): CompanyProfile {
  return {
    name: row.name,
    industry: row.industry,
    employeeCount: Number(row.employee_count),
    pensionType: row.pension_type,
    provider: row.provider
  };
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  if (!hasSupabaseConfig()) {
    return fallbackCompanyProfile;
  }

  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return fallbackCompanyProfile;
    }

    const { data, error } = await supabase
      .from("company_profiles")
      .select("name, industry, employee_count, pension_type, provider")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return fallbackCompanyProfile;
    }

    return mapCompanyProfile(data);
  } catch {
    return fallbackCompanyProfile;
  }
}

export async function getEmployees(): Promise<Employee[]> {
  if (!hasSupabaseConfig()) {
    return fallbackEmployees;
  }

  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return fallbackEmployees;
    }

    const { data, error } = await supabase
      .from("employees")
      .select(
        `
          id,
          name,
          department,
          join_date,
          birth_year,
          balance,
          monthly_contribution,
          return_rate,
          employee_risk_flags (
            flag
          ),
          employee_portfolios (
            product_name,
            category,
            allocation,
            return_rate,
            fee_rate,
            risk_level
          )
        `
      )
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackEmployees;
    }

    return (data as SupabaseEmployeeRow[]).map(mapEmployee);
  } catch {
    return fallbackEmployees;
  }
}

export async function getEmployeeById(employeeId: string): Promise<Employee | null> {
  const employees = await getEmployees();

  return employees.find((employee) => employee.id === employeeId) ?? null;
}
