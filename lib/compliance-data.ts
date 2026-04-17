export interface ComplianceTask {
  id: string;
  category: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "overdue";
  dueLabel: string;
  owner: string;
}

export interface ComplianceLog {
  id: string;
  title: string;
  timestamp: string;
  detail: string;
}

export const complianceScore = 78;

export const complianceSummaryCards = [
  {
    label: "전체 준수율",
    value: "78점",
    helper: "핵심 의무 9개 중 6개 완료"
  },
  {
    label: "긴급 조치",
    value: "2건",
    helper: "이번 주 안에 처리 필요"
  },
  {
    label: "교육 이수율",
    value: "81%",
    helper: "미이수 47명 남음"
  },
  {
    label: "실물이전 대응",
    value: "진행 중",
    helper: "수탁사 협의 단계"
  }
];

export const complianceTasks: ComplianceTask[] = [
  {
    id: "task-1",
    category: "교육",
    title: "퇴직연금 연 1회 법정 교육",
    description: "미이수 직원 47명 대상 추가 교육 세션 편성 필요",
    status: "in_progress",
    dueLabel: "4월 26일까지",
    owner: "HR 운영팀"
  },
  {
    id: "task-2",
    category: "디폴트옵션",
    title: "사전지정운용제도 안내 현행화",
    description: "신규 입사자 안내 문구와 기본 선택 상품 설명 업데이트",
    status: "completed",
    dueLabel: "완료",
    owner: "인사기획"
  },
  {
    id: "task-3",
    category: "실물이전",
    title: "2024.10 실물이전 대응 프로세스 정비",
    description: "수탁사별 이관 절차와 내부 승인 흐름 문서화 필요",
    status: "pending",
    dueLabel: "5월 중",
    owner: "재무팀"
  },
  {
    id: "task-4",
    category: "수수료 점검",
    title: "고수수료 상품 대체안 검토",
    description: "고수수료 플래그 3명 대상 대체 상품 제안안 준비",
    status: "overdue",
    dueLabel: "지연 5일",
    owner: "퇴직연금 PM"
  },
  {
    id: "task-5",
    category: "리스크 관리",
    title: "위험자산 70% 초과 직원 사전 안내",
    description: "규제 한도 초과 가능 직원 2명에게 리밸런싱 가이드 발송",
    status: "overdue",
    dueLabel: "지연 2일",
    owner: "퇴직연금 PM"
  },
  {
    id: "task-6",
    category: "운영",
    title: "월간 현황 보고서 작성",
    description: "경영진 공유용 수익률/플래그/교육 현황 대시보드 정리",
    status: "completed",
    dueLabel: "완료",
    owner: "HR 데이터팀"
  }
];

export const complianceLogs: ComplianceLog[] = [
  {
    id: "log-1",
    title: "교육 리마인드 발송",
    timestamp: "2026-04-17 09:30",
    detail: "미이수 직원 47명에게 2차 리마인드 메일 발송"
  },
  {
    id: "log-2",
    title: "고수수료 상품 리스트 확정",
    timestamp: "2026-04-16 16:10",
    detail: "신한고수수료글로벌펀드 보유 직원 3명 추출 완료"
  },
  {
    id: "log-3",
    title: "실물이전 협의 일정 등록",
    timestamp: "2026-04-15 14:00",
    detail: "KB국민은행 담당자와 실물이전 대응 미팅 캘린더 등록"
  },
  {
    id: "log-4",
    title: "디폴트옵션 안내문 개정",
    timestamp: "2026-04-14 11:20",
    detail: "신규 입사자용 안내 PDF 문구 최신 버전으로 반영"
  }
];
