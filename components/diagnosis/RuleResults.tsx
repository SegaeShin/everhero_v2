import type { RuleScoreDetail } from "@/types";

interface RuleResultsProps {
  rules: RuleScoreDetail[];
}

function getBarColor(score: number) {
  if (score < 40) {
    return "bg-red-500";
  }

  if (score < 70) {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
}

export function RuleResults({ rules }: RuleResultsProps) {
  return (
    <section className="card">
      <p className="text-sm font-semibold text-everhero-red">항목별 진단</p>
      <div className="mt-5 space-y-5">
        {rules.map((rule) => (
          <div key={rule.key}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-slate-900">{rule.label}</p>
              <p className="text-sm font-semibold text-slate-700">{rule.score}점</p>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(rule.score)}`}
                style={{ width: `${rule.score}%` }}
              />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{rule.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
