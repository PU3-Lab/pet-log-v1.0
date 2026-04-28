import { AppShell } from "@/components/app-shell";
import { Card, Pill, SectionHeader } from "@/components/ui";

const posts = [
  {
    board: "행동 고민",
    title: "말티즈 산책 줄면 쉽게 흥분하나요?",
    meta: "댓글 8 · 공감 26",
  },
  {
    board: "용품 나눔",
    title: "소형견 하네스 나눔합니다",
    meta: "댓글 3 · 공감 15",
  },
  {
    board: "자유게시판",
    title: "분리불안 어떻게 기록하고 계세요?",
    meta: "댓글 12 · 공감 32",
  },
];

export default function CommunityPage() {
  return (
    <AppShell subtitle="커뮤니티" title="커뮤니티">
      <div className="space-y-5">
        <div className="grid grid-cols-5 gap-2">
          {["유기동물", "용품 나눔", "자유게시판", "행동 고민", "후기"].map((item) => (
            <div className="rounded-2xl bg-white p-2 text-center shadow-[0_8px_22px_rgba(49,65,44,0.06)]" key={item}>
              <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-[#eef5e9]" />
              <p className="break-keep text-[11px] font-bold text-[#4a5547]">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Pill active>인기글</Pill>
          <Pill>최신글</Pill>
          <Pill>내 주변</Pill>
        </div>

        <section>
          <SectionHeader title="인기글" />
          <div className="space-y-3">
            {posts.map((post) => (
              <Card className="p-4" key={post.title}>
                <p className="text-xs font-bold text-[#16804b]">{post.board}</p>
                <h2 className="mt-2 text-sm font-black text-[#1f2922]">{post.title}</h2>
                <p className="mt-2 text-xs font-semibold text-[#7c8777]">{post.meta}</p>
              </Card>
            ))}
          </div>
        </section>

        <button className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]">
          글쓰기
        </button>
      </div>
    </AppShell>
  );
}
