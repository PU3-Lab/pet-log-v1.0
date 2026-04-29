"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { getSharedCareSummary } from "@/lib/expansion-features";

export default function SharedCarePage() {
  const { profile, records } = usePetLog();
  const [inviteTarget, setInviteTarget] = useState("");
  const [selectedRole, setSelectedRole] = useState("공동 보호자");
  const [draftInvite, setDraftInvite] = useState("");
  const summary = useMemo(() => getSharedCareSummary(profile, records), [profile, records]);

  function saveInviteDraft() {
    const target = inviteTarget.trim();
    if (!target) {
      setDraftInvite("초대할 이메일 또는 연락처를 입력해주세요.");
      return;
    }

    setDraftInvite(`${target} · ${selectedRole} 초대가 목업 상태로 준비되었습니다.`);
    setInviteTarget("");
  }

  return (
    <AppShell subtitle="보호자와 함께 보는 기록" title="공동 관리">
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#edf8ed]">
          <p className="text-sm font-bold text-[#16804b]">공유 준비</p>
          <h2 className="mt-1 text-xl font-black text-[#1f2922]">{summary.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">{summary.detail}</p>
        </Card>

        <section>
          <SectionHeader title="보호자 초대" />
          <Card>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-[#778174]">이메일 또는 연락처</span>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-[#dde6d6] bg-white px-3 text-sm font-semibold text-[#263022] outline-none focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
                  onChange={(event) => setInviteTarget(event.target.value)}
                  placeholder="예: family@example.com"
                  value={inviteTarget}
                />
              </label>
              <div>
                <p className="mb-2 text-xs font-bold text-[#778174]">역할</p>
                <div className="grid grid-cols-1 gap-2">
                  {summary.roleOptions.map((role) => (
                    <Pill active={selectedRole === role} className="w-full" key={role} onClick={() => setSelectedRole(role)}>
                      {role}
                    </Pill>
                  ))}
                </div>
              </div>
              <button
                className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]"
                onClick={saveInviteDraft}
                type="button"
              >
                초대 준비
              </button>
              {draftInvite ? <p className="rounded-xl bg-[#f4f7f0] px-3 py-2 text-sm font-semibold leading-6 text-[#3d4639]">{draftInvite}</p> : null}
            </div>
          </Card>
        </section>

        <section>
          <SectionHeader title="관리 멤버" />
          <div className="space-y-3">
            {summary.members.map((member) => (
              <Card className="p-4" key={member.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#16804b]">{member.role}</p>
                    <h2 className="mt-1 text-base font-black text-[#1f2922]">{member.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#667262]">{member.permission}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f0f3ed] px-2.5 py-1 text-xs font-bold text-[#667262]">{member.status}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="활동 기록" />
          <Card>
            <ul className="space-y-2">
              {summary.activityItems.map((item) => (
                <li className="rounded-xl bg-[#f4f7f0] px-3 py-2 text-xs font-semibold leading-5 text-[#3d4639]" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">알림 공유 범위</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">{summary.notificationSharingDetail}</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-[#7b6b4d]">실제 초대 발송과 권한 검증은 서버 연결 후 적용합니다.</p>
        </Card>
      </div>
    </AppShell>
  );
}
