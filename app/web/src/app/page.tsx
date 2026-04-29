"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { AiMascot, Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { getCareNotifications } from "@/lib/notifications";
import { suggestions, todos } from "@/lib/mock-data";
import { PetIcon } from "@/components/pet-icons";

export default function Home() {
  const { profile, records } = usePetLog();
  const latestRecords = records.slice(0, 3);
  const notifications = getCareNotifications(records).slice(0, 2);

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
              <Card className="p-4" key={notification.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#16804b]">{notification.category} · {notification.dueLabel}</p>
                    <h3 className="mt-1 text-sm font-bold text-[#1f2922]">{notification.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#667262]">{notification.detail}</p>
                  </div>
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#be4c3c]" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="오늘 요약" />
          <div className="grid grid-cols-3 gap-2">
            {[
              ["식사", "줄어듦", "주의"],
              ["활동량", "보통", "안정"],
              ["배변", "정상", "좋음"],
            ].map(([label, value, state]) => (
              <Card className="p-3 text-center" key={label}>
                <p className="text-xs font-bold text-[#788276]">{label}</p>
                <p className="mt-2 text-sm font-black text-[#1f2922]">{value}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#16804b]">{state}</p>
              </Card>
            ))}
          </div>
        </section>

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
            {suggestions.slice(0, 2).map((suggestion) => (
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
    </AppShell>
  );
}
