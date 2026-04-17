import type { EmployeeAction, EmployeeActionStatus } from "@/types";

export const employeeActionStatusLabels: Record<EmployeeActionStatus, string> = {
  untouched: "미조치",
  reviewing: "확인중",
  scheduled: "상담예정",
  completed: "조치완료",
  monitoring: "추적관찰"
};

export const employeeActionStatusStyles: Record<EmployeeActionStatus, string> = {
  untouched: "bg-slate-100 text-slate-700 ring-slate-200",
  reviewing: "bg-amber-50 text-amber-700 ring-amber-200",
  scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  monitoring: "bg-violet-50 text-violet-700 ring-violet-200"
};

export const employeeActionStatusOptions = (
  Object.keys(employeeActionStatusLabels) as EmployeeActionStatus[]
).map((value) => ({
  value,
  label: employeeActionStatusLabels[value]
}));

export function getEmployeeActionStatus(action?: EmployeeAction | null): EmployeeActionStatus {
  return action?.status ?? "untouched";
}

export function getEmployeeActionLabel(action?: EmployeeAction | null) {
  return employeeActionStatusLabels[getEmployeeActionStatus(action)];
}

export function getEmployeeActionStyle(action?: EmployeeAction | null) {
  return employeeActionStatusStyles[getEmployeeActionStatus(action)];
}
