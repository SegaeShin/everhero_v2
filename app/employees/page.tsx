import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { departments, employees, riskFlagOptions } from "@/lib/mock-data";
import type { RiskFlag } from "@/types";

interface EmployeesPageProps {
  searchParams?: {
    department?: string;
    filter?: string;
  };
}

function isValidRiskFlag(filter: string): filter is RiskFlag {
  return riskFlagOptions.some((option) => option.value === filter);
}

export default function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const selectedDepartment = searchParams?.department ?? "";
  const selectedRiskFlag =
    searchParams?.filter && isValidRiskFlag(searchParams.filter) ? searchParams.filter : "";

  const filteredEmployees = [...employees]
    .filter((employee) =>
      selectedDepartment ? employee.department === selectedDepartment : true
    )
    .filter((employee) =>
      selectedRiskFlag ? employee.riskFlags.includes(selectedRiskFlag) : true
    )
    .sort((a, b) => a.returnRate - b.returnRate);

  return (
    <EmployeeTable
      employees={filteredEmployees}
      departments={departments}
      riskFlagOptions={riskFlagOptions}
      selectedDepartment={selectedDepartment}
      selectedRiskFlag={selectedRiskFlag}
    />
  );
}
