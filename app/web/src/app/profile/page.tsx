"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { usePetLog } from "@/components/pet-log-provider";
import { Card, MiniLineChart, Pill, SectionHeader } from "@/components/ui";
import { metrics } from "@/lib/mock-data";
import { getProfilePhotoError } from "@/lib/profile-photo";
import type { PetProfile } from "@/lib/types";

const emptyProfile: PetProfile = {
  name: "",
  breed: "",
  age: "",
  sex: "",
  weight: "",
  birthday: "",
  personality: "",
  notes: [],
};

export default function ProfilePage() {
  const { profile, updateProfile } = usePetLog();
  const weightMetric = metrics.find((metric) => metric.label === "체중") ?? metrics[0];
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PetProfile>(profile);
  const [notesText, setNotesText] = useState(profile.notes.join("\n"));
  const [error, setError] = useState("");

  function startEdit() {
    setDraft(profile);
    setNotesText(profile.notes.join("\n"));
    setError("");
    setIsEditing(true);
  }

  function updateDraft(field: keyof PetProfile, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (error) {
      setError("");
    }
  }

  function cancelEdit() {
    setDraft(profile);
    setNotesText(profile.notes.join("\n"));
    setError("");
    setIsEditing(false);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const photoError = getProfilePhotoError(file);
    if (photoError) {
      setError(photoError);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("프로필 사진을 읽지 못했습니다.");
        return;
      }

      setDraft((current) => ({ ...current, photoDataUrl: reader.result as string }));
      setError("");
    };
    reader.onerror = () => setError("프로필 사진을 읽지 못했습니다.");
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    const nextProfile: PetProfile = {
      ...emptyProfile,
      ...draft,
      name: draft.name.trim(),
      breed: draft.breed.trim(),
      age: draft.age.trim(),
      sex: draft.sex.trim(),
      weight: draft.weight.trim(),
      birthday: draft.birthday.trim(),
      personality: draft.personality.trim(),
      notes: notesText
        .split("\n")
        .map((note) => note.trim())
        .filter(Boolean),
    };

    if (!nextProfile.name || !nextProfile.breed) {
      setError("이름과 품종은 필수로 입력해주세요.");
      return;
    }

    updateProfile(nextProfile);
    setDraft(nextProfile);
    setNotesText(nextProfile.notes.join("\n"));
    setError("");
    setIsEditing(false);
  }

  return (
    <AppShell subtitle="우리 아이 정보를 관리해요" title="프로필">
      <div className="space-y-5">
        {isEditing ? (
          <Card className="border-[#b9dbc5] bg-[#fbfffb]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-black text-[#1f2922]">프로필 편집</h2>
              <button className="text-sm font-bold text-[#667262]" onClick={cancelEdit} type="button">
                닫기
              </button>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#dfe8d9] bg-white p-3">
                <span className="text-xs font-bold text-[#778174]">프로필 사진</span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-[#eef5e9] text-2xl font-black text-[#16804b]">
                    {draft.photoDataUrl ? (
                      <Image
                        alt="프로필 사진 미리보기"
                        className="h-full w-full object-cover"
                        height={80}
                        src={draft.photoDataUrl}
                        unoptimized
                        width={80}
                      />
                    ) : (
                      draft.name.slice(0, 1) || profile.name.slice(0, 1)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-5 text-[#667262]">2MB 이하의 이미지 파일을 저장할 수 있습니다.</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        className="h-10 rounded-xl border border-[#cfe2cd] bg-[#f4faf2] text-sm font-bold text-[#16804b]"
                        onClick={() => uploadInputRef.current?.click()}
                        type="button"
                      >
                        업로드
                      </button>
                      <button
                        className="h-10 rounded-xl border border-[#d8e1f2] bg-[#f6f9ff] text-sm font-bold text-[#356aa8]"
                        onClick={() => cameraInputRef.current?.click()}
                        type="button"
                      >
                        촬영
                      </button>
                    </div>
                    {draft.photoDataUrl ? (
                      <button
                        className="mt-2 h-9 w-full rounded-xl bg-[#fff0ed] text-sm font-bold text-[#be4c3c]"
                        onClick={() => setDraft((current) => ({ ...current, photoDataUrl: undefined }))}
                        type="button"
                      >
                        사진 삭제
                      </button>
                    ) : null}
                  </div>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  ref={uploadInputRef}
                  type="file"
                />
                <input
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoChange}
                  ref={cameraInputRef}
                  type="file"
                />
              </div>
              {[
                ["이름", "name"],
                ["품종", "breed"],
                ["나이", "age"],
                ["성별", "sex"],
                ["체중", "weight"],
                ["생일", "birthday"],
                ["성격", "personality"],
              ].map(([label, field]) => (
                <label className="block" key={field}>
                  <span className="text-xs font-bold text-[#778174]">{label}</span>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-[#dde6d6] bg-white px-3 text-sm font-semibold text-[#263022] outline-none focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
                    onChange={(event) => updateDraft(field as keyof PetProfile, event.target.value)}
                    value={draft[field as keyof PetProfile] as string}
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-bold text-[#778174]">건강 메모</span>
                <textarea
                  className="mt-1 min-h-28 w-full resize-none rounded-xl border border-[#dde6d6] bg-white p-3 text-sm leading-6 text-[#263022] outline-none focus:border-[#16804b] focus:ring-2 focus:ring-[#16804b]/15"
                  onChange={(event) => {
                    setNotesText(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  value={notesText}
                />
              </label>
              {error ? <p className="text-sm font-semibold text-[#be4c3c]">{error}</p> : null}
              <button
                className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]"
                onClick={saveProfile}
                type="button"
              >
                프로필 저장
              </button>
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="flex gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#eef5e9] text-2xl font-black text-[#16804b]">
                  {profile.photoDataUrl ? (
                    <Image
                      alt={`${profile.name} 프로필 사진`}
                      className="h-full w-full rounded-3xl object-cover"
                      height={80}
                      src={profile.photoDataUrl}
                      unoptimized
                      width={80}
                    />
                  ) : (
                    profile.name.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-[#1f2922]">{profile.name}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#697465]">
                        {profile.age} · {profile.breed} · {profile.sex}
                      </p>
                    </div>
                    <button className="text-sm font-bold text-[#16804b]" onClick={startEdit} type="button">
                      편집
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>{profile.weight}</Pill>
                    <Pill>{profile.birthday}</Pill>
                  </div>
                </div>
              </div>
            </Card>

            <section>
              <SectionHeader title="기본 정보" />
              <Card>
                <dl className="space-y-3 text-sm">
                  {[
                    ["성격", profile.personality],
                    ["특이사항", profile.notes[0] ?? "등록된 특이사항 없음"],
                    ["생활 정보", profile.notes[2] ?? profile.notes[1] ?? "등록된 생활 정보 없음"],
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
                    <p className="text-sm font-bold text-[#16804b]">{profile.weight}</p>
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
                {profile.notes.map((note) => (
                  <Card className="p-4" key={note}>
                    <p className="text-sm font-semibold text-[#3e493b]">{note}</p>
                  </Card>
                ))}
                {profile.notes.length === 0 ? (
                  <Card className="p-5 text-center">
                    <p className="text-sm font-bold text-[#1f2922]">등록된 건강 메모가 없습니다.</p>
                  </Card>
                ) : null}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
