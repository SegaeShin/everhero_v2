import { employees, riskFlagLabels } from "@/lib/mock-data";

function formatBalance(balance: number) {
  return `${Math.round(balance / 10_000).toLocaleString("ko-KR")}만`;
}

export default function EmployeesPage() {
  const sortedEmployees = [...employees].sort((a, b) => a.returnRate - b.returnRate);

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold text-everhero-red">직원 관리</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900">Phase 1 데이터 연결 확인</h3>
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
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-medium text-slate-900">{employee.name}</td>
                <td className="px-5 py-4 text-slate-600">{employee.department}</td>
                <td className="px-5 py-4 text-slate-600">{formatBalance(employee.balance)}</td>
                <td className="px-5 py-4 text-slate-600">{employee.returnRate.toFixed(1)}%</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {employee.riskFlags.length === 0 ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        우량
                      </span>
                    ) : (
                      employee.riskFlags.map((flag) => (
                        <span
                          key={flag}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                        >
                          {riskFlagLabels[flag]}
                        </span>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
