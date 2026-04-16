"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

const primaryNavItems: Array<{ label: string; href: Route }> = [
  { label: "대시보드", href: "/" },
  { label: "직원 관리", href: "/employees" },
  { label: "진단", href: "/diagnosis" }
];

const secondaryNavItems: Array<{ label: string; href: string }> = [
  { label: "컴플라이언스", href: "/compliance" },
  { label: "은퇴 시뮬레이터", href: "/simulation" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-everhero-slate px-4 py-5 text-slate-200 md:h-screen md:w-[200px]">
      <div className="mb-6 md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          EverHero
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">MVP Core</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          퇴직연금 포트폴리오 진단 데모
        </p>
      </div>

      <nav className="grid gap-2 sm:grid-cols-3 md:grid-cols-1">
        {primaryNavItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white/12 text-white shadow-lg shadow-black/10"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 md:mt-10">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          MVP Light
        </p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          {secondaryNavItems.map((item) => (
            <div
              key={item.href}
              className="cursor-not-allowed rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-slate-500"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 md:mt-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Demo Notice
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          본 데모의 상품명은 예시이며, 실제 투자 자문이 아닌 참고 정보입니다.
        </p>
      </div>
    </aside>
  );
}
