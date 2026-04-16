import { employees } from "@/lib/mock-data";

export default function DiagnosisPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <section className="card">
        <p className="text-sm font-semibold text-everhero-red">개인 진단</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-900">Phase 1 준비 완료</h3>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Phase 2 이후 점수 계산과 AI 진단이 들어갈 영역입니다. 현재는 직원 선택용
          기초 데이터가 연결되어 있습니다.
        </p>
      </section>

      <section className="card">
        <p className="text-sm text-slate-500">진단 대상 직원 프리셋</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <div key={employee.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">{employee.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {employee.department} · {employee.birthYear}년생
              </p>
              <p className="mt-3 text-sm text-slate-600">
                수익률 {employee.returnRate.toFixed(1)}% · 상품 {employee.portfolio.length}개
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
