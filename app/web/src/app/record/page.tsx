import { AppShell } from "@/components/app-shell";
import { Card, CategoryBadge, Pill, SectionHeader } from "@/components/ui";
import { records } from "@/lib/mock-data";

export default function RecordPage() {
  const preview = records.slice(0, 3);

  return (
    <AppShell subtitle="자연어로 쉽고 빠르게 기록" title="기록 입력">
      <div className="space-y-5">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">오늘 기록</h2>
            <span className="text-xs font-semibold text-[#9aa494]">61/500</span>
          </div>
          <textarea
            className="min-h-40 w-full resize-none rounded-2xl border border-[#dde6d6] bg-[#fbfcfa] p-4 text-sm leading-6 outline-none placeholder:text-[#8a9286] focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
            defaultValue="오늘 아침에 50g 사료 먹고, 간식 조금 줬어. 낮에 산책 20분 했고 밤에 배변 1번 했어."
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button className="h-10 rounded-xl border border-[#dce5d5] bg-white text-sm font-bold text-[#40513f]">텍스트</button>
            <button className="h-10 rounded-xl border border-[#dce5d5] bg-white text-sm font-bold text-[#40513f]">음성</button>
            <button className="h-10 rounded-xl border border-[#dce5d5] bg-white text-sm font-bold text-[#40513f]">사진</button>
          </div>
        </Card>

        <section>
          <SectionHeader title="자동 분류 미리보기" />
          <div className="space-y-3">
            {preview.map((record) => (
              <Card className="p-4" key={record.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CategoryBadge category={record.category} />
                    <h3 className="mt-2 text-sm font-bold text-[#1f2922]">{record.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#6c7667]">{record.detail}</p>
                  </div>
                  <button className="text-sm font-bold text-[#16804b]">수정</button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="빠른 입력" />
          <div className="flex flex-wrap gap-2">
            {["식사", "산책", "배변", "약 복용", "병원", "행동"].map((item, index) => (
              <Pill active={index === 0} key={item}>
                {item}
              </Pill>
            ))}
          </div>
        </section>

        <button className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]">
          기록 저장하기
        </button>
      </div>
    </AppShell>
  );
}
