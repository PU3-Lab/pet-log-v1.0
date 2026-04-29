"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { structureRecord } from "@/lib/ai-insights";
import { petProfile as initialProfile, records as initialRecords } from "@/lib/mock-data";
import type { PetProfile, RecordCategory, RecordEntry } from "@/lib/types";

type NewRecordInput = {
  category: RecordCategory;
  detail: string;
};

type UpdateRecordInput = {
  category: RecordCategory;
  detail: string;
};

type StoredPetLogState = {
  version: 1;
  profile: PetProfile;
  records: RecordEntry[];
};

type PetLogContextValue = {
  profile: PetProfile;
  records: RecordEntry[];
  addRecord: (input: NewRecordInput) => RecordEntry;
  updateRecord: (id: string, input: UpdateRecordInput) => void;
  deleteRecord: (id: string) => void;
  updateProfile: (input: PetProfile) => void;
};

const storageKey = "pet-log-state-v1";
const PetLogContext = createContext<PetLogContextValue | null>(null);

function formatDateLabel(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTimeLabel(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function createTitle(detail: string) {
  const firstLine = detail.trim().split(/\n|[.!?。]/)[0]?.trim() ?? "";
  if (firstLine.length <= 24) {
    return firstLine || "새 기록";
  }
  return `${firstLine.slice(0, 24)}...`;
}

function isRecordCategory(value: unknown): value is RecordCategory {
  return value === "meal" || value === "walk" || value === "stool" || value === "medical" || value === "behavior";
}

function isRecordEntry(value: unknown): value is RecordEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as RecordEntry;
  return (
    typeof record.id === "string" &&
    typeof record.date === "string" &&
    typeof record.time === "string" &&
    isRecordCategory(record.category) &&
    typeof record.title === "string" &&
    typeof record.detail === "string" &&
    (record.status === "normal" || record.status === "notice" || record.status === "alert")
  );
}

function isPetProfile(value: unknown): value is PetProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const profile = value as PetProfile;
  return (
    typeof profile.name === "string" &&
    typeof profile.breed === "string" &&
    typeof profile.age === "string" &&
    typeof profile.sex === "string" &&
    typeof profile.weight === "string" &&
    typeof profile.birthday === "string" &&
    typeof profile.personality === "string" &&
    (profile.photoDataUrl === undefined || typeof profile.photoDataUrl === "string") &&
    Array.isArray(profile.notes) &&
    profile.notes.every((note) => typeof note === "string")
  );
}

function parseStoredState(value: string | null): StoredPetLogState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredPetLogState>;
    if (
      parsed.version === 1 &&
      isPetProfile(parsed.profile) &&
      Array.isArray(parsed.records) &&
      parsed.records.every(isRecordEntry)
    ) {
      return parsed as StoredPetLogState;
    }
  } catch {
    return null;
  }

  return null;
}

export function PetLogProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PetProfile>(initialProfile);
  const [records, setRecords] = useState<RecordEntry[]>(initialRecords);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      let storedState: StoredPetLogState | null = null;
      try {
        storedState = parseStoredState(window.localStorage.getItem(storageKey));
      } catch {
        storedState = null;
      }

      if (storedState) {
        setProfile(storedState.profile);
        setRecords(storedState.records);
      }
      setIsStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    const state: StoredPetLogState = {
      version: 1,
      profile,
      records,
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // 저장소 사용이 막힌 환경에서는 현재 세션 상태만 유지합니다.
    }
  }, [isStorageReady, profile, records]);

  const addRecord = useCallback((input: NewRecordInput) => {
    const now = new Date();
    const record: RecordEntry = {
      id: `local-${now.getTime()}`,
      date: formatDateLabel(now),
      time: formatTimeLabel(now),
      category: input.category,
      title: createTitle(input.detail),
      detail: input.detail.trim(),
      status: "normal",
      structured: structureRecord(input.detail, input.category),
    };

    setRecords((current) => [record, ...current]);
    return record;
  }, []);

  const updateRecord = useCallback((id: string, input: UpdateRecordInput) => {
    const detail = input.detail.trim();
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              category: input.category,
              detail,
              title: createTitle(detail),
              structured: structureRecord(detail, input.category),
            }
          : record,
      ),
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const updateProfile = useCallback((input: PetProfile) => {
    setProfile({
      ...input,
      notes: input.notes.map((note) => note.trim()).filter(Boolean),
      photoDataUrl: input.photoDataUrl || undefined,
    });
  }, []);

  const value = useMemo(
    () => ({ profile, records, addRecord, updateRecord, deleteRecord, updateProfile }),
    [profile, records, addRecord, updateRecord, deleteRecord, updateProfile],
  );

  return <PetLogContext.Provider value={value}>{children}</PetLogContext.Provider>;
}

export function usePetLog() {
  const context = useContext(PetLogContext);
  if (!context) {
    throw new Error("usePetLog must be used within PetLogProvider");
  }
  return context;
}
