type StatCardTrend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  trend: StatCardTrend;
}

const trendStyles: Record<StatCardTrend, string> = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-slate-500"
};

const trendSymbols: Record<StatCardTrend, string> = {
  up: "▲",
  down: "▼",
  neutral: "•"
};

export function StatCard({ label, value, subValue, trend }: StatCardProps) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-everhero-red via-red-400 to-orange-300" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className={`mt-3 text-sm font-medium ${trendStyles[trend]}`}>
        {trendSymbols[trend]} {subValue}
      </p>
    </div>
  );
}
