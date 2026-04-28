export type RecordCategory = "meal" | "walk" | "stool" | "medical" | "behavior";

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
  status: "normal" | "notice" | "alert";
};

export type Suggestion = {
  id: string;
  category: "행동" | "건강" | "생활";
  title: string;
  detail: string;
  action: string;
  tone: "green" | "orange" | "blue";
};

export type MetricSeries = {
  label: string;
  unit: string;
  values: number[];
  trend: string;
};

export const petProfile: PetProfile = {
  name: "코코",
  breed: "말티즈",
  age: "3살",
  sex: "중성화 남아",
  weight: "4.2kg",
  birthday: "2021.02.10",
  personality: "활발하고 사람을 좋아해요",
  notes: ["분리불안 있음", "닭고기 알러지 의심", "실내 배변 선호"],
};

export const records: RecordEntry[] = [
  {
    id: "r1",
    date: "4월 17일",
    time: "09:00",
    category: "meal",
    title: "아침 50g, 간식 조금",
    detail: "사료를 평소보다 천천히 먹었고 10g 정도 남겼어요.",
    status: "notice",
  },
  {
    id: "r2",
    date: "4월 17일",
    time: "10:30",
    category: "walk",
    title: "산책 20분",
    detail: "평소보다 자주 멈췄지만 컨디션은 안정적이에요.",
    status: "notice",
  },
  {
    id: "r3",
    date: "4월 17일",
    time: "21:30",
    category: "stool",
    title: "정상, 1회",
    detail: "색과 형태가 평소 범위 안에 있어요.",
    status: "normal",
  },
  {
    id: "r4",
    date: "4월 18일",
    time: "14:20",
    category: "medical",
    title: "심장사상충 약 복용",
    detail: "월간 복용 기록이 정상적으로 추가됐어요.",
    status: "normal",
  },
  {
    id: "r5",
    date: "4월 18일",
    time: "20:10",
    category: "behavior",
    title: "현관 앞에서 기다림",
    detail: "보호자가 외출 준비를 시작하자 낑낑거림이 8분 정도 지속됐어요.",
    status: "alert",
  },
];

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    category: "행동",
    title: "산책 시간이 줄었어요",
    detail: "최근 일주일간 산책 시간이 평균보다 18분 짧습니다. 짧은 산책을 2회로 나누어보세요.",
    action: "자세히 보기",
    tone: "green",
  },
  {
    id: "s2",
    category: "건강",
    title: "체중 증가 추세",
    detail: "최근 4주간 체중이 조금씩 증가하고 있어요. 급여량과 간식 빈도를 함께 확인하세요.",
    action: "관리 가이드",
    tone: "orange",
  },
  {
    id: "s3",
    category: "생활",
    title: "예방접종 시기 도래",
    detail: "종합백신 접종 시기가 3일 남았습니다. 알림을 확인하고 일정을 잡아보세요.",
    action: "일정 확인",
    tone: "blue",
  },
];

export const metrics: MetricSeries[] = [
  { label: "식사량", unit: "g", values: [120, 98, 110, 105, 114, 108, 118], trend: "지난주 대비 +5%" },
  { label: "활동량", unit: "분", values: [42, 35, 28, 31, 24, 30, 26], trend: "지난주 대비 -10%" },
  { label: "체중", unit: "kg", values: [4.0, 4.0, 4.1, 4.1, 4.2, 4.2, 4.2], trend: "완만한 증가" },
];

export const todos = [
  "오늘 배변 상태 기록하기",
  "저녁 짧은 산책 15분",
  "사료 변경 시기 확인",
];

export const categoryLabels: Record<RecordCategory, string> = {
  meal: "식사",
  walk: "산책",
  stool: "배변",
  medical: "병원/접종",
  behavior: "행동",
};
