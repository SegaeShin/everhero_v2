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
  query: string;
  selectedAgeGroup: string;
  selectedSort: string;
  selectedQuickFilter: string;
}

const CURRENT_YEAR = 2026;
const LOW_RETURN_THRESHOLD = 5.2;

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

const quickFilterOptions = [
  { value: "", label: "전체 보기", countLabel: "전체 대상" },
  { value: "needs-attention", label: "상담 필요", countLabel: "우선 확인" },
  { value: "low-return", label: "수익률 부진", countLabel: "저수익" },
  { value: "deposit-heavy", label: "원리금보장 쏠림", countLabel: "예금 편중" },
  { value: "age-mismatch", label: "연령 부적합", countLabel: "연령 재점검" },
  { value: "risk-asset-over", label: "위험자산 과다", countLabel: "고위험" }
];

function getAge(birthYear: number) {
  return CURRENT_YEAR - birthYear;
}

function getAgeGroupLabel(age: number) {
  if (age < 30) {
    return "20대";
  }

  if (age < 40) {
    return "30대";
  }

  if (age < 50) {
    return "40대";
  }

  return "50대+";
}

function getDepositAllocation(employee: Employee) {
  return employee.portfolio
    .filter((item) => item.category === "deposit")
    .reduce((sum, item) => sum + item.allocation, 0);
}

function needsAttention(employee: Employee) {
  return employee.riskFlags.length > 0 || employee.returnRate < LOW_RETURN_THRESHOLD;
}

function getPriorityLabel(employee: Employee) {
  if (employee.returnRate < 3 || employee.riskFlags.length >= 2) {
    return {
      label: "즉시 확인",
      className: "bg-red-50 text-red-700 ring-red-200"
    };
  }

  if (needsAttention(employee)) {
    return {
      label: "우선 점검",
      className: "bg-amber-50 text-amber-700 ring-amber-200"
    };
  }

  return {
    label: "안정",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  };
}

function SearchInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-[220px] flex-1 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Search
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="직원명 또는 부서 검색"
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-everhero-red focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

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
  selectedRiskFlag,
  query,
  selectedAgeGroup,
  selectedSort,
  selectedQuickFilter
}: EmployeeTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (nextValues: {
    department?: string;
    filter?: string;
    query?: string;
    ageGroup?: string;
    sort?: string;
    quick?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextDepartment =
      nextValues.department !== undefined ? nextValues.department : selectedDepartment;
    const nextFilter = nextValues.filter !== undefined ? nextValues.filter : selectedRiskFlag;
    const nextQuery = nextValues.query !== undefined ? nextValues.query : query;
    const nextAgeGroup =
      nextValues.ageGroup !== undefined ? nextValues.ageGroup : selectedAgeGroup;
    const nextSort = nextValues.sort !== undefined ? nextValues.sort : selectedSort;
    const nextQuick =
      nextValues.quick !== undefined ? nextValues.quick : selectedQuickFilter;

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

    if (nextQuery) {
      params.set("query", nextQuery);
    } else {
      params.delete("query");
    }

    if (nextAgeGroup) {
      params.set("ageGroup", nextAgeGroup);
    } else {
      params.delete("ageGroup");
    }

    if (nextSort && nextSort !== "priority") {
      params.set("sort", nextSort);
    } else {
      params.delete("sort");
    }

    if (nextQuick) {
      params.set("quick", nextQuick);
    } else {
      params.delete("quick");
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

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

  const ageGroupOptions: FilterOption[] = [
    { value: "", label: "전체 연령대" },
    { value: "20s", label: "20대" },
    { value: "30s", label: "30대" },
    { value: "40s", label: "40대" },
    { value: "50s+", label: "50대 이상" }
  ];

  const sortOptions: FilterOption[] = [
    { value: "priority", label: "우선순위 높은 순" },
    { value: "low-return", label: "수익률 낮은 순" },
    { value: "high-balance", label: "적립금 높은 순" },
    { value: "name", label: "이름순" }
  ];

  const attentionCount = employees.filter((employee) => needsAttention(employee)).length;
  const lowReturnCount = employees.filter(
    (employee) => employee.returnRate < LOW_RETURN_THRESHOLD
  ).length;
  const depositHeavyCount = employees.filter(
    (employee) => getDepositAllocation(employee) >= 70
  ).length;

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold text-everhero-red">직원 관리</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">직원 포트폴리오 목록</h3>
            <p className="mt-1 text-sm text-slate-500">
              우선 관리 대상, 부서, 연령대, 위험 유형 기준으로 빠르게 좁혀서 바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SearchInput value={query} onChange={(nextQuery) => updateFilters({ query: nextQuery })} />
            <FilterSelect
              label="Department"
              value={selectedDepartment}
              options={departmentOptions}
              onChange={(department) => updateFilters({ department })}
            />
            <FilterSelect
              label="Age Group"
              value={selectedAgeGroup}
              options={ageGroupOptions}
              onChange={(ageGroup) => updateFilters({ ageGroup })}
            />
            <FilterSelect
              label="Risk Flag"
              value={selectedRiskFlag}
              options={riskOptions}
              onChange={(filter) => updateFilters({ filter })}
            />
            <FilterSelect
              label="Sort"
              value={selectedSort}
              options={sortOptions}
              onChange={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
              우선 확인
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{attentionCount}명</p>
            <p className="mt-1 text-sm text-slate-600">
              위험 플래그 또는 수익률 부진으로 빠른 검토가 필요한 직원
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
              수익률 부진
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{lowReturnCount}명</p>
            <p className="mt-1 text-sm text-slate-600">
              기준 수익률 {LOW_RETURN_THRESHOLD.toFixed(1)}% 미만 직원
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              예금 편중
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{depositHeavyCount}명</p>
            <p className="mt-1 text-sm text-slate-600">
              원리금보장형 비중이 70% 이상인 직원
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {quickFilterOptions.map((option) => {
            const isActive = selectedQuickFilter === option.value;

            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => updateFilters({ quick: option.value })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-everhero-red bg-red-50 text-everhero-red"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">이름</th>
              <th className="px-5 py-3 font-medium">부서</th>
              <th className="px-5 py-3 font-medium">관리 우선도</th>
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
                      <p className="mt-1 text-xs text-slate-500">
                        {getAge(employee.birthYear)}세 · {getAgeGroupLabel(getAge(employee.birthYear))}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{employee.department}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                          getPriorityLabel(employee).className
                        }`}
                      >
                        {getPriorityLabel(employee).label}
                      </span>
                      <p className="text-xs text-slate-500">
                        원리금보장 {getDepositAllocation(employee)}%
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{formatAmount(employee.balance)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        employee.returnRate < LOW_RETURN_THRESHOLD
                          ? "text-red-600"
                          : "text-emerald-600"
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
                <td colSpan={7} className="px-5 py-12 text-center">
                  <p className="font-medium text-slate-700">조건에 맞는 직원이 없습니다.</p>
                  <p className="mt-2 text-sm text-slate-500">
                    검색어나 빠른 필터, 부서/연령대 조건을 조정해 다시 확인해 주세요.
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
