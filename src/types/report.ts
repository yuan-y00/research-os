export type ReportType =
  | "brand"
  | "founder"
  | "product"
  | "company"
  | "crowdfunding"
  | "industry_event";

export interface KPI {
  label: string;
  value: string;
  note?: string;
}

export interface OriginStory {
  title: string;
  marketProblem: string;
  foundingContext: string;
  firstVersion: string;
  nonConsensusInsight: string;
}

export interface Innovation {
  type: string;
  insight: string;
  evidence: string;
}

export interface BreakoutMoment {
  period: string;
  trigger: string;
  whyNow: string;
  growthFlywheel: string;
}

export interface CustomerImpact {
  area: string;
  impact: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
}

export interface EcosystemImpact {
  area: string;
  impact: string;
  evidence: string;
  dataAvailability: "public_data" | "partial_data" | "no_reliable_data";
}

export interface BusinessModel {
  customers: string;
  revenue: string;
  marginLogic: string;
  repeatPurchase: string;
  channels: string;
  scalability: string;
}

export interface Competitor {
  competitor: string;
  position: string;
  strength: string;
  weakness: string;
}

export interface WhatWorked {
  insight: string;
  evidence: string;
  whyItMatters: string;
}

export interface Risk {
  risk: string;
  evidence: string;
  severity: "low" | "medium" | "high";
  fixability: "easy" | "hard" | "unclear";
}

export interface Lesson {
  lesson: string;
  application: string;
  caution: string;
}

export interface FinalJudgment {
  learnable: string;
  copyable: string;
  investable: string;
  threeYearView: string;
  biggestOpportunity: string;
  biggestRisk: string;
}

export interface Source {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

export interface ResearchReport {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: ReportType;
  subject: string;
  country?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  verdict: string;
  tags: string[];
  kpis: KPI[];
  originStory: OriginStory;
  initialInnovation: Innovation[];
  breakoutMoment: BreakoutMoment;
  customerImpact: CustomerImpact[];
  ecosystemImpact: EcosystemImpact[];
  businessModel: BusinessModel;
  competitiveLandscape: Competitor[];
  whatWorked: WhatWorked[];
  risks: Risk[];
  lessonsForBuilders: Lesson[];
  finalJudgment: FinalJudgment;
  sources: Source[];
}

export interface WatchlistItem {
  id: string;
  name: string;
  type: ReportType;
  priority: number;
  keywords: string[];
  researchAngles: string[];
  lastResearchedAt: string | null;
}

export interface DailyState {
  lastRunAt: string | null;
  lastTargetId: string | null;
  history: Array<{
    date: string;
    targetId: string;
    reportId: string;
  }>;
}
