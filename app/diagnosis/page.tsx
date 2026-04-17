import { AIComment } from "@/components/diagnosis/AIComment";
import { CompanyDiagnosisPanel } from "@/components/diagnosis/CompanyDiagnosisPanel";
import { DiagnosisTabs } from "@/components/diagnosis/DiagnosisTabs";
import { EmployeeSelector } from "@/components/diagnosis/EmployeeSelector";
import { RuleResults } from "@/components/diagnosis/RuleResults";
import { ScoreCard } from "@/components/diagnosis/ScoreCard";
import { getEmployees } from "@/lib/data";
import { diagnoseEmployee } from "@/lib/diagnosis-rules";
import { formatAmount } from "@/lib/format";

interface DiagnosisPageProps {
  searchParams?: {
    employeeId?: string;
    tab?: string;
  };
}

export default async function DiagnosisPage({ searchParams }: DiagnosisPageProps) {
  const employees = await getEmployees();
  const activeTab = searchParams?.tab === "company" ? "company" : "personal";
  const selectedEmployee =
    employees.find((employee) => employee.id === searchParams?.employeeId) ?? employees[0];
  const diagnosis = diagnoseEmployee(selectedEmployee);

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-everhero-red">진단</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              {activeTab === "personal" ? "직원별 포트폴리오 룰 기반 진단" : "전사 포트폴리오 현황 진단"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              개인 진단과 전사 진단을 같은 흐름 안에서 전환해 확인할 수 있습니다.
            </p>
          </div>

          <div className="border-t border-slate-200/80 pt-5">
            <DiagnosisTabs activeTab={activeTab} />

            {activeTab === "personal" ? (
              <div className="mt-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[minmax(0,360px)_1fr] md:items-end">
                <div className="min-w-0">
                  <EmployeeSelector
                    employees={employees}
                    selectedEmployeeId={selectedEmployee.id}
                  />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Current Focus
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {selectedEmployee.name} 포트폴리오 진단
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEmployee.department} · 위험 플래그 {selectedEmployee.riskFlags.length}개
                    · 수익률 {selectedEmployee.returnRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Company Scope
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  전사 위험 분포와 운용 현황을 한 번에 점검
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  벤치마크 비교, 위험 플래그 현황, 주요 운용 상품, 전사 인사이트를 같은 기준으로
                  확인합니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {activeTab === "personal" ? (
        <>
          <section className="card">
            <div className="mt-1 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  이름
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedEmployee.name}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  부서
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {selectedEmployee.department}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  적립금
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatAmount(selectedEmployee.balance)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  수익률
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {selectedEmployee.returnRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <ScoreCard score={diagnosis.overallScore} />
            <RuleResults rules={diagnosis.ruleDetails} />
          </section>

          <AIComment content={diagnosis.aiComment} />
        </>
      ) : (
        <CompanyDiagnosisPanel employees={employees} />
      )}
    </div>
  );
}
