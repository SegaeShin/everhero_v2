"use client";

import { useEffect, useState } from "react";

interface AICommentProps {
  content: string;
}

function MarkdownBlock({ content }: { content: string }) {
  const sections = content.split("\n");

  return (
    <div className="space-y-3 text-sm leading-7 text-slate-700">
      {sections.map((line, index) => {
        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }

        if (line.startsWith("## ")) {
          return (
            <h4 key={index} className="pt-2 text-lg font-semibold text-slate-900">
              {line.replace("## ", "")}
            </h4>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <p key={index} className="pl-4 text-slate-700">
              • {line.replace("- ", "")}
            </p>
          );
        }

        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

export function AIComment({ content }: AICommentProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");

    let currentIndex = 0;
    const timer = window.setInterval(() => {
      currentIndex += 6;
      setDisplayed(content.slice(0, currentIndex));

      if (currentIndex >= content.length) {
        window.clearInterval(timer);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [content]);

  return (
    <section className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-everhero-red">AI 진단 코멘트</p>
          <p className="mt-1 text-sm text-slate-500">
            API 연동 전 단계용 로컬 생성 코멘트입니다.
          </p>
        </div>
        {displayed.length < content.length ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            AI 진단 생성 중...
          </span>
        ) : null}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <MarkdownBlock content={displayed || "AI 진단 생성 중..."} />
      </div>
    </section>
  );
}
