"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

interface DiagnosisTabsProps {
  activeTab: "personal" | "company";
}

const tabs = [
  { value: "personal", label: "개인 진단" },
  { value: "company", label: "전사 진단" }
] as const;

export function DiagnosisTabs({ activeTab }: DiagnosisTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: "personal" | "company") => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "personal") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    const query = params.toString();
    router.push((query ? `${pathname}?${query}` : pathname) as Route);
  };

  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
