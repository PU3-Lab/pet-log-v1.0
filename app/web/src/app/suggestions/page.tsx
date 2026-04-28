import { AppShell } from "@/components/app-shell";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { suggestions } from "@/lib/mock-data";

const toneClasses = {
  green: "bg-[#edf8ed] text-[#16804b]",
  orange: "bg-[#fff2df] text-[#bb721e]",
  blue: "bg-[#eaf2ff] text-[#2e67a7]",
};

export default function SuggestionsPage() {
  return (
    <AppShell subtitle="맞춤형 행동 개선 가이드" title="제안">
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["전체", "행동", "건강", "생활"].map((filter, index) => (
            <Pill active={index === 0} key={filter}>
              {filter}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader title="오늘의 제안" />
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <div className="flex gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${toneClasses[suggestion.tone]}`}>
                    {suggestion.category}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black text-[#1f2922]">{suggestion.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#667262]">{suggestion.detail}</p>
                    <button className="mt-4 h-10 w-full rounded-xl bg-[#16804b] text-sm font-bold text-white">
                      {suggestion.action}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
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
