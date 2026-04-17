import type { CompanyProfile, Employee, ProductCatalogItem, RiskFlag } from "@/types";

export const companyProfile: CompanyProfile = {
  name: "경기도경제과학진흥원",
  industry: "IT",
  employeeCount: 247,
  pensionType: "DC형",
  provider: "KB국민은행"
};

export const productCatalog: ProductCatalogItem[] = [
  {
    name: "미래에셋글로벌주식펀드",
    category: "equity",
    returnRate: 11.2,
    feeRate: 0.8,
    riskLevel: 4
  },
  {
    name: "KB한국성장주펀드",
    category: "equity",
    returnRate: 9.5,
    feeRate: 0.65,
    riskLevel: 4
  },
  {
    name: "삼성채권안정펀드",
    category: "bond",
    returnRate: 3.8,
    feeRate: 0.25,
    riskLevel: 2
  },
  {
    name: "한국밸류EMP혼합",
    category: "mixed",
    returnRate: 6.1,
    feeRate: 0.55,
    riskLevel: 3
  },
  {
    name: "미래에셋전략배분TDF2045",
    category: "tdf",
    returnRate: 7.3,
    feeRate: 0.45,
    riskLevel: 3
  },
  {
    name: "KB온국민TDF2035",
    category: "tdf",
    returnRate: 5.8,
    feeRate: 0.4,
    riskLevel: 2
  },
  {
    name: "KB국민은행 정기예금",
    category: "deposit",
    returnRate: 3.5,
    feeRate: 0,
    riskLevel: 1
  },
  {
    name: "삼성생명 원리금보장보험",
    category: "deposit",
    returnRate: 3.2,
    feeRate: 0.1,
    riskLevel: 1
  },
  {
    name: "신한고수수료글로벌펀드",
    category: "equity",
    returnRate: 8,
    feeRate: 1.3,
    riskLevel: 4
  },
  {
    name: "NH올시즌EMP",
    category: "mixed",
    returnRate: 5.5,
    feeRate: 0.5,
    riskLevel: 3
  }
];

const flagLabels: Record<RiskFlag, string> = {
  risk_asset_over: "위험자산 비중 과다",
  high_fee: "수수료 부담",
  low_return: "수익률 부진",
  no_diversification: "분산 부족",
  age_mismatch: "연령 대비 부적합"
};

