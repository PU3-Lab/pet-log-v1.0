import { AppShell } from "@/components/app-shell";
import { Card, MiniLineChart, Pill, SectionHeader } from "@/components/ui";
import { metrics } from "@/lib/mock-data";

export default function AnalysisPage() {
  return (
    <AppShell subtitle="데이터를 분석하고 해석해요" title="분석 리포트">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <Pill active>주간 리포트</Pill>
          <Pill>월간 리포트</Pill>
        </div>

        <Card className="bg-gradient-to-br from-white to-[#f2f8ec]">
          <p className="text-sm font-bold text-[#16804b]">4월 15일 - 4월 21일</p>
          <h2 className="mt-2 text-lg font-black text-[#1f2922]">이번 주 요약</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["식사", "평균 양호", "+5%"],
              ["활동량", "평균 보통", "-10%"],
              ["배변", "평균 양호", "유지"],
              ["수면", "평균 양호", "+8%"],
            ].map(([label, value, trend]) => (
              <div className="rounded-2xl border border-[#e0e8d9] bg-white/80 p-3" key={label}>
                <p className="text-xs font-bold text-[#7b8576]">{label}</p>
                <p className="mt-1 text-sm font-black text-[#1f2922]">{value}</p>
                <p className="mt-1 text-xs font-bold text-[#16804b]">{trend}</p>
              </div>
            ))}
          </div>
        </Card>

        <section>
          <SectionHeader title="변화 추이" />
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <Card key={metric.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#1f2922]">{metric.label}</h3>
                    <p className="text-xs font-semibold text-[#7b8576]">{metric.trend}</p>
                  </div>
                  <span className="rounded-full bg-[#eef5e9] px-3 py-1 text-xs font-bold text-[#16804b]">
                    {metric.unit}
                  </span>
                </div>
                <MiniLineChart tone={index === 1 ? "#df8f24" : "#16804b"} values={metric.values} />
              </Card>
            ))}
          </div>
        </section>

        <Card>
          <p className="text-sm font-bold text-[#16804b]">AI 분석 결과</p>
          <h2 className="mt-2 text-base font-black text-[#1f2922]">최근 활동량이 감소했습니다</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">
            식사와 배변은 안정적이지만 산책 시간이 줄어든 흐름이 보입니다. 짧은 산책을 하루 2회로 나누면
            부담을 줄이면서 활동 리듬을 회복할 수 있어요.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
