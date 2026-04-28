import { AppShell } from "@/components/app-shell";
import { Card, CategoryBadge, Pill, SectionHeader } from "@/components/ui";
import { records } from "@/lib/mock-data";

export default function TimelinePage() {
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
          {["전체", "식사", "활동", "배변", "병원"].map((filter, index) => (
            <Pill active={index === 0} key={filter}>
              {filter}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader title="오늘 기록" />
          <div className="relative space-y-3 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:w-px before:bg-[#dfe8d9]">
            {records.map((record) => (
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
        </section>
      </div>
    </AppShell>
  );
}
