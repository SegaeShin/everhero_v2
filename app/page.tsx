import { RiskAlertList } from "@/components/dashboard/RiskAlertList";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatAmount } from "@/lib/format";
import { companyProfile } from "@/lib/mock-data";

const dashboardStats = [
  {
    label: "총 직원",
    value: `${companyProfile.employeeCount.toLocaleString("ko-KR")}명`,
    subValue: "+12",
    trend: "up" as const
  },
  {
    label: "총 적립금",
    value: formatAmount(18_200_000_000),
    subValue: "+3.2%",
    trend: "up" as const
  },
  {
    label: "평균 수익률",
    value: "6.8%",
    subValue: "벤치마크 +1.2%p",
    trend: "up" as const
  },
  {
    label: "컴플라이언스",
    value: "78점",
    subValue: "미준수 3건",
    trend: "down" as const
  }
];

export default function DashboardPage() {
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

      <RiskAlertList />
    </div>
  );
}
