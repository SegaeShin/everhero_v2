import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { getEmployees } from "@/lib/data";
import { riskFlagOptions } from "@/lib/mock-data";
import type { RiskFlag } from "@/types";

interface EmployeesPageProps {
  searchParams?: {
    department?: string;
    filter?: string;
    query?: string;
    ageGroup?: string;
    sort?: string;
    quick?: string;
  };
}

const CURRENT_YEAR = 2026;
const VALID_SORT_OPTIONS = ["priority", "low-return", "high-balance", "name"] as const;
const VALID_QUICK_FILTERS = [
  "needs-attention",
  "low-return",
  "deposit-heavy",
  "age-mismatch",
  "risk-asset-over"
] as const;
const VALID_AGE_GROUPS = ["20s", "30s", "40s", "50s+"] as const;

function isValidRiskFlag(filter: string): filter is RiskFlag {
  return riskFlagOptions.some((option) => option.value === filter);
}

function isValidSortOption(value: string): value is (typeof VALID_SORT_OPTIONS)[number] {
  return VALID_SORT_OPTIONS.includes(value as (typeof VALID_SORT_OPTIONS)[number]);
}

function isValidQuickFilter(value: string): value is (typeof VALID_QUICK_FILTERS)[number] {
  return VALID_QUICK_FILTERS.includes(value as (typeof VALID_QUICK_FILTERS)[number]);
}

function isValidAgeGroup(value: string): value is (typeof VALID_AGE_GROUPS)[number] {
  return VALID_AGE_GROUPS.includes(value as (typeof VALID_AGE_GROUPS)[number]);
}

function getEmployeeAge(birthYear: number) {
  return CURRENT_YEAR - birthYear;
}

function getAgeGroup(age: number) {
  if (age < 30) {
    return "20s";
  }

  if (age < 40) {
    return "30s";
  }

  if (age < 50) {
    return "40s";
  }

  return "50s+";
}

function isDepositHeavy(employee: Awaited<ReturnType<typeof getEmployees>>[number]) {
  const depositAllocation = employee.portfolio
    .filter((item) => item.category === "deposit")
    .reduce((sum, item) => sum + item.allocation, 0);

  return depositAllocation >= 70;
}

function matchesQuickFilter(
  employee: Awaited<ReturnType<typeof getEmployees>>[number],
  quickFilter: string
) {
  switch (quickFilter) {
    case "needs-attention":
      return employee.riskFlags.length > 0 || employee.returnRate < 5.2;
    case "low-return":
      return employee.returnRate < 5.2 || employee.riskFlags.includes("low_return");
    case "deposit-heavy":
      return isDepositHeavy(employee);
    case "age-mismatch":
      return employee.riskFlags.includes("age_mismatch");
    case "risk-asset-over":
      return employee.riskFlags.includes("risk_asset_over");
    default:
      return true;
  }
}

function getPriorityScore(employee: Awaited<ReturnType<typeof getEmployees>>[number]) {
  let score = employee.riskFlags.length * 10;

  if (employee.returnRate < 3) {
    score += 12;
  } else if (employee.returnRate < 5.2) {
    score += 8;
  }

  if (isDepositHeavy(employee)) {
    score += 6;
  }

  if (employee.balance >= 100_000_000) {
    score += 4;
  }

  return score;
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const employees = await getEmployees();
  const departments = Array.from(new Set(employees.map((employee) => employee.department))).sort((a, b) =>
    a.localeCompare(b, "ko")
  );
  const selectedDepartment = searchParams?.department ?? "";
  const selectedRiskFlag =
    searchParams?.filter && isValidRiskFlag(searchParams.filter) ? searchParams.filter : "";
  const query = searchParams?.query?.trim() ?? "";
  const selectedAgeGroup =
    searchParams?.ageGroup && isValidAgeGroup(searchParams.ageGroup) ? searchParams.ageGroup : "";
  const selectedSort =
    searchParams?.sort && isValidSortOption(searchParams.sort) ? searchParams.sort : "priority";
  const selectedQuickFilter =
    searchParams?.quick && isValidQuickFilter(searchParams.quick) ? searchParams.quick : "";

  const filteredEmployees = [...employees]
    .filter((employee) =>
      selectedDepartment ? employee.department === selectedDepartment : true
    )
    .filter((employee) => {
      if (!query) {
        return true;
      }

      const normalizedQuery = query.toLowerCase();

      return (
        employee.name.toLowerCase().includes(normalizedQuery) ||
        employee.department.toLowerCase().includes(normalizedQuery)
      );
    })
    .filter((employee) =>
      selectedAgeGroup ? getAgeGroup(getEmployeeAge(employee.birthYear)) === selectedAgeGroup : true
    )
    .filter((employee) =>
      selectedRiskFlag ? employee.riskFlags.includes(selectedRiskFlag) : true
    )
    .filter((employee) =>
      selectedQuickFilter ? matchesQuickFilter(employee, selectedQuickFilter) : true
    )
    .sort((a, b) => {
      if (selectedSort === "low-return") {
        return a.returnRate - b.returnRate;
      }

      if (selectedSort === "high-balance") {
        return b.balance - a.balance;
      }

      if (selectedSort === "name") {
        return a.name.localeCompare(b.name, "ko");
      }

      return getPriorityScore(b) - getPriorityScore(a) || a.returnRate - b.returnRate;
    });

  return (
    <EmployeeTable
      employees={filteredEmployees}
      departments={departments}
      riskFlagOptions={riskFlagOptions}
      selectedDepartment={selectedDepartment}
      selectedRiskFlag={selectedRiskFlag}
      query={query}
      selectedAgeGroup={selectedAgeGroup}
      selectedSort={selectedSort}
      selectedQuickFilter={selectedQuickFilter}
    />
  );
}
