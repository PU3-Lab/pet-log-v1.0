import type {
  CareSchedule,
  CommunityBoard,
  CommunityPost,
  MetricSeries,
  PetProfile,
  RecordCategory,
  RecordEntry,
  Suggestion,
} from "./types";

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

export const schedules: CareSchedule[] = [
  {
    id: "schedule-vaccine",
    category: "vaccination",
    title: "종합백신 접종",
    dueDate: "2026-05-02",
    repeatLabel: "매년",
    note: "최근 컨디션 기록을 함께 확인하기",
    isDone: false,
  },
  {
    id: "schedule-heartworm",
    category: "medication",
    title: "심장사상충 약",
    dueDate: "2026-05-15",
    repeatLabel: "매월",
    note: "저녁 식사 후 복용",
    isDone: false,
  },
  {
    id: "schedule-grooming",
    category: "grooming",
    title: "눈가 미용",
    dueDate: "2026-05-25",
    repeatLabel: "필요할 때",
    note: "눈물 자국 상태 확인",
    isDone: false,
  },
];

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    category: "행동",
    title: "산책 시간이 줄었어요",
    detail: "최근 일주일간 산책 시간이 평균보다 18분 짧습니다. 짧은 산책을 2회로 나누어보세요.",
    action: "자세히 보기",
    actionHref: "/analysis",
    tone: "green",
  },
  {
    id: "s2",
    category: "건강",
    title: "체중 증가 추세",
    detail: "최근 4주간 체중이 조금씩 증가하고 있어요. 급여량과 간식 빈도를 함께 확인하세요.",
    action: "관리 가이드",
    actionHref: "/analysis",
    tone: "orange",
  },
  {
    id: "s3",
    category: "생활",
    title: "예방접종 시기 도래",
    detail: "종합백신 접종 시기가 3일 남았습니다. 알림을 확인하고 일정을 잡아보세요.",
    action: "일정 확인",
    actionHref: "/schedule",
    tone: "blue",
  },
];

export const metrics: MetricSeries[] = [
  { id: "meal", label: "식사량", unit: "g", values: [120, 98, 110, 105, 114, 108, 118], trend: "지난주 대비 +5%" },
  { id: "activity", label: "활동량", unit: "분", values: [42, 35, 28, 31, 24, 30, 26], trend: "지난주 대비 -10%" },
  { id: "weight", label: "체중", unit: "kg", values: [4.0, 4.0, 4.1, 4.1, 4.2, 4.2, 4.2], trend: "완만한 증가" },
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

export const communityBoards: CommunityBoard[] = ["유기동물", "용품 나눔", "자유게시판", "행동 고민", "후기"];

export const communityPosts: CommunityPost[] = [
  {
    id: "c1",
    board: "행동 고민",
    title: "말티즈 산책 줄면 쉽게 흥분하나요?",
    comments: 8,
    likes: 26,
    feeds: ["인기글", "최신글"],
  },
  {
    id: "c2",
    board: "용품 나눔",
    title: "소형견 하네스 나눔합니다",
    comments: 3,
    likes: 15,
    distance: "1.2km",
    feeds: ["인기글", "내 주변"],
  },
  {
    id: "c3",
    board: "자유게시판",
    title: "분리불안 어떻게 기록하고 계세요?",
    comments: 12,
    likes: 32,
    feeds: ["인기글"],
  },
  {
    id: "c4",
    board: "후기",
    title: "AI 제안대로 산책을 나눠본 후기",
    comments: 5,
    likes: 18,
    feeds: ["최신글"],
  },
  {
    id: "c5",
    board: "유기동물",
    title: "근처 임시 보호 정보 공유합니다",
    comments: 4,
    likes: 21,
    distance: "2.4km",
    feeds: ["내 주변", "최신글"],
  },
];
