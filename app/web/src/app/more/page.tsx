import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, SectionHeader } from "@/components/ui";

const moreItems = [
  { href: "/profile", label: "반려동물 프로필", detail: "우리 아이 정보를 관리해요" },
  { href: "/suggestions", label: "AI 제안", detail: "맞춤형 행동 개선 가이드" },
  { href: "/shared-care", label: "공동 관리", detail: "보호자 초대와 알림 공유" },
  { href: "/hospital", label: "병원 연계", detail: "상담 준비용 기록 리포트" },
  { href: "/shopping", label: "쇼핑", detail: "기록 기반 맞춤 상품 후보" },
  { href: "/timeline", label: "기록 타임라인", detail: "날짜별 기록을 한눈에" },
  { href: "/schedule", label: "일정", detail: "접종, 약 복용, 검진 리마인더" },
  { href: "/notifications", label: "알림", detail: "중요한 알림을 한눈에" },
  { href: "/settings", label: "설정", detail: "알림과 AI 요약을 관리해요" },
];

export default function MorePage() {
  return (
    <AppShell subtitle="더보기" title="더보기">
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#edf8ed]">
          <p className="text-sm font-bold text-[#16804b]">코코</p>
          <h2 className="mt-1 text-lg font-black text-[#1f2922]">3살 · 말티즈</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">프로필, 제안, 알림과 설정을 한곳에서 확인합니다.</p>
        </Card>

        <section>
          <SectionHeader title="관리 메뉴" />
          <div className="space-y-3">
            {moreItems.map((item) => (
              <Link href={item.href} key={item.label}>
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-black text-[#1f2922]">{item.label}</h2>
                      <p className="mt-1 text-xs font-semibold text-[#7c8777]">{item.detail}</p>
                    </div>
                    <span className="text-[#9ba597]">›</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