export const riskFlagLabels = flagLabels;

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "김민수",
    department: "개발",
    joinDate: "2018-03-05",
    birthYear: 1990,
    balance: 82_000_000,
    monthlyContribution: 680_000,
    returnRate: 12.3,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋글로벌주식펀드",
        category: "equity",
        allocation: 40,
        returnRate: 11.2,
        feeRate: 0.8,
        riskLevel: 4
      },
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 30,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 30,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-002",
    name: "박지영",
    department: "영업",
    joinDate: "2016-09-12",
    birthYear: 1985,
    balance: 31_000_000,
    monthlyContribution: 510_000,
    returnRate: 1.2,
    riskFlags: ["low_return", "no_diversification"],
    portfolio: [
      {
        productName: "삼성생명 원리금보장보험",
        category: "deposit",
        allocation: 100,
        returnRate: 3.2,
        feeRate: 0.1,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-003",
    name: "이준호",
    department: "마케팅",
    joinDate: "2020-01-20",
    birthYear: 1992,
    balance: 56_000_000,
    monthlyContribution: 570_000,
    returnRate: 8.1,
    riskFlags: ["risk_asset_over"],
    portfolio: [
      {
        productName: "미래에셋글로벌주식펀드",
        category: "equity",
        allocation: 45,
        returnRate: 11.2,
        feeRate: 0.8,
        riskLevel: 4
      },
      {
        productName: "KB한국성장주펀드",
        category: "equity",
        allocation: 40,
        returnRate: 9.5,
        feeRate: 0.65,
        riskLevel: 4
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 15,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-004",
    name: "정수진",
    department: "재무",
    joinDate: "2017-07-03",
    birthYear: 1988,
    balance: 68_000_000,
    monthlyContribution: 620_000,
    returnRate: 3.5,
    riskFlags: ["high_fee"],
    portfolio: [
      {
        productName: "신한고수수료글로벌펀드",
        category: "equity",
        allocation: 80,
        returnRate: 8,
        feeRate: 1.3,
        riskLevel: 4
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 20,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-005",
    name: "최영미",
    department: "인사",
    joinDate: "2014-04-01",
    birthYear: 1967,
    balance: 180_000_000,
    monthlyContribution: 900_000,
    returnRate: 7.2,
    riskFlags: ["age_mismatch"],
    portfolio: [
      {
        productName: "미래에셋글로벌주식펀드",
        category: "equity",
        allocation: 35,
        returnRate: 11.2,
        feeRate: 0.8,
        riskLevel: 4
      },
      {
        productName: "한국밸류EMP혼합",
        category: "mixed",
        allocation: 25,
        returnRate: 6.1,
        feeRate: 0.55,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 20,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 20,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-006",
    name: "한동우",
    department: "개발",
    joinDate: "2024-01-08",
    birthYear: 2000,
    balance: 4_500_000,
    monthlyContribution: 280_000,
    returnRate: 4.8,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 100,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      }
    ]
  },
  {
    id: "emp-007",
    name: "오세린",
    department: "개발",
    joinDate: "2019-06-10",
    birthYear: 1995,
    balance: 49_000_000,
    monthlyContribution: 540_000,
    returnRate: 6.4,
    riskFlags: [],
    portfolio: [
      {
        productName: "KB한국성장주펀드",
        category: "equity",
        allocation: 35,
        returnRate: 9.5,
        feeRate: 0.65,
        riskLevel: 4
      },
      {
        productName: "NH올시즌EMP",
        category: "mixed",
        allocation: 25,
        returnRate: 5.5,
        feeRate: 0.5,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 20,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 20,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-008",
    name: "윤태호",
    department: "영업",
    joinDate: "2015-11-02",
    birthYear: 1983,
    balance: 73_000_000,
    monthlyContribution: 700_000,
    returnRate: 2.8,
    riskFlags: ["low_return"],
    portfolio: [
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 70,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 30,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-009",
    name: "송하늘",
    department: "디자인",
    joinDate: "2021-08-17",
    birthYear: 1994,
    balance: 27_000_000,
    monthlyContribution: 430_000,
    returnRate: 5.9,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 50,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      },
      {
        productName: "KB한국성장주펀드",
        category: "equity",
        allocation: 20,
        returnRate: 9.5,
        feeRate: 0.65,
        riskLevel: 4
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 30,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-010",
    name: "강도윤",
    department: "운영",
    joinDate: "2013-02-14",
    birthYear: 1979,
    balance: 95_000_000,
    monthlyContribution: 760_000,
    returnRate: 4.1,
    riskFlags: ["age_mismatch"],
    portfolio: [
      {
        productName: "KB한국성장주펀드",
        category: "equity",
        allocation: 45,
        returnRate: 9.5,
        feeRate: 0.65,
        riskLevel: 4
      },
      {
        productName: "NH올시즌EMP",
        category: "mixed",
        allocation: 25,
        returnRate: 5.5,
        feeRate: 0.5,
        riskLevel: 3
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-011",
    name: "배수현",
    department: "고객성공",
    joinDate: "2022-03-21",
    birthYear: 1996,
    balance: 18_000_000,
    monthlyContribution: 390_000,
    returnRate: 6.7,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 60,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 20,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 20,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-012",
    name: "서민재",
    department: "개발",
    joinDate: "2012-05-07",
    birthYear: 1987,
    balance: 112_000_000,
    monthlyContribution: 820_000,
    returnRate: 9.4,
    riskFlags: ["risk_asset_over"],
    portfolio: [
      {
        productName: "미래에셋글로벌주식펀드",
        category: "equity",
        allocation: 50,
        returnRate: 11.2,
        feeRate: 0.8,
        riskLevel: 4
      },
      {
        productName: "KB한국성장주펀드",
        category: "equity",
        allocation: 30,
        returnRate: 9.5,
        feeRate: 0.65,
        riskLevel: 4
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 20,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-013",
    name: "문지후",
    department: "재무",
    joinDate: "2020-10-05",
    birthYear: 1991,
    balance: 41_000_000,
    monthlyContribution: 470_000,
    returnRate: 5.1,
    riskFlags: ["high_fee"],
    portfolio: [
      {
        productName: "신한고수수료글로벌펀드",
        category: "equity",
        allocation: 40,
        returnRate: 8,
        feeRate: 1.3,
        riskLevel: 4
      },
      {
        productName: "NH올시즌EMP",
        category: "mixed",
        allocation: 30,
        returnRate: 5.5,
        feeRate: 0.5,
        riskLevel: 3
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-014",
    name: "장예린",
    department: "인사",
    joinDate: "2023-04-03",
    birthYear: 1998,
    balance: 12_000_000,
    monthlyContribution: 340_000,
    returnRate: 3.9,
    riskFlags: ["no_diversification"],
    portfolio: [
      {
        productName: "KB온국민TDF2035",
        category: "tdf",
        allocation: 100,
        returnRate: 5.8,
        feeRate: 0.4,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-015",
    name: "류현석",
    department: "영업",
    joinDate: "2011-12-26",
    birthYear: 1981,
    balance: 126_000_000,
    monthlyContribution: 850_000,
    returnRate: 6.2,
    riskFlags: [],
    portfolio: [
      {
        productName: "한국밸류EMP혼합",
        category: "mixed",
        allocation: 35,
        returnRate: 6.1,
        feeRate: 0.55,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 35,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-016",
    name: "임가은",
    department: "마케팅",
    joinDate: "2018-08-27",
    birthYear: 1993,
    balance: 58_000_000,
    monthlyContribution: 560_000,
    returnRate: 7.8,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋글로벌주식펀드",
        category: "equity",
        allocation: 30,
        returnRate: 11.2,
        feeRate: 0.8,
        riskLevel: 4
      },
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 40,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 30,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      }
    ]
  },
  {
    id: "emp-017",
    name: "조은호",
    department: "운영",
    joinDate: "2010-06-01",
    birthYear: 1976,
    balance: 138_000_000,
    monthlyContribution: 880_000,
    returnRate: 2.4,
    riskFlags: ["low_return", "no_diversification"],
    portfolio: [
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 90,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      },
      {
        productName: "삼성생명 원리금보장보험",
        category: "deposit",
        allocation: 10,
        returnRate: 3.2,
        feeRate: 0.1,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-018",
    name: "신예은",
    department: "디자인",
    joinDate: "2024-02-19",
    birthYear: 1999,
    balance: 7_000_000,
    monthlyContribution: 290_000,
    returnRate: 5.4,
    riskFlags: [],
    portfolio: [
      {
        productName: "미래에셋전략배분TDF2045",
        category: "tdf",
        allocation: 70,
        returnRate: 7.3,
        feeRate: 0.45,
        riskLevel: 3
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-019",
    name: "백도현",
    department: "고객성공",
    joinDate: "2019-01-14",
    birthYear: 1989,
    balance: 52_000_000,
    monthlyContribution: 530_000,
    returnRate: 6.0,
    riskFlags: [],
    portfolio: [
      {
        productName: "NH올시즌EMP",
        category: "mixed",
        allocation: 40,
        returnRate: 5.5,
        feeRate: 0.5,
        riskLevel: 3
      },
      {
        productName: "삼성채권안정펀드",
        category: "bond",
        allocation: 30,
        returnRate: 3.8,
        feeRate: 0.25,
        riskLevel: 2
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  },
  {
    id: "emp-020",
    name: "허나경",
    department: "전략기획",
    joinDate: "2017-11-13",
    birthYear: 1986,
    balance: 64_000_000,
    monthlyContribution: 610_000,
    returnRate: 4.6,
    riskFlags: ["high_fee", "age_mismatch"],
    portfolio: [
      {
        productName: "신한고수수료글로벌펀드",
        category: "equity",
        allocation: 50,
        returnRate: 8,
        feeRate: 1.3,
        riskLevel: 4
      },
      {
        productName: "한국밸류EMP혼합",
        category: "mixed",
        allocation: 20,
        returnRate: 6.1,
        feeRate: 0.55,
        riskLevel: 3
      },
      {
        productName: "KB국민은행 정기예금",
        category: "deposit",
        allocation: 30,
        returnRate: 3.5,
        feeRate: 0,
        riskLevel: 1
      }
    ]
  }
];

export const departments = Array.from(
  new Set(employees.map((employee) => employee.department))
).sort((a, b) => a.localeCompare(b, "ko"));

export const riskFlagOptions = Object.entries(flagLabels).map(([value, label]) => ({
  value: value as RiskFlag,
  label
}));
