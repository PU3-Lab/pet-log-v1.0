"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, CategoryBadge, SectionHeader } from "@/components/ui";
import { getHospitalConnectSummary, getNearbyAnimalHospitals } from "@/lib/expansion-features";

export default function HospitalPage() {
  const { profile, records, expansionState, updateHospitalState } = usePetLog();
  const hospitalState = expansionState.hospital;
  const summary = useMemo(
    () => getHospitalConnectSummary(profile, records, hospitalState.symptomMemo),
    [profile, records, hospitalState.symptomMemo],
  );
  const nearbyHospitals = useMemo(() => getNearbyAnimalHospitals(hospitalState.locationStatus === "ready"), [hospitalState.locationStatus]);

  function requestNearbyLocation() {
    if (!("geolocation" in navigator)) {
      updateHospitalState({ locationStatus: "blocked" });
      return;
    }

    updateHospitalState({ locationStatus: "loading" });
    navigator.geolocation.getCurrentPosition(
      () => updateHospitalState({ locationStatus: "ready" }),
      () => updateHospitalState({ locationStatus: "blocked" }),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 },
    );
  }

  function toggleChecklistItem(item: string) {
    const checkedChecklistItems = hospitalState.checkedChecklistItems.includes(item)
      ? hospitalState.checkedChecklistItems.filter((current) => current !== item)
      : [...hospitalState.checkedChecklistItems, item];
    updateHospitalState({ checkedChecklistItems });
  }

  return (
    <AppShell subtitle="상담 전 기록을 정리해요" title="병원 연계">
      <div className="space-y-5">
        <Card className="bg-gradient-to-br from-white to-[#eaf2ff]">
          <p className="text-sm font-bold text-[#2e67a7]">방문 준비</p>
          <h2 className="mt-1 text-xl font-black text-[#1f2922]">{summary.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#667262]">{summary.detail}</p>
        </Card>

        <section>
          <SectionHeader title="증상 및 변화 메모" />
          <Card>
            <label className="block">
              <span className="text-xs font-bold text-[#778174]">병원에 말할 내용을 정리하세요</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-none rounded-xl border border-[#dde6d6] bg-white p-3 text-sm leading-6 text-[#263022] outline-none focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
                onChange={(event) => updateHospitalState({ symptomMemo: event.target.value })}
                placeholder="예: 어제부터 산책 중 자주 멈추고 현관 앞에서 기다리는 시간이 길어졌어요."
                value={hospitalState.symptomMemo}
              />
            </label>
            <p className="mt-3 text-xs font-semibold leading-5 text-[#778174]">입력한 메모는 저장되어 새로고침 후에도 리포트 미리보기에 유지됩니다.</p>
          </Card>
        </section>

        <section>
          <SectionHeader
            action={
              <button
                className="h-9 rounded-full border border-[#d8e3d2] bg-white px-3 text-xs font-bold text-[#16804b] disabled:text-[#9ca697]"
                disabled={hospitalState.locationStatus === "loading"}
                onClick={requestNearbyLocation}
                type="button"
              >
                {hospitalState.locationStatus === "loading"
                  ? "확인 중"
                  : hospitalState.locationStatus === "ready"
                    ? "내 위치 적용됨"
                    : "내 위치 찾기"}
              </button>
            }
            title="근처 동물병원"
          />
          <Card>
            <div className="relative h-52 overflow-hidden rounded-2xl border border-[#dce6d4] bg-[#edf4e9]">
              <div className="absolute left-0 top-1/3 h-px w-full bg-white/80" />
              <div className="absolute left-0 top-2/3 h-px w-full bg-white/80" />
              <div className="absolute left-1/3 top-0 h-full w-px bg-white/80" />
              <div className="absolute left-2/3 top-0 h-full w-px bg-white/80" />
              <div className="absolute -left-10 top-16 h-16 w-72 rotate-[-18deg] rounded-full bg-[#d8e7d0]" />
              <div className="absolute -right-12 bottom-10 h-14 w-64 rotate-[28deg] rounded-full bg-[#d7e4f5]" />
              <div className="absolute left-1/2 top-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-[#16804b] text-xs font-black text-white shadow-lg">
                나
              </div>
              {nearbyHospitals.map((hospital, index) => (
                <div
                  className="absolute z-20 grid h-8 w-8 -translate-x-1/2 -translate-y-full place-items-center rounded-full border-2 border-white bg-[#be4c3c] text-xs font-black text-white shadow-lg"
                  key={hospital.id}
                  style={{ left: `${hospital.mapPosition.x}%`, top: `${hospital.mapPosition.y}%` }}
                  title={hospital.name}
                >
                  {index + 1}
                </div>
              ))}
              <div className="absolute bottom-3 left-3 right-3 z-30 rounded-2xl bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
                <p className="text-xs font-bold text-[#1f2922]">
                  {hospitalState.locationStatus === "ready"
                    ? "현재 위치 기준 가까운 병원 후보입니다."
                    : hospitalState.locationStatus === "blocked"
                      ? "위치 권한이 없어 예상 거리로 표시합니다."
                      : "위치 권한을 허용하면 거리 표시를 더 명확히 보여줍니다."}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {nearbyHospitals.map((hospital, index) => (
                <button
                  className={`w-full rounded-2xl border p-3 text-left ${
                    hospitalState.selectedHospitalId === hospital.id ? "border-[#16804b] bg-[#f4fbef]" : "border-[#e0e6da] bg-[#fbfdf8]"
                  }`}
                  key={hospital.id}
                  onClick={() => updateHospitalState({ selectedHospitalId: hospital.id })}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#16804b]">
                        {index + 1} · {hospital.distanceLabel} · {hospital.etaLabel}
                      </p>
                      <h2 className="mt-1 text-sm font-black text-[#1f2922]">{hospital.name}</h2>
                      <p className="mt-1 text-xs font-semibold text-[#778174]">
                        {hospital.addressHint} · {hospital.openLabel}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#fff2df] px-2.5 py-1 text-xs font-bold text-[#bb721e]">
                      {hospitalState.selectedHospitalId === hospital.id ? "선택됨" : "선택"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hospital.tags.map((tag) => (
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#667262]" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-[#778174]">
              현재 병원 위치는 MVP 목업 데이터입니다. 실제 주변 검색과 길찾기는 지도 API 연결 후 제공합니다.
            </p>
          </Card>
        </section>

        <section>
          <SectionHeader title="최근 주의 기록" />
          <div className="space-y-3">
            {summary.warningRecords.map((record) => (
              <Card className="p-4" key={record.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={record.category} />
                  <span className="rounded-full bg-[#fff2df] px-2.5 py-1 text-xs font-bold text-[#bb721e]">
                    {record.status === "alert" ? "주의" : "확인 필요"}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-black text-[#1f2922]">{record.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#667262]">
                  {record.date} · {record.time}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667262]">{record.detail}</p>
              </Card>
            ))}
            {summary.warningRecords.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">주의 기록이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">기록이 쌓이면 상담 준비용 변화 기록을 자동으로 모읍니다.</p>
              </Card>
            ) : null}
          </div>
        </section>

        <section>
          <SectionHeader title="병원 제출용 리포트" />
          <Card>
            <ul className="space-y-2">
              {summary.reportPreview.map((item) => (
                <li className="rounded-xl bg-[#f4f7f0] px-3 py-2 text-xs font-semibold leading-5 text-[#3d4639]" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeader title="방문 전 체크" />
          <Card>
            <div className="grid grid-cols-2 gap-2">
              {summary.checklist.map((item) => (
                <button
                  className={`rounded-xl px-3 py-3 text-left text-xs font-bold leading-5 ${
                    hospitalState.checkedChecklistItems.includes(item) ? "bg-[#eaf5e5] text-[#16804b]" : "bg-[#f8faf5] text-[#3d4639]"
                  }`}
                  key={item}
                  onClick={() => toggleChecklistItem(item)}
                  type="button"
                >
                  <span className="mr-1">{hospitalState.checkedChecklistItems.includes(item) ? "✓" : "□"}</span>
                  {item}
                </button>
              ))}
            </div>
          </Card>
        </section>

        <Card className="bg-[#fffaf0]">
          <p className="text-sm font-bold text-[#b56d19]">공유 전 확인</p>
          <p className="mt-2 text-sm leading-6 text-[#65533a]">{summary.shareNotice}</p>
        </Card>
      </div>
    </AppShell>
  );
}
