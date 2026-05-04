import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getAiInsights } from "./ai-insights";
import { records } from "./mock-data";
import {
  appendMockChatbotExchange,
  createMockChatbotThread,
  getMockChatbotThreads,
  getMockPetLogSnapshot,
  resetMockPetLogSnapshot,
} from "./server/mock-pet-log-store";
import { createPetLogChatbotMessage, createPetLogStructuredRecord } from "./server/pet-log-ai-service";

function restoreProvider(previousProvider: string | undefined) {
  if (previousProvider === undefined) {
    delete process.env.PET_LOG_AI_PROVIDER;
  } else {
    process.env.PET_LOG_AI_PROVIDER = previousProvider;
  }
}

test("스프린트 15: 서버 AI service mock provider는 안전 안내와 참고 기록을 반환한다", async () => {
  const previousProvider = process.env.PET_LOG_AI_PROVIDER;
  process.env.PET_LOG_AI_PROVIDER = "mock";

  try {
    const result = await createPetLogChatbotMessage({
      question: "최근 행동 괜찮아?",
      contextRecordIds: ["r5"],
      snapshot: getMockPetLogSnapshot(),
    });

    assert.ok(result.answer.includes("최근 행동 괜찮아?"));
    assert.deepEqual(result.referencedRecordIds, ["r5"]);
    assert.ok(result.safetyNotice.includes("진단이 아닙니다"));
  } finally {
    restoreProvider(previousProvider);
  }
});

test("스프린트 16: 모바일 주요 라우트와 앱 아이콘 파일이 유지된다", () => {
  const routes = ["", "record", "timeline", "analysis", "suggestions", "profile", "shared-care", "hospital", "shopping", "more"];
  const routeExists = routes.every((route) => {
    const path = route ? `src/app/${route}/page.tsx` : "src/app/page.tsx";
    return existsSync(join(process.cwd(), path));
  });

  assert.equal(routeExists, true);
  assert.ok(existsSync(join(process.cwd(), "src/app/icon.svg")));
});

test("스프린트 17: 챗봇 대화방 API 경계는 지정 thread에 메시지를 누적한다", () => {
  resetMockPetLogSnapshot();
  const thread = createMockChatbotThread("주의 기록 상담");
  const exchange = appendMockChatbotExchange(thread.id, "현관 앞 기다림이 늘었어", {
    answer: "반복 여부를 이어서 기록하세요.",
    referencedRecordIds: ["r5"],
    safetyNotice: "진단이 아닙니다.",
  });
  const threads = getMockChatbotThreads();

  assert.equal(exchange?.thread.id, thread.id);
  assert.equal(threads[0]?.id, thread.id);
  assert.deepEqual(threads[0]?.messages.map((message) => message.role), ["user", "assistant"]);
});

test("스프린트 18: 기록 구조화는 서버 AI provider 경계를 통해 mock 결과를 반환한다", async () => {
  const previousProvider = process.env.PET_LOG_AI_PROVIDER;
  process.env.PET_LOG_AI_PROVIDER = "mock";

  try {
    const structured = await createPetLogStructuredRecord({
      detail: "아침 사료 45g 먹고 산책 20분 했어요.",
      fallbackCategory: "meal",
    });
    const insights = getAiInsights([
      {
        ...records[0],
        category: "meal",
        status: "normal",
      },
    ]);

    assert.equal(structured.suggestedCategory, "meal");
    assert.deepEqual(
      structured.measurements.map((measurement) => measurement.value),
      ["45g", "20분"],
    );
    assert.ok(insights.some((insight) => insight.id === "missing-stool" || insight.id === "missing-walk"));
  } finally {
    restoreProvider(previousProvider);
  }
});
