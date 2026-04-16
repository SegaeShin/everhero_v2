"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import { formatAmount } from "@/lib/format";
import type { Employee, RiskFlag } from "@/types";

interface FilterOption {
  value: string;
  label: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  departments: string[];
  riskFlagOptions: Array<{ value: RiskFlag; label: string }>;
  selectedDepartment: string;
  selectedRiskFlag: string;
}

const employeeFlagBadgeMap: Record<RiskFlag, { label: string; className: string }> = {
  risk_asset_over: {
    label: "위험자산 초과",
    className: "bg-red-50 text-red-700 ring-red-200"
  },
  low_return: {
    label: "저수익",
    className: "bg-red-50 text-red-700 ring-red-200"
  },
  high_fee: {
    label: "수수료↑",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  no_diversification: {
    label: "미분산",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  age_mismatch: {
    label: "연령부적합",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  }
};

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-[180px] flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-everhero-red focus:ring-2 focus:ring-red-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmployeeTable({
  employees,
  departments,
  riskFlagOptions,
  selectedDepartment,
  selectedRiskFlag
}: EmployeeTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (nextValues: { department?: string; filter?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextDepartment =
      nextValues.department !== undefined ? nextValues.department : selectedDepartment;
    const nextFilter = nextValues.filter !== undefined ? nextValues.filter : selectedRiskFlag;

    if (nextDepartment) {
      params.set("department", nextDepartment);
    } else {
      params.delete("department");
    }

    if (nextFilter) {
      params.set("filter", nextFilter);
    } else {
      params.delete("filter");
    }

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.push(href as Route);
  };

  const departmentOptions: FilterOption[] = [
    { value: "", label: "전체 부서" },
    ...departments.map((department) => ({ value: department, label: department }))
  ];

  const riskOptions: FilterOption[] = [
    { value: "", label: "전체 위험 플래그" },
    ...riskFlagOptions.map((option) => ({ value: option.value, label: option.label }))
  ];

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold text-everhero-red">직원 관리</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">직원 포트폴리오 목록</h3>
            <p className="mt-1 text-sm text-slate-500">
              수익률 낮은 순으로 정렬되며, 위험 플래그별로 바로 진단 화면으로 이동할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <FilterSelect
              label="Department"
              value={selectedDepartment}
              options={departmentOptions}
              onChange={(department) => updateFilters({ department })}
            />
            <FilterSelect
              label="Risk Flag"
              value={selectedRiskFlag}
              options={riskOptions}
              onChange={(filter) => updateFilters({ filter })}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">이름</th>
              <th className="px-5 py-3 font-medium">부서</th>
              <th className="px-5 py-3 font-medium">적립금</th>
              <th className="px-5 py-3 font-medium">수익률</th>
              <th className="px-5 py-3 font-medium">플래그</th>
              <th className="px-5 py-3 text-right font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{employee.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{employee.birthYear}년생</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{employee.department}</td>
                  <td className="px-5 py-4 text-slate-600">{formatAmount(employee.balance)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        employee.returnRate < 5.2 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {employee.returnRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {employee.riskFlags.length === 0 ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          우량
                        </span>
                      ) : (
                        employee.riskFlags.map((flag) => (
                          <span
                            key={flag}
                            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                              employeeFlagBadgeMap[flag].className
                            }`}
                          >
                            {employeeFlagBadgeMap[flag].label}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/employees/${employee.id}` as Route}
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        상세
                      </Link>
                      <Link
                        href={`/diagnosis?employeeId=${employee.id}` as Route}
                        className="inline-flex items-center rounded-xl bg-everhero-red px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        진단
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="font-medium text-slate-700">조건에 맞는 직원이 없습니다.</p>
                  <p className="mt-2 text-sm text-slate-500">
                    부서 또는 위험 플래그 필터를 조정해 다시 확인해 주세요.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
