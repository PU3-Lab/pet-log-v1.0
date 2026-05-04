import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getAiCareSuggestions, structureRecord } from "./ai-insights";
import { getAnalysisMetrics, getAnalysisTrendChart, getVisibleAnalysisMetrics } from "./analysis-summary";
import { getCommunityPosts } from "./community";
import { communityPosts, petProfile, records } from "./mock-data";
import {
  createMockRecord,
  deleteMockRecord,
  getMockPetLogSnapshot,
  resetMockPetLogSnapshot,
  updateMockProfile,
  updateMockRecord,
} from "./server/mock-pet-log-store";
import { getTimelineRecords } from "./timeline";

function workspaceFile(path: string) {
  return join(process.cwd(), "..", "..", path);
}

test("스프린트 1: 기록 입력은 세션 스냅샷과 타임라인 검색에 연결된다", () => {
  resetMockPetLogSnapshot();
  const beforeCount = getMockPetLogSnapshot().records.length;
  const detail = "아침 사료 45g 먹었어요.";
  const created = createMockRecord({
    category: "meal",
    detail,
    structured: structureRecord(detail, "meal"),
  });
  const snapshot = getMockPetLogSnapshot();
  const visibleRecords = getTimelineRecords(snapshot.records, { filter: "all", query: "45g" });

  assert.equal(snapshot.records.length, beforeCount + 1);
  assert.equal(snapshot.records[0]?.id, created.id);
  assert.equal(visibleRecords[0]?.id, created.id);
});

test("스프린트 2: 필터와 선택 UI용 데이터 조회가 실제 목록을 줄인다", () => {
  const walkMetrics = getVisibleAnalysisMetrics(getAnalysisMetrics(records), "walk");
  const walkChart = getAnalysisTrendChart(getAnalysisMetrics(records), "walk");
  const behaviorPosts = getCommunityPosts(communityPosts, { feed: "인기글", board: "행동 고민" });

  assert.deepEqual(walkMetrics.map((metric) => metric.id), ["walk"]);
  assert.deepEqual(walkChart.series.map((series) => series.id), ["walk"]);
  assert.ok(behaviorPosts.every((post) => post.board === "행동 고민" && post.feeds.includes("인기글")));
});

test("스프린트 3: mock 저장소는 기록 CRUD와 프로필 정규화를 지원한다", () => {
  resetMockPetLogSnapshot();
  const detail = "저녁 산책 20분";
  const created = createMockRecord({
    category: "walk",
    detail,
    structured: structureRecord(detail, "walk"),
  });
  updateMockRecord(created.id, {
    category: "behavior",
    detail: "현관 앞에서 8분 기다림",
    structured: structureRecord("현관 앞에서 8분 기다림", "behavior"),
  });
  const updated = getMockPetLogSnapshot().records.find((record) => record.id === created.id);
  const profile = updateMockProfile({ ...petProfile, notes: ["  닭고기 알러지 의심  ", ""] });
  const deleted = deleteMockRecord(created.id);

  assert.equal(updated?.category, "behavior");
  assert.equal(updated?.title, "현관 앞에서 8분 기다림");
  assert.deepEqual(profile.notes, ["닭고기 알러지 의심"]);
  assert.equal(deleted, true);
});

test("스프린트 4: AI 기록 구조화와 안전 제안 문구를 유지한다", () => {
  const structured = structureRecord("아침 사료 45g 먹고 산책 20분 했어요.", "meal");
  const suggestions = getAiCareSuggestions([
    {
      ...records[0],
      category: "behavior",
      status: "alert",
      title: "현관 앞 불안",
      detail: "낑낑거림이 반복됨",
    },
  ]);

  assert.equal(structured.suggestedCategory, "meal");
  assert.deepEqual(
    structured.measurements.map((measurement) => measurement.value),
    ["45g", "20분"],
  );
  assert.ok(suggestions.some((suggestion) => suggestion.detail.includes("진단이 아닙니다")));
});

test("스프린트 5: MVP 이후 확장 범위는 문서에 분리되어 있다", () => {
  const plan = readFileSync(workspaceFile("_workspace/remaining-page-work.md"), "utf8");

  assert.ok(plan.includes("### 스프린트 5. MVP 이후 확장 정리"));
  assert.ok(plan.includes("지도, IoT, 지출 관리는 후순위 확장"));
  assert.ok(plan.includes("API, 백엔드, 데이터베이스 전환"));
});
