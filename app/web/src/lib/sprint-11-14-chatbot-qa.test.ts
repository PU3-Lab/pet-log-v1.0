import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  appendMockChatbotExchange,
  getMockChatbotThreads,
  getMockPetLogSnapshot,
  resetMockPetLogSnapshot,
  updateMockReadNotifications,
} from "./server/mock-pet-log-store";

function workspaceFile(path: string) {
  return join(process.cwd(), "..", "..", path);
}

test("스프린트 11: 홈 챗봇 목업 질문은 대화방 교환으로 저장될 수 있다", () => {
  resetMockPetLogSnapshot();
  const exchange = appendMockChatbotExchange(undefined, "오늘 산책 줄여도 돼?", {
    answer: "최근 기록을 보고 짧게 나누는 것을 권장합니다.",
    referencedRecordIds: ["r2"],
    safetyNotice: "진단이 아닙니다.",
  });

  assert.equal(exchange?.userMessage.role, "user");
  assert.equal(exchange?.assistantMessage.role, "assistant");
  assert.equal(getMockChatbotThreads()[0]?.messages.length, 2);
});

test("스프린트 12: 모바일 UI QA 산출물이 핵심 화면과 오버플로 결과를 기록한다", () => {
  const report = readFileSync(workspaceFile("_workspace/mobile-ui-qa-report.md"), "utf8");

  assert.ok(report.includes("홈, 기록 입력, 분석, 타임라인, 프로필, 병원 연계, 쇼핑"));
  assert.ok(report.includes("가로 오버플로가 발생하지 않았습니다"));
  assert.ok(report.includes("홈 챗봇 바텀시트"));
});

test("스프린트 13: mock API 전환용 서버 스냅샷은 앱 초기 상태와 읽음 상태를 제공한다", () => {
  resetMockPetLogSnapshot();
  const snapshot = getMockPetLogSnapshot();
  const readIds = updateMockReadNotifications(["missing-stool", "missing-stool", 1 as unknown as string]);

  assert.equal(snapshot.version, 1);
  assert.ok(snapshot.records.length > 0);
  assert.ok(snapshot.schedules.length > 0);
  assert.deepEqual(readIds, ["missing-stool"]);
});

test("스프린트 14: 모바일 QA 기준 뷰포트와 산출물 위치가 문서화되어 있다", () => {
  const report = readFileSync(workspaceFile("_workspace/mobile-ui-qa-report.md"), "utf8");

  assert.ok(report.includes("320x740"));
  assert.ok(report.includes("375x812"));
  assert.ok(report.includes("430x932"));
  assert.ok(report.includes("_workspace/qa-screenshots/"));
});
