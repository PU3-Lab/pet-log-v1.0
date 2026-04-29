"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { records as initialRecords, type RecordCategory, type RecordEntry } from "@/lib/mock-data";

type NewRecordInput = {
  category: RecordCategory;
  detail: string;
};

type PetLogContextValue = {
  records: RecordEntry[];
  addRecord: (input: NewRecordInput) => RecordEntry;
};

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

export function PetLogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RecordEntry[]>(initialRecords);

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
    };

    setRecords((current) => [record, ...current]);
    return record;
  }, []);

  const value = useMemo(() => ({ records, addRecord }), [records, addRecord]);

  return <PetLogContext.Provider value={value}>{children}</PetLogContext.Provider>;
}

export function usePetLog() {
  const context = useContext(PetLogContext);
  if (!context) {
    throw new Error("usePetLog must be used within PetLogProvider");
  }
  return context;
}
