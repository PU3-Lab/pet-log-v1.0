"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, MiniLineChart, Pill, SectionHeader } from "@/components/ui";
import { getAiInsights } from "@/lib/ai-insights";
import { getAnalysisMetrics, getAnalysisReport, getVetBrief, type AnalysisMetric, type AnalysisRange, type AnalysisTone } from "@/lib/analysis-summary";

type MetricFilter = "all" | AnalysisMetric["id"];

const reportRanges: { label: string; value: AnalysisRange }[] = [
  { label: "주간 리포트", value: "weekly" },
  { label: "월간 리포트", value: "monthly" },
];

const toneText: Record<AnalysisTone, string> = {
  green: "text-[#16804b]",
  orange: "text-[#bb721e]",
  red: "text-[#be4c3c]",
  blue: "text-[#356aa8]",
};

const toneCard: Record<AnalysisTone, string> = {
  green: "border-[#d8ead1] bg-[#fbfff8]",
  orange: "border-[#f1d9af] bg-[#fffaf0]",
  red: "border-[#f0cbc5] bg-[#fff7f5]",
  blue: "border-[#d4e0f5] bg-[#f6f9ff]",
};

const chartTone: Record<AnalysisTone, string> = {
  green: "#16804b",
  orange: "#df8f24",
  red: "#be4c3c",
  blue: "#356aa8",
};

export default function AnalysisPage() {
  const { records } = usePetLog();
  const [activeRange, setActiveRange] = useState<AnalysisRange>("weekly");
  const [activeMetric, setActiveMetric] = useState<MetricFilter>("all");

  const summary = useMemo(() => getAnalysisReport(records, activeRange), [activeRange, records]);
  const aiInsights = useMemo(() => getAiInsights(records), [records]);
  const metrics = useMemo(() => getAnalysisMetrics(records), [records]);
  const vetBrief = useMemo(() => getVetBrief(records), [records]);
  const visibleMetrics = useMemo(() => {
    if (activeMetric === "all") {
      return metrics;
    }
    return metrics.filter((metric) => metric.id === activeMetric);
  }, [activeMetric, metrics]);

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
            {summary.cards.map((card) => (
              <div className={`rounded-2xl border p-3 ${toneCard[card.tone]}`} key={card.id}>
                <p className="text-xs font-bold text-[#7b8576]">{card.label}</p>
                <p className="mt-1 text-sm font-black text-[#1f2922]">{card.value}</p>
                <p className={`mt-1 text-xs font-bold ${toneText[card.tone]}`}>{card.trend}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[#596554]">{summary.insight}</p>
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
              <Card className={toneCard[metric.tone]} key={metric.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#1f2922]">{metric.label}</h3>
                    <p className="text-xs font-semibold text-[#7b8576]">{metric.trend}</p>
                  </div>
                  <span className={`rounded-full bg-white/75 px-3 py-1 text-xs font-bold ${toneText[metric.tone]}`}>
                    {metric.unit}
                  </span>
                </div>
                <MiniLineChart tone={chartTone[metric.tone]} values={metric.values} />
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

        <section>
          <SectionHeader title="병원 제출용 요약" />
          <Card>
            <p className="text-sm font-bold text-[#16804b]">{vetBrief.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#667262]">{vetBrief.detail}</p>
            <ul className="mt-4 space-y-2">
              {vetBrief.items.map((item) => (
                <li className="rounded-xl bg-[#f4f7f0] px-3 py-2 text-xs font-semibold leading-5 text-[#3d4639]" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
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
