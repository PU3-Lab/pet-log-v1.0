import { AppShell } from "@/components/app-shell";
import { Card, MiniLineChart, Pill, SectionHeader } from "@/components/ui";
import { metrics, petProfile } from "@/lib/mock-data";

export default function ProfilePage() {
  const weightMetric = metrics.find((metric) => metric.label === "체중") ?? metrics[0];

  return (
    <AppShell subtitle="우리 아이 정보를 관리해요" title="프로필">
      <div className="space-y-5">
        <Card>
          <div className="flex gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#eef5e9] text-2xl font-black text-[#16804b]">
              {petProfile.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#1f2922]">{petProfile.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#697465]">
                    {petProfile.age} · {petProfile.breed} · {petProfile.sex}
                  </p>
                </div>
                <button className="text-sm font-bold text-[#16804b]">편집</button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>{petProfile.weight}</Pill>
                <Pill>{petProfile.birthday}</Pill>
              </div>
            </div>
          </div>
        </Card>

        <section>
          <SectionHeader title="기본 정보" />
          <Card>
            <dl className="space-y-3 text-sm">
              {[
                ["성격", petProfile.personality],
                ["특이사항", petProfile.notes[0]],
                ["생활 정보", petProfile.notes[2]],
              ].map(([label, value]) => (
                <div className="flex justify-between gap-4 border-b border-[#edf1e9] pb-3 last:border-0 last:pb-0" key={label}>
                  <dt className="font-bold text-[#778174]">{label}</dt>
                  <dd className="text-right font-semibold text-[#263022]">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>

        <section>
          <SectionHeader title="체중 변화" />
          <Card>
            <div className="mb-2 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-[#16804b]">{petProfile.weight}</p>
                <h2 className="text-base font-black text-[#1f2922]">최근 7회 기록</h2>
              </div>
              <p className="text-xs font-bold text-[#7b8576]">{weightMetric.trend}</p>
            </div>
            <MiniLineChart values={weightMetric.values} />
          </Card>
        </section>

        <section>
          <SectionHeader title="건강 메모" />
          <div className="space-y-3">
            {petProfile.notes.map((note) => (
              <Card className="p-4" key={note}>
                <p className="text-sm font-semibold text-[#3e493b]">{note}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
