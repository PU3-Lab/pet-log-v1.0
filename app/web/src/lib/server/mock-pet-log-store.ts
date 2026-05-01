import { structureRecord } from "@/lib/ai-insights";
import { defaultExpansionState, normalizeExpansionState } from "@/lib/expansion-state";
import { petProfile as initialProfile, records as initialRecords, schedules as initialSchedules } from "@/lib/mock-data";
import { defaultAppSettings } from "@/lib/settings";
import type { PetLogSnapshot } from "@/lib/api-client";
import type { AppSettings, CareSchedule, PetProfile, RecordCategory, RecordEntry, ScheduleCategory } from "@/lib/types";
import type { ExpansionState } from "@/lib/expansion-state";

type NewRecordInput = {
  category: RecordCategory;
  detail: string;
};

type UpdateRecordInput = {
  category: RecordCategory;
  detail: string;
};

type NewScheduleInput = {
  category: ScheduleCategory;
  title: string;
  dueDate: string;
  repeatLabel: string;
  note: string;
};

type UpdateScheduleInput = Partial<{
  category: ScheduleCategory;
  title: string;
  dueDate: string;
  repeatLabel: string;
  note: string;
  isDone: boolean;
}>;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

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

function createInitialSnapshot(): PetLogSnapshot {
  return {
    version: 1,
    profile: clone(initialProfile),
    records: clone(initialRecords),
    schedules: clone(initialSchedules),
    settings: clone(defaultAppSettings),
    readNotificationIds: [],
    expansionState: clone(defaultExpansionState),
  };
}

let snapshot = createInitialSnapshot();

export function getMockPetLogSnapshot() {
  return clone(snapshot);
}

export function resetMockPetLogSnapshot() {
  snapshot = createInitialSnapshot();
  return getMockPetLogSnapshot();
}

export function updateMockProfile(input: PetProfile) {
  snapshot.profile = {
    ...input,
    notes: input.notes.map((note) => note.trim()).filter(Boolean),
    photoDataUrl: input.photoDataUrl || undefined,
  };
  return clone(snapshot.profile);
}

export function createMockRecord(input: NewRecordInput) {
  const now = new Date();
  const detail = input.detail.trim();
  const record: RecordEntry = {
    id: `mock-record-${now.getTime()}`,
    date: formatDateLabel(now),
    time: formatTimeLabel(now),
    category: input.category,
    title: createTitle(detail),
    detail,
    status: "normal",
    structured: structureRecord(detail, input.category),
  };

  snapshot.records = [record, ...snapshot.records];
  return clone(record);
}

export function updateMockRecord(id: string, input: UpdateRecordInput) {
  const detail = input.detail.trim();
  let updated: RecordEntry | null = null;
  snapshot.records = snapshot.records.map((record) => {
    if (record.id !== id) {
      return record;
    }

    updated = {
      ...record,
      category: input.category,
      detail,
      title: createTitle(detail),
      structured: structureRecord(detail, input.category),
    };
    return updated;
  });

  return updated ? clone(updated) : null;
}

export function deleteMockRecord(id: string) {
  const beforeCount = snapshot.records.length;
  snapshot.records = snapshot.records.filter((record) => record.id !== id);
  return snapshot.records.length !== beforeCount;
}

export function createMockSchedule(input: NewScheduleInput) {
  const now = new Date();
  const schedule: CareSchedule = {
    id: `mock-schedule-${now.getTime()}`,
    category: input.category,
    title: input.title.trim(),
    dueDate: input.dueDate,
    repeatLabel: input.repeatLabel.trim() || "한 번",
    note: input.note.trim(),
    isDone: false,
  };

  snapshot.schedules = [schedule, ...snapshot.schedules];
  return clone(schedule);
}

export function updateMockSchedule(id: string, input: UpdateScheduleInput) {
  let updated: CareSchedule | null = null;
  snapshot.schedules = snapshot.schedules.map((schedule) => {
    if (schedule.id !== id) {
      return schedule;
    }

    updated = {
      ...schedule,
      ...input,
      title: input.title === undefined ? schedule.title : input.title.trim(),
      repeatLabel: input.repeatLabel === undefined ? schedule.repeatLabel : input.repeatLabel.trim() || "한 번",
      note: input.note === undefined ? schedule.note : input.note.trim(),
    };
    return updated;
  });

  return updated ? clone(updated) : null;
}

export function deleteMockSchedule(id: string) {
  const beforeCount = snapshot.schedules.length;
  snapshot.schedules = snapshot.schedules.filter((schedule) => schedule.id !== id);
  return snapshot.schedules.length !== beforeCount;
}

export function updateMockSettings(input: AppSettings) {
  snapshot.settings = {
    notificationPreferences: {
      missingRecord: input.notificationPreferences.missingRecord,
      alert: input.notificationPreferences.alert,
      schedule: input.notificationPreferences.schedule,
    },
    aiInsightEnabled: input.aiInsightEnabled,
  };
  return clone(snapshot.settings);
}

export function updateMockReadNotifications(readNotificationIds: string[]) {
  snapshot.readNotificationIds = Array.from(new Set(readNotificationIds.filter((id) => typeof id === "string")));
  return [...snapshot.readNotificationIds];
}

export function updateMockExpansionState(input: Partial<ExpansionState>) {
  snapshot.expansionState = normalizeExpansionState({
    sharedCare: {
      ...snapshot.expansionState.sharedCare,
      ...input.sharedCare,
    },
    hospital: {
      ...snapshot.expansionState.hospital,
      ...input.hospital,
    },
    shopping: {
      ...snapshot.expansionState.shopping,
      ...input.shopping,
    },
  });
  return clone(snapshot.expansionState);
}
