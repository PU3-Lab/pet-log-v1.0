const summaryCards = [
  {
    title: "오늘 요약",
    value: "평소보다 활동량이 적어요",
    detail: "최근 3일 평균 산책 시간보다 18분 짧습니다.",
  },
  {
    title: "AI 질문",
    value: "오늘 배변 상태는 어땠나요?",
    detail: "어제 기록이 비어 있어 변화 판단에 필요합니다.",
  },
  {
    title: "추천 행동",
    value: "짧은 저녁 산책",
    detail: "무리 없는 15분 산책으로 활동 리듬을 회복해보세요.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231f]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 border-b border-[#d8ddd2] pb-5">
          <div>
            <p className="text-sm font-medium text-[#5f6f52]">Pet Log MVP</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">두부의 오늘 상태</h1>
          </div>
          <button className="rounded-md bg-[#2f5d50] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254a40]">
            기록 추가
          </button>
        </header>

        <div className="grid flex-1 gap-5 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#5f6f52]">AI 상태 브리핑</p>
                <h2 className="mt-2 text-xl font-semibold">기록을 해석해 다음 행동을 제안합니다</h2>
              </div>
              <span className="rounded-full bg-[#e4f0df] px-3 py-1 text-xs font-semibold text-[#31513b]">
                MVP
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {summaryCards.map((card) => (
                <article key={card.title} className="rounded-md border border-[#dfe4da] p-4">
                  <p className="text-sm font-medium text-[#6a7463]">{card.title}</p>
                  <h3 className="mt-2 text-lg font-semibold">{card.value}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5d6658]">{card.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">빠른 기록</h2>
            <textarea
              className="mt-4 min-h-36 w-full resize-none rounded-md border border-[#cfd6c8] bg-[#fbfcfa] p-3 text-sm outline-none transition placeholder:text-[#7a8374] focus:border-[#2f5d50] focus:ring-2 focus:ring-[#2f5d50]/20"
              placeholder="예: 오늘 아침 사료를 조금 남겼고 산책 중 자주 멈췄어요."
            />
            <button className="mt-3 w-full rounded-md bg-[#20231f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#343932]">
              AI로 구조화
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
