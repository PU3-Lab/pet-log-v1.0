export type RecordCategory = "meal" | "walk" | "stool" | "medical" | "behavior";

export type RecordStatus = "normal" | "notice" | "alert";

export type ExtractedMeasurement = {
  label: string;
  value: string;
};

export type StructuredRecord = {
  sourceText: string;
  normalizedSummary: string;
  suggestedCategory: RecordCategory;
  confidence: number;
  measurements: ExtractedMeasurement[];
  needsConfirmation: boolean;
};

export type PetProfile = {
  name: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  birthday: string;
  personality: string;
  notes: string[];
};

export type RecordEntry = {
  id: string;
  time: string;
  date: string;
  category: RecordCategory;
  title: string;
  detail: string;
  status: RecordStatus;
  structured?: StructuredRecord;
};

export type SuggestionCategory = "행동" | "건강" | "생활";

export type SuggestionTone = "green" | "orange" | "blue";

export type Suggestion = {
  id: string;
  category: SuggestionCategory;
  title: string;
  detail: string;
  action: string;
  actionHref: string;
  tone: SuggestionTone;
};

export type MetricSeries = {
  id: "meal" | "activity" | "weight";
  label: string;
  unit: string;
  values: number[];
  trend: string;
};

export type CommunityBoard = "유기동물" | "용품 나눔" | "자유게시판" | "행동 고민" | "후기";

export type CommunityFeed = "인기글" | "최신글" | "내 주변";

export type CommunityPost = {
  id: string;
  board: CommunityBoard;
  title: string;
  comments: number;
  likes: number;
  distance?: string;
  feeds: CommunityFeed[];
};
