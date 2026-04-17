"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

const navItems: Array<{ label: string; href?: Route; disabled?: boolean }> = [
  { label: "대시보드", href: "/" },
  { label: "직원 관리", href: "/employees" },
  { label: "진단", href: "/diagnosis" },
  { label: "컴플라이언스", href: "/compliance" },
  { label: "은퇴 시뮬레이터", href: "/simulation" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-everhero-slate px-4 py-5 text-slate-200 md:min-h-screen md:w-[200px] md:self-stretch">
      <div className="flex flex-col md:sticky md:top-0 md:h-screen">
        <div className="mb-6 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            EverHero
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            퇴직연금 관리 플랫폼 데모
          </p>
        </div>

        <nav className="grid gap-2 sm:grid-cols-3 md:grid-cols-1">
          {navItems.map((item) => {
            const isActive = item.href
              ? item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href)
              : false;

            if (item.href && !item.disabled) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-white/12 bg-white/18 text-white shadow-lg shadow-black/10 ring-1 ring-white/8"
                      : "border-transparent text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "font-semibold" : ""}>
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="cursor-not-allowed rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-slate-500"
              >
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 md:mt-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Demo Notice
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            본 데모의 상품명은 예시이며, 실제 투자 자문이 아닌 참고 정보입니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
