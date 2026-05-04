import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  createPreparedInvite,
  defaultExpansionState,
  normalizeExpansionState,
  toggleSavedRecommendation,
} from "./expansion-state";
import {
  getHospitalConnectSummary,
  getNearbyAnimalHospitals,
  getSharedCareSummary,
  getShoppingRecommendations,
} from "./expansion-features";
import { getRecentChange, getTodaySummary } from "./home-summary";
import { petProfile, records, schedules } from "./mock-data";
import { getCareNotifications, getNotificationReadSummary, getNotificationsWithReadState } from "./notifications";
import { getScheduleSummary } from "./schedules";
import { resetMockPetLogSnapshot, updateMockExpansionState } from "./server/mock-pet-log-store";
import { getTimelineSummary } from "./timeline";

test("스프린트 6: 공동 관리, 병원 연계, 쇼핑 요약 데이터가 생성된다", () => {
  const invite = createPreparedInvite("가족 보호자", "기록 담당", 1_000);
  const sharedCare = getSharedCareSummary(petProfile, records, [invite]);
  const hospital = getHospitalConnectSummary(petProfile, records, "기침이 어제보다 잦음");
  const nearbyHospitals = getNearbyAnimalHospitals(false);
  const shopping = getShoppingRecommendations(petProfile, records);

  assert.ok(sharedCare.members.some((member) => member.name === "가족 보호자"));
  assert.ok(hospital.reportPreview.some((item) => item.includes("보호자 증상 메모")));
  assert.ok(nearbyHospitals.every((item) => item.distanceLabel.startsWith("예상 ")));
  assert.ok(shopping.some((item) => item.category === "사료"));
});

test("스프린트 7: 확장 UI 상태는 부분 업데이트와 정규화를 지원한다", () => {
  resetMockPetLogSnapshot();
  const sharedCareState = updateMockExpansionState({
    sharedCare: { ...defaultExpansionState.sharedCare, inviteTarget: "가족", selectedRole: "읽기 전용" },
  });
  const mergedState = updateMockExpansionState({
    hospital: { ...defaultExpansionState.hospital, symptomMemo: "아침부터 기침", locationStatus: "ready" },
  });
  const normalized = normalizeExpansionState({
    sharedCare: { selectedRole: "잘못된 역할" },
    hospital: { locationStatus: "unknown" },
    shopping: { activeFilter: "없는 필터" },
  });

  assert.equal(sharedCareState.sharedCare.selectedRole, "읽기 전용");
  assert.equal(mergedState.sharedCare.inviteTarget, "가족");
  assert.equal(mergedState.hospital.locationStatus, "ready");
  assert.equal(normalized.sharedCare.selectedRole, "공동 보호자");
  assert.equal(normalized.hospital.locationStatus, "idle");
  assert.equal(normalized.shopping.activeFilter, "전체");
});

test("스프린트 8: 확장 화면 라우트와 저장 토글 유틸이 유지된다", () => {
  const routeFiles = ["shared-care", "hospital", "shopping"].map((route) => `src/app/${route}/page.tsx`);
  const saved = toggleSavedRecommendation([], "health-basic");
  const unsaved = toggleSavedRecommendation(saved, "health-basic");

  assert.ok(routeFiles.every((path) => existsSync(join(process.cwd(), path))));
  assert.deepEqual(saved, ["health-basic"]);
  assert.deepEqual(unsaved, []);
});

test("스프린트 9: 홈 상태판은 최근 기록과 주의 변화를 요약한다", () => {
  const summary = getTodaySummary(records);
  const change = getRecentChange(records);
  const timelineSummary = getTimelineSummary(records);

  assert.deepEqual(
    summary.map((item) => item.category),
    ["meal", "walk", "stool"],
  );
  assert.equal(change.tone, "red");
  assert.equal(timelineSummary.alertCount, 1);
  assert.ok(change.detail.includes("병원 상담"));
});

test("스프린트 10: 보조 케어 화면 요약은 일정과 알림 상태를 계산한다", () => {
  const scheduleSummary = getScheduleSummary(schedules, "2026-05-01");
  const notifications = getCareNotifications(records, schedules, "2026-05-01");
  const readState = getNotificationsWithReadState(notifications, [notifications[0]?.id ?? ""]);
  const readSummary = getNotificationReadSummary(readState);

  assert.equal(scheduleSummary.dueSoonCount, 1);
  assert.ok(notifications.some((notification) => notification.category === "일정"));
  assert.equal(readSummary.totalCount, notifications.length);
  assert.equal(readSummary.hasUnread, notifications.length > 1);
});
