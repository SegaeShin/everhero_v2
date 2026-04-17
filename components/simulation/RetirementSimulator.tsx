"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import { formatAmount } from "@/lib/format";
import type { RetirementSimulationResult } from "@/lib/retirement-simulation";
import type { Employee } from "@/types";

interface RetirementSimulatorProps {
  employees: Employee[];
  simulation: RetirementSimulationResult;
}

function formatCurrency(amount: number) {
  return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

export function RetirementSimulator({ employees, simulation }: RetirementSimulatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedEmployee =
    employees.find((employee) => employee.id === simulation.employeeId) ?? employees[0];
  const maxBalance = Math.max(...simulation.scenarios.map((scenario) => scenario.projectedBalance));

  const handleEmployeeChange = (employeeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("employeeId", employeeId);
    router.push(`${pathname}?${params.toString()}` as Route);
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-everhero-red">은퇴 시뮬레이터</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              은퇴 연령별 예상 적립금과 월 수령액 비교
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              현재 적립금, 월 납입액, 최근 수익률을 바탕으로 단순 추정한 데모 시뮬레이션입니다.
            </p>
          </div>

          <label className="flex min-w-[280px] flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Employee
            </span>
            <select
              value={simulation.employeeId}
              onChange={(event) => handleEmployeeChange(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-everhero-red focus:ring-2 focus:ring-red-100"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.department})
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-sm font-medium text-slate-500">현재 나이</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{simulation.currentAge}세</p>
          <p className="mt-2 text-sm text-slate-500">{selectedEmployee.birthYear}년생</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-500">현재 적립금</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {formatAmount(simulation.currentBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-500">샘플 데이터 기준</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-500">월 납입액</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {Math.round(simulation.monthlyContribution / 10_000).toLocaleString("ko-KR")}만
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {simulation.monthlyContribution.toLocaleString("ko-KR")}원
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-500">가정 수익률</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {(simulation.expectedReturnRate * 100).toFixed(1)}%
          </p>
          <p className="mt-2 text-sm text-slate-500">최근 수익률 기반 단순 적용</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">은퇴 시점별 시나리오</p>
          <div className="mt-5 space-y-4">
            {simulation.scenarios.map((scenario) => (
              <div key={scenario.retirementAge}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{scenario.retirementAge}세 은퇴</p>
                    <p className="mt-1 text-sm text-slate-500">
                      남은 기간 {scenario.yearsToRetirement}년
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-lg font-semibold text-slate-900">
                      {formatAmount(scenario.projectedBalance)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      월 예상 수령액 {formatCurrency(scenario.projectedMonthlyPension)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-everhero-red"
                    style={{ width: `${(scenario.projectedBalance / maxBalance) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">해석 가이드</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
              은퇴 연령을 늦출수록 복리 구간과 납입 기간이 늘어나 예상 적립금이 커집니다.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
              월 예상 수령액은 은퇴 후 20년 균등 인출을 가정한 단순 계산 결과입니다.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
              실제 연금 수령액은 세금, 추가 납입, 운용 성과, 수령 방식에 따라 달라질 수 있습니다.
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
              본 시뮬레이션은 투자 자문이 아닌 참고 정보이며, 데모 목적의 단순 추정치입니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
