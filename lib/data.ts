import type {
  CompanyProfile,
  Employee,
  EmployeeAction,
  EmployeeActionStatus,
  PortfolioItem,
  ProductCategory,
  RiskFlag
} from "@/types";

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
  employee_actions?: SupabaseEmployeeActionRow[] | null;
}

interface SupabaseCompanyProfileRow {
  name: string;
  industry: string;
  employee_count: number;
  pension_type: string;
  provider: string;
}

interface SupabaseEmployeeActionRow {
  id: string;
  employee_id: string;
  status: EmployeeActionStatus;
  note: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
}

interface EmployeeActionInput {
  employeeId: string;
  status: EmployeeActionStatus;
  note: string;
  ownerName: string;
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

function mapEmployeeAction(row?: SupabaseEmployeeActionRow | null): EmployeeAction | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    employeeId: row.employee_id,
    status: row.status,
    note: row.note ?? "",
    ownerName: row.owner_name ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
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
    portfolio: mapPortfolio(row.employee_portfolios),
    action: mapEmployeeAction(row.employee_actions?.[0] ?? null)
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

const employeeBaseSelect = `
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
`;

const employeeSelectWithActions = `
  ${employeeBaseSelect},
  employee_actions (
    id,
    employee_id,
    status,
    note,
    owner_name,
    created_at,
    updated_at
  )
`;

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

    const responseWithActions = await supabase
      .from("employees")
      .select(employeeSelectWithActions)
      .order("name", { ascending: true });

    if (!responseWithActions.error && responseWithActions.data && responseWithActions.data.length > 0) {
      return (responseWithActions.data as SupabaseEmployeeRow[]).map(mapEmployee);
    }

    const { data, error } = await supabase
      .from("employees")
      .select(employeeBaseSelect)
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

export async function upsertEmployeeAction(input: EmployeeActionInput): Promise<EmployeeAction> {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase 클라이언트를 생성하지 못했습니다.");
  }

  const { data, error } = await supabase
    .from("employee_actions")
    .upsert(
      {
        employee_id: input.employeeId,
        status: input.status,
        note: input.note,
        owner_name: input.ownerName,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "employee_id"
      }
    )
    .select("id, employee_id, status, note, owner_name, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error("조치 상태 저장에 실패했습니다. Supabase 스키마를 먼저 반영해 주세요.");
  }

  return mapEmployeeAction(data as SupabaseEmployeeActionRow) as EmployeeAction;
}
