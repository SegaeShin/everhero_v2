import type { Employee } from "@/types";

export interface RetirementScenario {
  retirementAge: number;
  yearsToRetirement: number;
  projectedBalance: number;
  projectedMonthlyPension: number;
}

export interface RetirementSimulationResult {
  employeeId: string;
  currentAge: number;
  currentBalance: number;
  monthlyContribution: number;
  expectedReturnRate: number;
  scenarios: RetirementScenario[];
}

const DEFAULT_RETIREMENT_AGES = [55, 60, 65, 70];

function projectFutureValue(balance: number, monthlyContribution: number, annualReturn: number, years: number) {
  const monthlyRate = annualReturn / 12;
  const months = years * 12;

  if (months <= 0) {
    return balance;
  }

  const futurePrincipal = balance * (1 + monthlyRate) ** months;
  const futureContributions =
    monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);

  return futurePrincipal + futureContributions;
}

function estimateMonthlyPension(projectedBalance: number) {
  // 데모 목적상 은퇴 후 20년(240개월) 균등 인출 가정
  return projectedBalance / 240;
}

export function getRetirementBaseEmployee(employees: Employee[], employeeId?: string) {
  return employees.find((employee) => employee.id === employeeId) ?? employees[0];
}

export function createRetirementSimulation(
  employees: Employee[],
  employeeId?: string
): RetirementSimulationResult {
  const employee = getRetirementBaseEmployee(employees, employeeId);
  const currentAge = 2026 - employee.birthYear;
  const expectedReturnRate = Math.max(employee.returnRate, 4.5) / 100;

  const scenarios = DEFAULT_RETIREMENT_AGES.map((retirementAge) => {
    const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
    const projectedBalance = projectFutureValue(
      employee.balance,
      employee.monthlyContribution,
      expectedReturnRate,
      yearsToRetirement
    );
    const projectedMonthlyPension = estimateMonthlyPension(projectedBalance);

    return {
      retirementAge,
      yearsToRetirement,
      projectedBalance,
      projectedMonthlyPension
    };
  });

  return {
    employeeId: employee.id,
    currentAge,
    currentBalance: employee.balance,
    monthlyContribution: employee.monthlyContribution,
    expectedReturnRate,
    scenarios
  };
}
