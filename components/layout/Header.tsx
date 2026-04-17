import { getCompanyProfile } from "@/lib/data";

export async function Header() {
  const companyProfile = await getCompanyProfile();

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 bg-white/70 px-8 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-everhero-red">DC형 퇴직연금 관리 플랫폼</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">{companyProfile.name}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white">
          {companyProfile.industry}
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
          임직원 {companyProfile.employeeCount}명
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
          {companyProfile.pensionType}
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
          수탁사 {companyProfile.provider}
        </div>
      </div>
    </header>
  );
}
