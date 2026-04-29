"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, MiniLineChart, Pill, SectionHeader } from "@/components/ui";
import { getAiInsights } from "@/lib/ai-insights";
import { metrics } from "@/lib/mock-data";
import type { MetricSeries } from "@/lib/types";

type ReportRange = "weekly" | "monthly";
type MetricFilter = "all" | MetricSeries["id"];

const reportRanges: { label: string; value: ReportRange }[] = [
  { label: "주간 리포트", value: "weekly" },
  { label: "월간 리포트", value: "monthly" },
];

const reportSummaries: Record<ReportRange, { period: string; title: string; items: [string, string, string][]; insight: string }> = {
  weekly: {
    period: "4월 15일 - 4월 21일",
    title: "이번 주 요약",
    items: [
      ["식사", "평균 양호", "+5%"],
      ["활동량", "평균 보통", "-10%"],
      ["배변", "평균 양호", "유지"],
      ["수면", "평균 양호", "+8%"],
    ],
    insight: "식사와 배변은 안정적이지만 산책 시간이 줄어든 흐름이 보입니다.",
  },
  monthly: {
    period: "2026년 4월",
    title: "이번 달 요약",
    items: [
      ["식사", "규칙적", "안정"],
      ["활동량", "조금 감소", "-6%"],
      ["배변", "정상 범위", "유지"],
      ["체중", "완만한 증가", "+0.2kg"],
    ],
    insight: "한 달 기준으로 체중이 완만하게 늘고 있어 급여량과 간식 빈도를 함께 보는 것이 좋습니다.",
  },
};

export default function AnalysisPage() {
  const { records } = usePetLog();
  const [activeRange, setActiveRange] = useState<ReportRange>("weekly");
  const [activeMetric, setActiveMetric] = useState<MetricFilter>("all");

  const summary = reportSummaries[activeRange];
  const aiInsights = useMemo(() => getAiInsights(records), [records]);
  const visibleMetrics = useMemo(() => {
    if (activeMetric === "all") {
      return metrics;
    }
    return metrics.filter((metric) => metric.id === activeMetric);
  }, [activeMetric]);

  return (
    <AppShell subtitle="데이터를 분석하고 해석해요" title="분석 리포트">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {reportRanges.map((range) => (
            <Pill active={activeRange === range.value} className="w-full" key={range.value} onClick={() => setActiveRange(range.value)}>
              {range.label}
            </Pill>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-white to-[#f2f8ec]">
          <p className="text-sm font-bold text-[#16804b]">{summary.period}</p>
          <h2 className="mt-2 text-lg font-black text-[#1f2922]">{summary.title}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {summary.items.map(([label, value, trend]) => (
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
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            <Pill active={activeMetric === "all"} onClick={() => setActiveMetric("all")}>
              전체
            </Pill>
            {metrics.map((metric) => (
              <Pill active={activeMetric === metric.id} key={metric.id} onClick={() => setActiveMetric(metric.id)}>
                {metric.label}
              </Pill>
            ))}
          </div>
          <div className="space-y-3">
            {visibleMetrics.map((metric) => (
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
                <MiniLineChart tone={metric.id === "activity" ? "#df8f24" : "#16804b"} values={metric.values} />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="AI 분석 결과" />
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <p
                  className={`text-sm font-bold ${
                    insight.tone === "red" ? "text-[#be4c3c]" : insight.tone === "orange" ? "text-[#bb721e]" : "text-[#16804b]"
                  }`}
                >
                  {insight.tone === "red" ? "주의" : insight.tone === "orange" ? "확인 필요" : "안정"}
                </p>
                <h2 className="mt-2 text-base font-black text-[#1f2922]">{insight.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">{insight.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">안전 안내</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">
            AI 분석은 저장된 기록을 바탕으로 한 참고 정보입니다. 확정 진단이 아니며, 증상이 지속되거나 심하면 병원 상담을 권장합니다.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
