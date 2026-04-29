"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { categoryLabels } from "@/lib/mock-data";
import type { RecordCategory } from "@/lib/types";

const categoryOptions: { label: string; value: RecordCategory }[] = [
  { label: "식사", value: "meal" },
  { label: "산책", value: "walk" },
  { label: "배변", value: "stool" },
  { label: "병원/약", value: "medical" },
  { label: "행동", value: "behavior" },
];

const defaultDetail = "오늘 아침에 50g 사료 먹고, 간식 조금 줬어. 낮에 산책 20분 했고 밤에 배변 1번 했어.";
const maxLength = 500;

export default function RecordPage() {
  const { addRecord, records } = usePetLog();
  const [detail, setDetail] = useState(defaultDetail);
  const [category, setCategory] = useState<RecordCategory>("meal");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const preview = records.slice(0, 3);
  const trimmedDetail = detail.trim();
  const isInvalid = trimmedDetail.length < 5 || trimmedDetail.length > maxLength;

  const previewTitle = useMemo(() => {
    if (!trimmedDetail) {
      return "기록 내용을 입력하면 미리보기가 생성됩니다.";
    }
    return trimmedDetail.length > 28 ? `${trimmedDetail.slice(0, 28)}...` : trimmedDetail;
  }, [trimmedDetail]);

  function handleSave() {
    if (!trimmedDetail) {
      setError("기록 내용을 입력해주세요.");
      setSavedId(null);
      return;
    }

    if (trimmedDetail.length < 5) {
      setError("기록은 5자 이상 입력해주세요.");
      setSavedId(null);
      return;
    }

    if (trimmedDetail.length > maxLength) {
      setError(`기록은 ${maxLength}자 이내로 입력해주세요.`);
      setSavedId(null);
      return;
    }

    const record = addRecord({ category, detail: trimmedDetail });
    setSavedId(record.id);
    setError("");
    setDetail("");
  }

  return (
    <AppShell subtitle="자연어로 쉽고 빠르게 기록" title="기록 입력">
      <div className="space-y-5">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">오늘 기록</h2>
            <span className={`text-xs font-semibold ${detail.length > maxLength ? "text-[#be4c3c]" : "text-[#9aa494]"}`}>
              {detail.length}/{maxLength}
            </span>
          </div>
          <textarea
            className="min-h-40 w-full resize-none rounded-2xl border border-[#dde6d6] bg-[#fbfcfa] p-4 text-sm leading-6 outline-none placeholder:text-[#8a9286] focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
            maxLength={maxLength + 40}
            onChange={(event) => {
              setDetail(event.target.value);
              if (error) {
                setError("");
              }
              if (savedId) {
                setSavedId(null);
              }
            }}
            placeholder="예: 아침 사료 50g을 먹고 산책 20분을 했어요."
            value={detail}
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["텍스트", "음성", "사진"].map((item, index) => (
              <button
                className={`h-10 rounded-xl border text-sm font-bold ${
                  index === 0 ? "border-[#16804b] bg-[#e7f4eb] text-[#0b7a43]" : "border-[#dce5d5] bg-white text-[#40513f]"
                }`}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          {error ? <p className="mt-3 text-sm font-semibold text-[#be4c3c]">{error}</p> : null}
          {savedId ? (
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#edf8ed] px-4 py-3 text-sm">
              <span className="font-bold text-[#16804b]">기록이 저장되었습니다.</span>
              <Link className="font-bold text-[#0f6e3e]" href="/timeline">
                타임라인 보기
              </Link>
            </div>
          ) : null}
        </Card>

        <section>
          <SectionHeader title="자동 분류 미리보기" />
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CategoryBadge category={category} />
                  <h3 className="mt-2 text-sm font-bold text-[#1f2922]">{previewTitle}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#6c7667]">
                    {trimmedDetail || "입력한 내용을 저장하면 타임라인에 같은 내용으로 추가됩니다."}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#16804b]">{categoryLabels[category]}</span>
              </div>
            </Card>
            {preview.map((record) => (
              <Card className="p-4" key={record.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CategoryBadge category={record.category} />
                    <h3 className="mt-2 text-sm font-bold text-[#1f2922]">{record.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#6c7667]">{record.detail}</p>
                  </div>
                  <span className="text-xs font-bold text-[#8a9286]">{record.time}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="빠른 입력" />
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((item) => {
              const active = item.value === category;
              return (
                <button
                  className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold ${
                    active ? "bg-[#16804b] text-white" : "bg-[#f0f3ed] text-[#616b5d]"
                  }`}
                  key={item.label}
                  onClick={() => setCategory(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <button
          className={`h-12 w-full rounded-2xl text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)] ${
            isInvalid ? "bg-[#8ab99f]" : "bg-[#16804b]"
          }`}
          onClick={handleSave}
          type="button"
        >
          기록 저장하기
        </button>
      </div>
    </AppShell>
  );
}
