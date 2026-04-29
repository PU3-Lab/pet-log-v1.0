"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { getHospitalConnectSummary } from "@/lib/expansion-features";

export default function HospitalPage() {
  const { profile, records } = usePetLog();
  const [symptomMemo, setSymptomMemo] = useState("");
  const summary = useMemo(() => getHospitalConnectSummary(profile, records, symptomMemo), [profile, records, symptomMemo]);

  return (
    <AppShell subtitle="상담 전 기록을 정리해요" title="병원 연계">
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#eaf2ff]">
          <p className="text-sm font-bold text-[#2e67a7]">방문 준비</p>
          <h2 className="mt-1 text-xl font-black text-[#1f2922]">{summary.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">{summary.detail}</p>
        </Card>

        <section>
          <SectionHeader title="증상 및 변화 메모" />
          <Card>
            <label className="block">
              <span className="text-xs font-bold text-[#778174]">병원에 말할 내용을 정리하세요</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-none rounded-xl border border-[#dde6d6] bg-white p-3 text-sm leading-6 text-[#263022] outline-none focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
                onChange={(event) => setSymptomMemo(event.target.value)}
                placeholder="예: 어제부터 산책 중 자주 멈추고 현관 앞에서 기다리는 시간이 길어졌어요."
                value={symptomMemo}
              />
            </label>
            <p className="mt-3 text-xs font-semibold leading-5 text-[#778174]">입력한 메모는 아래 리포트 미리보기에 바로 반영됩니다.</p>
          </Card>
        </section>

        <section>
          <SectionHeader title="최근 주의 기록" />
          <div className="space-y-3">
            {summary.warningRecords.map((record) => (
              <Card className="p-4" key={record.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={record.category} />
                  <span className="rounded-full bg-[#fff2df] px-2.5 py-1 text-xs font-bold text-[#bb721e]">
                    {record.status === "alert" ? "주의" : "확인 필요"}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-black text-[#1f2922]">{record.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#667262]">
                  {record.date} · {record.time}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667262]">{record.detail}</p>
              </Card>
            ))}
            {summary.warningRecords.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">주의 기록이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">기록이 쌓이면 상담 준비용 변화 기록을 자동으로 모읍니다.</p>
              </Card>
            ) : null}
          </div>
        </section>

        <section>
          <SectionHeader title="병원 제출용 리포트" />
          <Card>
            <ul className="space-y-2">
              {summary.reportPreview.map((item) => (
                <li className="rounded-xl bg-[#f4f7f0] px-3 py-2 text-xs font-semibold leading-5 text-[#3d4639]" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeader title="방문 전 체크" />
          <Card>
            <div className="grid grid-cols-2 gap-2">
              {summary.checklist.map((item) => (
                <div className="rounded-xl bg-[#f8faf5] px-3 py-3 text-xs font-bold leading-5 text-[#3d4639]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">공유 전 확인</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">{summary.shareNotice}</p>
        </Card>
      </div>
    </AppShell>
  );
}
