"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, CategoryBadge, Pill, SectionHeader } from "@/components/ui";
import { categoryLabels } from "@/lib/mock-data";
import type { RecordCategory } from "@/lib/types";

type TimelineFilter = "all" | RecordCategory;

const timelineFilters: { label: string; value: TimelineFilter }[] = [
  { label: "전체", value: "all" },
  { label: "식사", value: "meal" },
  { label: "산책", value: "walk" },
  { label: "배변", value: "stool" },
  { label: "병원/약", value: "medical" },
  { label: "행동", value: "behavior" },
];

export default function TimelinePage() {
  const { records } = usePetLog();
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>("all");

  const filteredRecords = useMemo(() => {
    if (activeFilter === "all") {
      return records;
    }
    return records.filter((record) => record.category === activeFilter);
  }, [activeFilter, records]);

  const activeTitle = activeFilter === "all" ? "오늘 기록" : `${categoryLabels[activeFilter]} 기록`;

  return (
    <AppShell subtitle="날짜별 기록을 한눈에" title="기록 타임라인">
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-[#dfe6d9] bg-white p-3">
          <button className="h-9 w-9 rounded-full bg-[#f1f5ed] font-bold text-[#596456]">‹</button>
          <div className="text-center">
            <p className="text-xs font-semibold text-[#7c8777]">2026년 4월</p>
            <p className="text-base font-black text-[#1f2922]">4월 17일 금요일</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-[#f1f5ed] font-bold text-[#596456]">›</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {timelineFilters.map((filter) => (
            <Pill active={activeFilter === filter.value} key={filter.value} onClick={() => setActiveFilter(filter.value)}>
              {filter.label}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader title={activeTitle} />
          {filteredRecords.length > 0 ? (
            <div className="relative space-y-3 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:w-px before:bg-[#dfe8d9]">
              {filteredRecords.map((record) => (
                <Card className="relative ml-8 p-4" key={record.id}>
                  <span className="absolute -left-[38px] top-5 grid h-8 w-8 place-items-center rounded-full border-4 border-[#f8faf5] bg-[#eaf5e8] text-xs font-black text-[#16804b]" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#7a8374]">{record.time}</span>
                        <CategoryBadge category={record.category} />
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-[#1f2922]">{record.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#667262]">{record.detail}</p>
                    </div>
                    <span className="text-[#9ba597]">›</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-5 text-center">
              <h3 className="text-sm font-bold text-[#1f2922]">표시할 기록이 없습니다.</h3>
              <p className="mt-2 text-sm leading-6 text-[#667262]">
                선택한 필터에 맞는 기록이 없습니다. 다른 필터를 보거나 새 기록을 남겨보세요.
              </p>
            </Card>
          )}
        </section>
      </div>
    </AppShell>
  );
}
