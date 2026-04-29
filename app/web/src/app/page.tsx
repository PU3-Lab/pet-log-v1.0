"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { AiMascot, Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { getAiCareSuggestions } from "@/lib/ai-insights";
import { getRecentChange, getRecordStatusLabel, getTodaySummary, type HomeSummaryTone } from "@/lib/home-summary";
import { getCareNotifications } from "@/lib/notifications";
import { suggestions, todos } from "@/lib/mock-data";
import { PetIcon } from "@/components/pet-icons";

const toneText: Record<HomeSummaryTone, string> = {
  green: "text-[#16804b]",
  orange: "text-[#a4651a]",
  red: "text-[#be4c3c]",
  blue: "text-[#356aa8]",
};

const toneDot: Record<HomeSummaryTone, string> = {
  green: "bg-[#16804b]",
  orange: "bg-[#d38a2d]",
  red: "bg-[#be4c3c]",
  blue: "bg-[#356aa8]",
};

const toneCard: Record<HomeSummaryTone, string> = {
  green: "border-[#d8ead1] bg-[#fbfff8]",
  orange: "border-[#f1d9af] bg-[#fffaf0]",
  red: "border-[#f0cbc5] bg-[#fff7f5]",
  blue: "border-[#d4e0f5] bg-[#f6f9ff]",
};

const chatbotQuestions: Array<{ icon: "heart" | "bell" | "syringe"; text: string }> = [
  { icon: "heart", text: "오늘 상태 괜찮아?" },
  { icon: "bell", text: "주의 알림은 왜 떴어?" },
  { icon: "syringe", text: "백신 전에 확인할 게 있어?" },
];

