"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { getCareNotifications } from "@/lib/notifications";
import type { CareNotificationCategory, CareNotificationTone } from "@/lib/types";

type NotificationFilter = "전체" | CareNotificationCategory;

const filters: NotificationFilter[] = ["전체", "기록", "주의", "일정"];

const toneClasses: Record<CareNotificationTone, string> = {
  green: "bg-[#edf8ed] text-[#16804b]",
  orange: "bg-[#fff2df] text-[#bb721e]",
  red: "bg-[#ffe9e6] text-[#be4c3c]",
  blue: "bg-[#eaf2ff] text-[#2e67a7]",
};

export default function NotificationsPage() {
  const { records } = usePetLog();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("전체");
  const notifications = useMemo(() => getCareNotifications(records), [records]);
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "전체") {
      return notifications;
    }
    return notifications.filter((notification) => notification.category === activeFilter);
  }, [activeFilter, notifications]);

  return (
    <AppShell subtitle="중요한 케어 신호" title="알림">
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#edf8ed]">
          <p className="text-sm font-bold text-[#16804b]">오늘 확인할 알림</p>
          <h2 className="mt-1 text-2xl font-black text-[#1f2922]">{notifications.length}개</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">기록 누락, 주의 기록 후속 확인, 예정된 케어 일정을 모아 보여줍니다.</p>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <Pill active={activeFilter === filter} key={filter} onClick={() => setActiveFilter(filter)}>
              {filter}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader title="알림 목록" />
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id}>
                <div className="flex gap-3">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black ${toneClasses[notification.tone]}`}>
                    {notification.category}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-black text-[#1f2922]">{notification.title}</h2>
                      <span className="shrink-0 rounded-full bg-[#f0f3ed] px-2.5 py-1 text-[11px] font-bold text-[#667262]">
                        {notification.dueLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#667262]">{notification.detail}</p>
                    <Link
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#16804b] text-sm font-bold text-white"
                      href={notification.actionHref}
                    >
                      {notification.action}
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
            {filteredNotifications.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">표시할 알림이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">다른 분류를 선택하거나 새 기록을 남겨보세요.</p>
              </Card>
            ) : null}
          </div>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">안전 안내</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">
            알림은 저장된 기록을 바탕으로 한 확인 요청입니다. 증상이 반복되거나 심해지면 병원 상담을 권장합니다.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
