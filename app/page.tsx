import { RiskAlertList } from "@/components/dashboard/RiskAlertList";
import { StatCard } from "@/components/dashboard/StatCard";
import { getCompanyProfile, getEmployees } from "@/lib/data";
import { formatAmount } from "@/lib/format";

export default async function DashboardPage() {
  const [companyProfile, employees] = await Promise.all([getCompanyProfile(), getEmployees()]);
  const totalBalance = employees.reduce((sum, employee) => sum + employee.balance, 0);
  const averageReturn =
    employees.length === 0
      ? 0
      : employees.reduce((sum, employee) => sum + employee.returnRate, 0) / employees.length;
  const flaggedEmployees = employees.filter((employee) => employee.riskFlags.length > 0).length;

  const dashboardStats = [
    {
      label: "총 직원",
      value: `${companyProfile.employeeCount.toLocaleString("ko-KR")}명`,
      subValue: `관리 대상 ${employees.length}명`,
      trend: "up" as const
    },
    {
      label: "총 적립금",
      value: formatAmount(totalBalance),
      subValue: "Supabase 또는 샘플 데이터 기준",
      trend: "up" as const
    },
    {
      label: "평균 수익률",
      value: `${averageReturn.toFixed(1)}%`,
      subValue: "직원 평균 기준",
      trend: "up" as const
    },
    {
      label: "관리 필요",
      value: `${flaggedEmployees}명`,
      subValue: "위험 플래그 보유 직원",
      trend: flaggedEmployees > 0 ? ("down" as const) : ("up" as const)
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            subValue={stat.subValue}
            trend={stat.trend}
          />
        ))}
      </section>

      <RiskAlertList employees={employees} />
    </div>
  );
}
