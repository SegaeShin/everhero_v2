import { getEmployeeActionLabel, getEmployeeActionStyle } from "@/lib/employee-actions";
import type { EmployeeAction } from "@/types";

export function ActionStatusBadge({ action }: { action?: EmployeeAction | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getEmployeeActionStyle(
        action
      )}`}
    >
      {getEmployeeActionLabel(action)}
    </span>
  );
}
