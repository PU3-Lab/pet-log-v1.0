"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { getAiCareSuggestions } from "@/lib/ai-insights";
import { suggestions } from "@/lib/mock-data";
import type { SuggestionCategory } from "@/lib/types";

type SuggestionFilter = "전체" | SuggestionCategory;

const toneClasses = {
  green: "bg-[#edf8ed] text-[#16804b]",
  orange: "bg-[#fff2df] text-[#bb721e]",
  blue: "bg-[#eaf2ff] text-[#2e67a7]",
};

const suggestionFilters: SuggestionFilter[] = ["전체", "행동", "건강", "생활"];

export default function SuggestionsPage() {
  const { records } = usePetLog();
  const [activeFilter, setActiveFilter] = useState<SuggestionFilter>("전체");
  const aiSuggestions = useMemo(() => getAiCareSuggestions(records), [records]);
  const allSuggestions = useMemo(() => [...aiSuggestions, ...suggestions], [aiSuggestions]);
  const filteredSuggestions = useMemo(() => {
    if (activeFilter === "전체") {
      return allSuggestions;
    }
    return allSuggestions.filter((suggestion) => suggestion.category === activeFilter);
  }, [activeFilter, allSuggestions]);

  return (
    <AppShell subtitle="맞춤형 행동 개선 가이드" title="제안">
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {suggestionFilters.map((filter) => (
            <Pill active={activeFilter === filter} key={filter} onClick={() => setActiveFilter(filter)}>
              {filter}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader title="오늘의 제안" />
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <div className="flex gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${toneClasses[suggestion.tone]}`}>
                    {suggestion.category}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black text-[#1f2922]">{suggestion.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#667262]">{suggestion.detail}</p>
                    <Link
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#16804b] text-sm font-bold text-white"
                      href={suggestion.actionHref}
                    >
                      {suggestion.action}
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
            {filteredSuggestions.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">표시할 제안이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">다른 카테고리를 선택해보세요.</p>
              </Card>
            ) : null}
          </div>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">안전 안내</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">
            반복되는 이상 증상이나 급격한 컨디션 변화는 기록을 모아 병원 상담을 권장합니다.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
