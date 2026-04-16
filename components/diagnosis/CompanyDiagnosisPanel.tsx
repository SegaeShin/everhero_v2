import Link from "next/link";
import type { Route } from "next";

import { companyDiagnosis } from "@/lib/company-diagnosis";
import { employees } from "@/lib/mock-data";

function formatBenchmarkValue(value: number, suffix: string) {
  return `${value.toFixed(1)}${suffix}`;
}

export function CompanyDiagnosisPanel() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {companyDiagnosis.summaryCards.map((card) => (
          <div key={card.label} className="card">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">벤치마크 비교</p>
          <div className="mt-5 space-y-4">
            {companyDiagnosis.benchmarkRows.map((row) => {
              const maxValue = Math.max(row.companyValue, row.benchmarkValue, 0.1);
              const companyWidth = (row.companyValue / maxValue) * 100;
              const benchmarkWidth = (row.benchmarkValue / maxValue) * 100;

              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-slate-900">{row.label}</p>
                    <p className="text-sm text-slate-500">
                      당사 {formatBenchmarkValue(row.companyValue, row.suffix)} / 기준{" "}
                      {formatBenchmarkValue(row.benchmarkValue, row.suffix)}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>당사</span>
                        <span>{formatBenchmarkValue(row.companyValue, row.suffix)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-everhero-red"
                          style={{ width: `${companyWidth}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>벤치마크</span>
                        <span>{formatBenchmarkValue(row.benchmarkValue, row.suffix)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-400"
                          style={{ width: `${benchmarkWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">위험 플래그 현황</p>
          <div className="mt-5 space-y-4">
            {companyDiagnosis.riskBreakdown.map((item) => {
              const width = (item.count / employees.length) * 100;

              return (
                <div key={item.flag}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                      <p className="font-medium text-slate-900">{item.label}</p>
                    </div>
                    <Link
                      href={`/employees?filter=${item.flag}` as Route}
                      className="text-sm text-everhero-red hover:underline"
                    >
                      {item.count}명 보기
                    </Link>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.tone}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">주요 운용 상품 현황</p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 font-medium">상품명</th>
                  <th className="py-3 font-medium">가입자 수</th>
                  <th className="py-3 font-medium">누적 비중</th>
                  <th className="py-3 font-medium">평균 수익률</th>
                </tr>
              </thead>
              <tbody>
                {companyDiagnosis.topProducts.map((product) => (
                  <tr key={product.name} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{product.name}</td>
                    <td className="py-3 text-slate-600">{product.memberCount}명</td>
                    <td className="py-3 text-slate-600">{product.allocationSum.toFixed(0)}%</td>
                    <td className="py-3 text-slate-600">
                      {product.averageReturnRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-everhero-red">전사 인사이트</p>
          <div className="mt-5 space-y-3">
            {companyDiagnosis.insightLines.map((line) => (
              <div
                key={line}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
