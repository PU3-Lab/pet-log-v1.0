import axios from "axios";
import type { PetLogSnapshot } from "@/lib/api-client";
import type { PetProfile, RecordEntry } from "@/lib/types";

export type PetLogAiProviderId = "mock" | "openai";

export type ChatbotMessageResult = {
  answer: string;
  referencedRecordIds: string[];
  safetyNotice: string;
};

type CreateChatbotMessageInput = {
  question: string;
  contextRecordIds?: string[];
  snapshot: PetLogSnapshot;
};

type OpenAiResponsesResult = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{
      text?: unknown;
    }>;
  }>;
};

const safetyNotice =
  "이 답변은 저장된 기록 기반 참고 안내이며 진단이 아닙니다. 증상이 지속되거나 심해지면 병원 상담을 권장합니다.";

function getProviderId(): PetLogAiProviderId {
  return process.env.PET_LOG_AI_PROVIDER === "openai" ? "openai" : "mock";
}

function selectReferenceRecords(records: RecordEntry[], contextRecordIds: string[] = []) {
  if (contextRecordIds.length > 0) {
    return records.filter((record) => contextRecordIds.includes(record.id)).slice(0, 3);
  }

  return records.slice(0, 3);
}

function createMockChatbotMessage(question: string, referencedRecords: RecordEntry[]): ChatbotMessageResult {
  const trimmedQuestion = question.trim();
  const latestRecord = referencedRecords[0];
  const recordHint = latestRecord
    ? `최근 "${latestRecord.title}" 기록을 함께 봤습니다.`
    : "아직 참고할 최근 기록이 많지 않습니다.";

  return {
    answer: `${trimmedQuestion || "질문"}에 대해 확인했어요. ${recordHint} 지금 단계에서는 기록을 이어서 남기고 변화가 반복되는지 보는 것이 좋습니다.`,
    referencedRecordIds: referencedRecords.map((record) => record.id),
    safetyNotice,
  };
}

function createOpenAiPrompt(profile: PetProfile, question: string, referencedRecords: RecordEntry[]) {
  const records = referencedRecords.map((record) => ({
    id: record.id,
    date: record.date,
    time: record.time,
    category: record.category,
    title: record.title,
    detail: record.detail,
    status: record.status,
    structured: record.structured,
  }));

  return [
    `반려동물: ${profile.name} / ${profile.breed} / ${profile.age} / ${profile.weight}`,
    `보호자 질문: ${question.trim()}`,
    `최근 참고 기록 JSON: ${JSON.stringify(records)}`,
    "한국어로 2~4문장만 답하세요.",
  ].join("\n");
}

function extractOpenAiText(result: OpenAiResponsesResult) {
  if (typeof result.output_text === "string" && result.output_text.trim()) {
    return result.output_text.trim();
  }

  const text = result.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .join(" ")
    .trim();

  return text || "";
}

async function createOpenAiChatbotMessage(
  question: string,
  profile: PetProfile,
  referencedRecords: RecordEntry[],
): Promise<ChatbotMessageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when PET_LOG_AI_PROVIDER=openai");
  }

  const endpoint = process.env.PET_LOG_OPENAI_RESPONSES_URL ?? "https://api.openai.com/v1/responses";
  const model = process.env.PET_LOG_OPENAI_MODEL ?? "gpt-4o-mini";
  const response = await axios.post<OpenAiResponsesResult>(
    endpoint,
    {
      model,
      instructions:
        "너는 Pet Log의 반려동물 케어 보조 AI입니다. 저장된 기록만 근거로 삼고, 확정 진단이나 처방을 하지 마세요. 이상 증상이 지속, 악화, 반복되면 병원 상담을 권장하세요.",
      input: createOpenAiPrompt(profile, question, referencedRecords),
    },
    {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    },
  );

  const answer = extractOpenAiText(response.data);
  if (!answer) {
    throw new Error("OpenAI response did not include answer text");
  }

  return {
    answer,
    referencedRecordIds: referencedRecords.map((record) => record.id),
    safetyNotice,
  };
}

export async function createPetLogChatbotMessage(input: CreateChatbotMessageInput): Promise<ChatbotMessageResult> {
  const referencedRecords = selectReferenceRecords(input.snapshot.records, input.contextRecordIds);

  if (getProviderId() !== "openai") {
    return createMockChatbotMessage(input.question, referencedRecords);
  }

  try {
    return await createOpenAiChatbotMessage(input.question, input.snapshot.profile, referencedRecords);
  } catch {
    return createMockChatbotMessage(input.question, referencedRecords);
  }
}
