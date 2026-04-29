"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { structureRecord } from "@/lib/ai-insights";
import { categoryLabels } from "@/lib/mock-data";
import { getInputModeFeedback, type RecordInputMode } from "@/lib/record-input";
import type { RecordCategory } from "@/lib/types";

const categoryOptions: { label: string; value: RecordCategory }[] = [
  { label: "식사", value: "meal" },
  { label: "산책", value: "walk" },
  { label: "배변", value: "stool" },
  { label: "병원/약", value: "medical" },
  { label: "행동", value: "behavior" },
];

const inputModes: { label: string; value: RecordInputMode }[] = [
  { label: "텍스트", value: "text" },
  { label: "음성", value: "voice" },
  { label: "사진", value: "photo" },
];

const inputPlaceholders: Record<RecordInputMode, string> = {
  text: "예: 아침 사료 50g을 먹고 산책 20분을 했어요.",
  voice: "음성으로 남길 내용을 확인하거나 직접 수정해주세요.",
  photo: "사진과 함께 남길 메모를 입력해주세요.",
};

const defaultDetail = "오늘 아침에 50g 사료 먹고, 간식 조금 줬어. 낮에 산책 20분 했고 밤에 배변 1번 했어.";
const maxLength = 500;

export default function RecordPage() {
  const { addRecord, records } = usePetLog();
  const [detail, setDetail] = useState(defaultDetail);
  const [category, setCategory] = useState<RecordCategory>("meal");
  const [inputMode, setInputMode] = useState<RecordInputMode>("text");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const preview = records.slice(0, 3);
  const trimmedDetail = detail.trim();
  const isInvalid = trimmedDetail.length < 5 || trimmedDetail.length > maxLength;
  const aiPreview = useMemo(() => structureRecord(trimmedDetail, category), [category, trimmedDetail]);
  const confidencePercent = Math.round(aiPreview.confidence * 100);
  const modeFeedback = getInputModeFeedback(inputMode);

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
    <AppShell
      bottomAction={
        <button
          className={`h-12 w-full rounded-2xl text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)] ${
            isInvalid ? "bg-[#8ab99f]" : "bg-[#16804b]"
          }`}
          onClick={handleSave}
          type="button"
        >
          기록 저장하기
        </button>
      }
      subtitle="자연어로 쉽고 빠르게 기록"
      title="기록 입력"
    >
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#edf8ed]">
          <p className="text-sm font-bold text-[#16804b]">기록 준비</p>
          <h2 className="mt-1 text-lg font-black text-[#1f2922]">오늘 케어 내용을 한 번에 정리해요</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">분류</p>
              <p className="mt-1 truncate text-sm font-black text-[#1f2922]">{categoryLabels[category]}</p>
            </div>
            <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">AI 신뢰도</p>
              <p className="mt-1 text-sm font-black text-[#1f2922]">{confidencePercent}%</p>
            </div>
            <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">입력</p>
              <p className="mt-1 text-sm font-black text-[#1f2922]">{detail.length}/{maxLength}</p>
            </div>
          </div>
        </Card>

        <section>
          <SectionHeader title="빠른 입력" />
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map((item) => {
              const active = item.value === category;
              return (
                <button
                  aria-pressed={active}
                  className={`min-h-12 rounded-2xl border px-3 text-left text-sm font-bold transition ${
                    active
                      ? "border-[#16804b] bg-[#16804b] text-white"
                      : "border-[#dfe6d9] bg-white text-[#4a5547] shadow-[0_8px_22px_rgba(49,65,44,0.05)]"
                  }`}
                  key={item.label}
                  onClick={() => setCategory(item.value)}
                  type="button"
                >
                  <span className="block">{item.label}</span>
                  <span className={`mt-1 block text-[11px] font-semibold ${active ? "text-white/80" : "text-[#7c8777]"}`}>
                    {item.value === "meal"
                      ? "먹은 양"
                      : item.value === "walk"
                        ? "시간/거리"
                        : item.value === "stool"
                          ? "횟수/상태"
                          : item.value === "medical"
                            ? "약/진료"
                            : "감정/반응"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <Card>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1f2922]">입력 방식</h2>
              <p className="mt-1 text-xs font-semibold text-[#7c8777]">현재 저장은 텍스트 메모 기준으로 동작합니다.</p>
            </div>
            <CategoryBadge category={category} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {inputModes.map((mode) => {
              const active = inputMode === mode.value;
              const feedback = getInputModeFeedback(mode.value);
              return (
                <button
                  aria-pressed={active}
                  className={`min-h-14 rounded-xl border px-2 text-sm font-bold ${
                    active ? "border-[#16804b] bg-[#e7f4eb] text-[#0b7a43]" : "border-[#dce5d5] bg-white text-[#40513f]"
                  }`}
                  key={mode.value}
                  onClick={() => setInputMode(mode.value)}
                  type="button"
                >
                  <span className="block">{mode.label}</span>
                  <span className="mt-1 block text-[11px] font-semibold opacity-80">{feedback.label}</span>
                </button>
              );
            })}
          </div>
          <div
            className={`mt-3 rounded-2xl px-4 py-3 ${
              modeFeedback.status === "available" ? "bg-[#edf8ed] text-[#356342]" : "bg-[#fff7ed] text-[#7a5531]"
            }`}
          >
            <p className="text-xs font-bold">{modeFeedback.label}</p>
            <p className="mt-1 text-xs leading-5">{modeFeedback.detail}</p>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">자연어 기록</h2>
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
            placeholder={inputPlaceholders[inputMode]}
            value={detail}
          />
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
          <SectionHeader title="AI 구조화 미리보기" />
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={aiPreview.suggestedCategory} />
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${aiPreview.needsConfirmation ? "bg-[#fff2df] text-[#a4651a]" : "bg-[#e8f5df] text-[#32783c]"}`}>
                      신뢰도 {confidencePercent}%
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-[#1f2922]">{aiPreview.normalizedSummary || previewTitle}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#6c7667]">
                    {aiPreview.needsConfirmation
                      ? "AI 분류가 애매합니다. 카테고리와 내용을 확인한 뒤 저장해주세요."
                      : "입력한 내용이 구조화되어 저장됩니다. 필요하면 저장 전 수정할 수 있습니다."}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#16804b]">{categoryLabels[aiPreview.suggestedCategory]}</span>
              </div>
              {aiPreview.suggestedCategory !== category ? (
                <button
                  className="mt-3 h-10 w-full rounded-xl border border-[#cfe2cd] bg-[#f4faf2] text-sm font-bold text-[#16804b]"
                  onClick={() => setCategory(aiPreview.suggestedCategory)}
                  type="button"
                >
                  AI 추천 분류 적용
                </button>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {aiPreview.measurements.length > 0 ? (
                  aiPreview.measurements.map((measurement) => (
                    <div className="rounded-xl bg-[#f4f7f0] px-3 py-2" key={`${measurement.label}-${measurement.value}`}>
                      <p className="text-[11px] font-bold text-[#7b8576]">{measurement.label}</p>
                      <p className="mt-1 text-sm font-black text-[#1f2922]">{measurement.value}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 rounded-xl bg-[#f4f7f0] px-3 py-2">
                    <p className="text-xs font-semibold leading-5 text-[#667262]">추출된 수치가 없습니다. 필요하면 g, kg, 분, 회 같은 단위를 함께 적어주세요.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeader title="최근 기록" />
          <div className="space-y-2">
            {preview.map((record) => (
              <Card className="p-3" key={record.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CategoryBadge category={record.category} />
                    <h3 className="mt-2 truncate text-sm font-bold text-[#1f2922]">{record.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6c7667]">{record.detail}</p>
                  </div>
                  <span className="text-xs font-bold text-[#8a9286]">{record.time}</span>
                </div>
              </Card>
            ))}
            {preview.length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-sm font-bold text-[#1f2922]">아직 최근 기록이 없습니다.</p>
                <p className="mt-1 text-xs leading-5 text-[#667262]">첫 기록을 저장하면 여기에 바로 표시됩니다.</p>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
