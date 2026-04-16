interface ScoreCardProps {
  score: number;
}

function getScoreTone(score: number) {
  if (score < 40) {
    return {
      label: "위험",
      color: "text-red-600",
      stroke: "#DC2626",
      background: "from-red-50 to-white"
    };
  }

  if (score < 70) {
    return {
      label: "주의",
      color: "text-amber-600",
      stroke: "#F59E0B",
      background: "from-amber-50 to-white"
    };
  }

  return {
    label: "양호",
    color: "text-emerald-600",
    stroke: "#16A34A",
    background: "from-emerald-50 to-white"
  };
}

export function ScoreCard({ score }: ScoreCardProps) {
  const tone = getScoreTone(score);
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <section className={`card bg-gradient-to-br ${tone.background}`}>
      <p className="text-sm font-semibold text-everhero-red">종합 점수</p>
      <div className="mt-6 flex justify-center">
        <div className="relative h-44 w-44">
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={tone.stroke}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-semibold text-slate-900">{score}</p>
            <p className={`mt-2 text-sm font-semibold ${tone.color}`}>{tone.label}</p>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-slate-500">
        0~40 위험 · 40~70 주의 · 70~100 양호
      </p>
    </section>
  );
}
