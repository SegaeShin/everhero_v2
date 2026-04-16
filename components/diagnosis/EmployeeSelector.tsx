"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

import type { Employee } from "@/types";

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployeeId: string;
}

export function EmployeeSelector({
  employees,
  selectedEmployeeId
}: EmployeeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (employeeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("employeeId", employeeId);
    router.push(`${pathname}?${params.toString()}` as Route);
  };

  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Employee
      </span>
      <select
        value={selectedEmployeeId}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-everhero-red focus:ring-2 focus:ring-red-100"
      >
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} ({employee.department})
          </option>
        ))}
      </select>
    </label>
  );
}
