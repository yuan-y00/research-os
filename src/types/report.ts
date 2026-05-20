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

export interface ReportMetric { label: string; value: string; note?: string; }
export interface ReportTimelineItem { time: string; event: string; detail: string; impact: string; }
export interface FounderItem { name: string; background: string; initialResource: string; }
export interface RevenueItem { source: string; scale: string; shareOrNote: string; }
export interface UnitEconomicsItem { metric: string; value: string; }
export interface CompetitiveMatrixRow { dimension: string; self: string; competitors: Array<{ name: string; value: string; }>; }
export interface DeepInsight { title: string; evidenceSummary: string; explanation: string; comparison?: string; sources?: string[]; }
export interface DeepRisk { title: string; evidenceSummary: string; explanation: string; competitorLesson?: string; sources?: string[]; }
export interface PersonaItem { dimension: string; profile: string; }
export interface ComplaintItem { type: string; shareOrFrequency: string; example: string; }
export interface ReviewQuote { quote: string; source: string; note?: string; }
export interface SatisfactionMetric { metric: string; data: string; meaning: string; }
export interface EvidenceItem { claim: string; evidence: string; sourceTitle: string; publisher?: string; url?: string; reliability?: "high" | "medium" | "low" | "unknown"; note?: string; }
export interface KeyConclusion { title: string; explanation: string; }

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
  heroMetrics?: ReportMetric[];
  timeline?: ReportTimelineItem[];
  founders?: FounderItem[];
  growthMetrics?: ReportMetric[];
  revenueStructure?: RevenueItem[];
  unitEconomics?: UnitEconomicsItem[];
  competitiveMatrix?: { competitors: string[]; rows: CompetitiveMatrixRow[]; };
  deepSuccessFactors?: DeepInsight[];
  deepRisks?: DeepRisk[];
  persona?: PersonaItem[];
  ratingSnapshot?: { platform: string; score: string; ratingText?: string; sampleNote?: string; distribution?: Array<{ label: string; value: string; }>; };
  complaints?: ComplaintItem[];
  positiveReviews?: ReviewQuote[];
  satisfactionMetrics?: SatisfactionMetric[];
  coreData?: UnitEconomicsItem[];
  keyConclusions?: KeyConclusion[];
  evidenceItems?: EvidenceItem[];
  uncertainties?: string[];
  legacySections?: Array<{ eyebrow?: string; title: string; html?: string; }>;
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