export default function Home() {
  const { profile, records, schedules, settings } = usePetLog();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotQuestion, setChatbotQuestion] = useState("");
  const [chatbotNotice, setChatbotNotice] = useState("");
  const latestRecords = records.slice(0, 3);
  const notifications = getCareNotifications(records, schedules, undefined, settings.notificationPreferences).slice(0, 2);
  const todaySummary = getTodaySummary(records);
  const recentChange = getRecentChange(records);
  const aiSuggestions = settings.aiInsightEnabled ? getAiCareSuggestions(records) : [];
  const homeSuggestions = settings.aiInsightEnabled ? [...aiSuggestions, ...suggestions].slice(0, 2) : [];
  const pendingSchedules = schedules.filter((schedule) => !schedule.isDone).length;

  function openChatbot() {
    setIsChatbotOpen(true);
  }

  function closeChatbot() {
    setIsChatbotOpen(false);
  }

  function selectChatbotQuestion(question: string) {
    setChatbotQuestion(question);
    setChatbotNotice("답변 기능은 준비 중입니다. 현재는 질문 UI 흐름만 확인할 수 있어요.");
  }

  function submitChatbotQuestion() {
    if (!chatbotQuestion.trim()) {
      setChatbotNotice("궁금한 내용을 입력하거나 추천 질문을 선택해주세요.");
      return;
    }
    setChatbotNotice("답변 기능은 준비 중입니다. 현재는 질문 UI 흐름만 확인할 수 있어요.");
  }

  return (
    <AppShell
      action={
        <Link
          aria-label="기록 추가"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#16804b] text-white shadow-sm"
          href="/record"
        >
          <PetIcon className="h-5 w-5" name="plus" />
        </Link>
      }
      subtitle="AI가 먼저 케어해주는 홈"
      title={`${profile.name}의 오늘`}
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-[#dfe6d9] bg-white p-4 shadow-[0_8px_24px_rgba(49,65,44,0.05)]">
          <div className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[#eaf5e5] text-xl font-black text-[#16804b]">
              {profile.photoDataUrl ? (
                <Image
                  alt={`${profile.name} 프로필 사진`}
                  className="h-full w-full object-cover"
                  height={48}
                  src={profile.photoDataUrl}
                  unoptimized
                  width={48}
                />
              ) : (
                profile.name.slice(0, 1)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-black text-[#1f2922]">{profile.name}</p>
                <span className="rounded-full bg-[#f0f3ed] px-2.5 py-1 text-[11px] font-bold text-[#5e6859]">
                  {profile.breed}
                </span>
                <span className="rounded-full bg-[#f0f3ed] px-2.5 py-1 text-[11px] font-bold text-[#5e6859]">
                  {profile.age}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-[#667262]">
                {profile.weight} · {profile.notes[0] ?? profile.personality}
              </p>
            </div>
            <Link className="rounded-full bg-[#edf8ed] px-3 py-2 text-xs font-black text-[#16804b]" href="/profile">
              보기
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-[#f4f7f0] px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">최근 기록</p>
              <p className="mt-1 text-base font-black text-[#1f2922]">{latestRecords.length}</p>
            </div>
            <div className="rounded-2xl bg-[#fffaf0] px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">오늘 알림</p>
              <p className="mt-1 text-base font-black text-[#1f2922]">{notifications.length}</p>
            </div>
            <div className="rounded-2xl bg-[#f6f9ff] px-3 py-3 text-center">
              <p className="text-[11px] font-bold text-[#778174]">일정</p>
              <p className="mt-1 text-base font-black text-[#1f2922]">{pendingSchedules}</p>
            </div>
          </div>
        </section>

        {settings.aiInsightEnabled ? (
          <Card className="bg-gradient-to-br from-white to-[#edf8ed]">
            <div className="flex gap-3">
              <AiMascot />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#16804b]">AI 질문</p>
                <h2 className="mt-1 text-lg font-bold leading-7 text-[#1f2922]">오늘 배변 상태는 어땠나요?</h2>
                <p className="mt-2 text-sm leading-6 text-[#62705f]">어제 기록이 비어 있어 변화 판단에 필요합니다.</p>
                <Link
                  className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#16804b] px-5 text-sm font-bold text-white"
                  href="/record"
                >
                  기록하기
                </Link>
              </div>
            </div>
          </Card>
        ) : null}

        <section>
          <SectionHeader
            action={
              <Link className="text-xs font-bold text-[#16804b]" href="/notifications">
                전체 보기
              </Link>
            }
            title="오늘 알림"
          />
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card className={`border-l-4 p-4 ${toneCard[notification.tone]}`} key={notification.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${toneText[notification.tone]}`}>
                      {notification.category} · {notification.dueLabel}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-[#1f2922]">{notification.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#667262]">{notification.detail}</p>
                  </div>
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[notification.tone]}`} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="오늘 요약" />
          <div className="grid grid-cols-3 gap-2">
            {todaySummary.map((item) => (
              <Card className={`p-3 text-center ${toneCard[item.tone]}`} key={item.category}>
                <p className="text-xs font-bold text-[#788276]">{item.label}</p>
                <p className="mt-2 truncate text-sm font-black text-[#1f2922]">{item.value}</p>
                <p className={`mt-1 text-[11px] font-semibold ${toneText[item.tone]}`}>{item.state}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="최근 변화" />
          <Card className={`border-l-4 p-4 ${toneCard[recentChange.tone]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-xs font-bold ${toneText[recentChange.tone]}`}>{recentChange.label}</p>
                <h3 className="mt-1 text-sm font-black text-[#1f2922]">{recentChange.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#62705f]">{recentChange.detail}</p>
              </div>
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[recentChange.tone]}`} />
            </div>
          </Card>
        </section>

        {settings.aiInsightEnabled ? (
          <section>
            <SectionHeader
              action={
                <Link className="text-xs font-bold text-[#16804b]" href="/suggestions">
                  더보기
                </Link>
              }
              title="AI 제안"
            />
            <div className="space-y-3">
              {homeSuggestions.map((suggestion) => (
                <Card className="p-4" key={suggestion.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#16804b]">{suggestion.category}</p>
                      <h3 className="mt-1 font-bold text-[#1f2922]">{suggestion.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#62705f]">{suggestion.detail}</p>
                    </div>
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#16804b]" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeader title="오늘 할 일" />
          <Card>
            <ul className="space-y-3">
              {todos.map((todo, index) => (
                <li className="flex items-center gap-3 text-sm font-semibold text-[#3d4639]" key={todo}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef5e9] text-xs text-[#16804b]">
                    {index + 1}
                  </span>
                  {todo}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeader
            action={
              <Link className="text-xs font-bold text-[#16804b]" href="/timeline">
                전체 보기
              </Link>
            }
            title="최근 기록"
          />
          <div className="space-y-3">
            {latestRecords.length > 0 ? (
              latestRecords.map((record) => (
                <Card className="p-4" key={record.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={record.category} />
                        <span className="text-xs font-semibold text-[#8a9286]">{record.time}</span>
                      </div>
                      <p className="mt-2 truncate text-sm font-bold text-[#1f2922]">{record.title}</p>
                      <p className={`mt-1 text-xs font-bold ${toneText[getRecordStatusLabel(record).tone]}`}>
                        {getRecordStatusLabel(record).label}
                      </p>
                    </div>
                    <span className="text-[#9ba597]">›</span>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-4">
                <p className="text-sm font-bold text-[#1f2922]">아직 최근 기록이 없습니다.</p>
                <p className="mt-1 text-sm leading-6 text-[#667262]">첫 기록을 저장하면 여기에 바로 표시됩니다.</p>
              </Card>
            )}
          </div>
        </section>
      </div>

      {!isChatbotOpen ? (
        <button
          aria-haspopup="dialog"
          className="absolute bottom-24 right-5 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#16804b] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(22,128,75,0.32)]"
          onClick={openChatbot}
          type="button"
        >
          <PetIcon className="h-5 w-5" name="question" />
          물어보기
        </button>
      ) : null}

      {isChatbotOpen ? (
        <div className="absolute inset-0 z-40 bg-[#1f2922]/45 backdrop-blur-[1px]" onClick={closeChatbot}>
          <section
            aria-label="보호자 질문"
            aria-modal="true"
            className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-5 pb-6 pt-3 shadow-[0_-18px_48px_rgba(31,41,34,0.2)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#d4d8d0]" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#1f2922]">무엇이 궁금하세요?</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#667262]">
                  {profile.name}의 기록을 참고해서 답변해드려요
                </p>
              </div>
              <button
                aria-label="물어보기 닫기"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f0f3ed] text-[#5e6859]"
                onClick={closeChatbot}
                type="button"
              >
                <PetIcon className="h-4 w-4" name="close" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {chatbotQuestions.map((question) => (
                <button
                  className="flex h-12 w-full items-center gap-3 rounded-full border border-[#dfe6d9] bg-[#fbfdf8] px-4 text-left text-sm font-bold text-[#40513f] shadow-[0_4px_14px_rgba(49,65,44,0.04)]"
                  key={question.text}
                  onClick={() => selectChatbotQuestion(question.text)}
                  type="button"
                >
                  <PetIcon className="h-5 w-5 shrink-0 text-[#16804b]" name={question.icon} />
                  <span className="min-w-0 truncate">{question.text}</span>
                </button>
              ))}
            </div>

            {chatbotNotice ? (
              <p className="mt-4 rounded-2xl bg-[#edf8ed] px-4 py-3 text-xs font-bold leading-5 text-[#16804b]">{chatbotNotice}</p>
            ) : null}

            <div className="mt-5 flex items-center gap-2 rounded-full border border-[#dfe6d9] bg-white px-4 py-2 shadow-sm">
              <input
                className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#263022] outline-none placeholder:text-[#9aa494]"
                onChange={(event) => {
                  setChatbotQuestion(event.target.value);
                  if (chatbotNotice) {
                    setChatbotNotice("");
                  }
                }}
                placeholder={`${profile.name}에 대해 궁금한 걸 물어보세요`}
                value={chatbotQuestion}
              />
              <button
                aria-label="질문 보내기"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#16804b] text-white"
                onClick={submitChatbotQuestion}
                type="button"
              >
                <PetIcon className="h-5 w-5" name="send" />
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
