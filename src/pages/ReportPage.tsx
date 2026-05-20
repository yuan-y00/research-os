import { useState } from 'react'
import { ResearchReport } from '../types/report'
import { formatDate } from '../utils/formatDate'
import { clampText, firstSentence, summarizeList, hasLongText } from '../utils/text'
import { READING_LIMITS } from '../utils/readingRules'
import { estimateReadingTimeCN } from '../utils/readingTime'
import { ExpandableSection } from '../components/report/ExpandableSection'
import { InsightCard } from '../components/report/InsightCard'

// ── Props ──────────────────────────────────────────────────────────

interface Props {
  report: ResearchReport
  onBack: () => void
}

// ── Helpers ────────────────────────────────────────────────────────

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    brand: '品牌研究',
    founder: '创始人',
    product: '产品研究',
    company: '公司研究',
    crowdfunding: '众筹分析',
    industry_event: '行业事件',
  }
  return map[type] || type
}

function getSeverityLabel(s: string): string {
  return s === 'high' ? '高风险' : s === 'medium' ? '中风险' : '低风险'
}

function buildReportText(report: ResearchReport): string {
  const parts: string[] = []
  parts.push(report.title, report.subtitle, report.verdict, report.summary)
  const os = report.originStory
  if (os) {
    parts.push(os.marketProblem, os.foundingContext, os.firstVersion, os.nonConsensusInsight)
  }
  ;(report.initialInnovation || []).forEach((inv) => parts.push(inv.insight, inv.evidence))
  const bm = report.breakoutMoment
  if (bm) parts.push(bm.trigger, bm.whyNow, bm.growthFlywheel)
  ;(report.customerImpact || []).forEach((ci) => parts.push(ci.impact, ci.evidence))
  ;(report.ecosystemImpact || []).forEach((ei) => parts.push(ei.impact, ei.evidence))
  const biz = report.businessModel
  if (biz)
    parts.push(biz.customers, biz.revenue, biz.marginLogic, biz.repeatPurchase, biz.channels, biz.scalability)
  ;(report.whatWorked || []).forEach((ww) => parts.push(ww.insight))
  ;(report.risks || []).forEach((r) => parts.push(r.risk))
  ;(report.lessonsForBuilders || []).forEach((l) => parts.push(l.lesson, l.application, l.caution))
  const fj = report.finalJudgment
  if (fj) parts.push(fj.learnable, fj.copyable, fj.investable, fj.threeYearView, fj.biggestOpportunity, fj.biggestRisk)
  ;(report.sources || []).forEach((s) => parts.push(s.title))
  return parts.filter(Boolean).join('\n')
}

// ── Shared style tokens ────────────────────────────────────────────

const T = {
  surface: 'var(--surface)',
  line: 'var(--line)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  faint: 'var(--faint)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  surfaceSoft: 'var(--surface-soft)',
  green: 'var(--green)',
  greenSoft: 'var(--green-soft)',
  red: 'var(--red)',
  redSoft: 'var(--red-soft)',
}

const sans: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const sectionGap: React.CSSProperties = { marginTop: 56 }

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: T.text,
  marginBottom: 24,
  paddingBottom: 10,
  borderBottom: `1px solid ${T.line}`,
}

const subTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: T.text,
  marginBottom: 16,
  marginTop: 32,
}

const cardSheet: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.line}`,
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}

const fieldLabel: React.CSSProperties = {
  ...sans,
  fontSize: 12,
  fontWeight: 600,
  color: T.faint,
  marginBottom: 4,
  letterSpacing: '0.03em',
}

// ── SECTION: Reading Top Bar ───────────────────────────────────────

function ReadingTopBar({
  report,
  readingMode,
  onToggleMode,
  onBack,
}: {
  report: ResearchReport
  readingMode: 'brief' | 'deep'
  onToggleMode: () => void
  onBack: () => void
}) {
  const rt = estimateReadingTimeCN(buildReportText(report))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        marginBottom: 32,
        borderBottom: `1px solid ${T.line}`,
        ...sans,
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 14,
          color: T.muted,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        &larr; 返回
      </button>

      <span style={{ fontSize: 13, color: T.faint }}>{rt}</span>

      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={readingMode === 'deep' ? onToggleMode : undefined}
          style={modePill(readingMode === 'brief')}
        >
          简洁阅读
        </button>
        <button
          onClick={readingMode === 'brief' ? onToggleMode : undefined}
          style={modePill(readingMode === 'deep')}
        >
          深度阅读
        </button>
      </div>
    </div>
  )
}

function modePill(active: boolean): React.CSSProperties {
  return {
    ...sans,
    padding: '4px 14px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? T.text : T.faint,
    background: active ? T.surfaceSoft : 'transparent',
    border: active ? `1px solid ${T.line}` : '1px solid transparent',
    cursor: 'pointer',
  }
}

// ── SECTION: Report Cover ──────────────────────────────────────────

function ReportCover({ report }: { report: ResearchReport }) {
  return (
    <div>
      <span
        style={{
          ...sans,
          display: 'inline-block',
          padding: '3px 12px',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 500,
          background: T.accentSoft,
          color: T.accent,
          marginBottom: 16,
        }}
      >
        {getTypeLabel(report.type)}
      </span>

      <h1
        style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: T.text,
          marginBottom: 12,
          maxWidth: 760,
        }}
      >
        {report.title}
      </h1>

      {report.subtitle && (
        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            color: T.muted,
            lineHeight: 1.6,
            marginBottom: 16,
            maxWidth: 680,
          }}
        >
          {clampText(report.subtitle, READING_LIMITS.heroSubtitle)}
        </p>
      )}

      {report.verdict && (
        <p
          style={{
            fontSize: '1rem',
            color: T.muted,
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: 16,
            maxWidth: 680,
            padding: '12px 16px',
            background: T.surfaceSoft,
            borderRadius: 14,
            borderLeft: `3px solid ${T.accent}`,
          }}
        >
          {firstSentence(report.verdict)}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          fontSize: 13,
          color: T.faint,
          ...sans,
        }}
      >
        <span>{formatDate(report.createdAt)}</span>
        {report.country && <span>· {report.country}</span>}
        {report.subject && <span>· {report.subject}</span>}
        {report.tags && report.tags.length > 0 && (
          <span>· {report.tags.slice(0, 4).join(' / ')}</span>
        )}
      </div>
    </div>
  )
}

// ── SECTION: Reading Summary ───────────────────────────────────────

function ReadingSummary({ report }: { report: ResearchReport }) {
  const verdictText = report.verdict || report.summary || ''
  const standout =
    report.whatWorked?.[0]?.insight || report.initialInnovation?.[0]?.insight || ''
  const uncertainty = report.risks?.[0]?.risk || ''
  const lesson = report.lessonsForBuilders?.[0]?.lesson || ''

  const entries = [
    { label: '核心判断', text: verdictText },
    { label: '最值得注意', text: standout },
    { label: '最大不确定', text: uncertainty },
    { label: '对我的启发', text: lesson },
  ].filter((e) => e.text)

  if (entries.length === 0) return null

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>先看结论</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
        }}
      >
        {entries.map((entry, i) => (
          <div key={i} style={{ ...cardSheet, padding: '18px 22px', borderRadius: 14 }}>
            <div style={{ ...fieldLabel, marginBottom: 8 }}>{entry.label}</div>
            <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>
              {clampText(entry.text, READING_LIMITS.quickInsight)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SECTION: Key Numbers ───────────────────────────────────────────

function KeyNumbers({ report }: { report: ResearchReport }) {
  if (!report.kpis || report.kpis.length === 0) return null

  const visible = report.kpis.slice(0, READING_LIMITS.maxKpis)

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>几个数字</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        {visible.map((kpi, i) => (
          <div key={i} style={{ minWidth: 100 }}>
            <div
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 600,
                color: T.accent,
                lineHeight: 1.3,
              }}
            >
              {kpi.value}
            </div>
            <div style={{ ...sans, fontSize: 12, color: T.faint, marginTop: 2 }}>
              {kpi.label}
            </div>
            {kpi.note && (
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2, fontStyle: 'italic' }}>
                {kpi.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SECTION: Main Story ────────────────────────────────────────────

function MainStory({ report }: { report: ResearchReport }) {
  const os = report.originStory
  const innovations = report.initialInnovation || []
  const bmo = report.breakoutMoment

  /* Story 1 — why it appeared */
  const story1 =
    os?.marketProblem ? (
      <ExpandableSection
        title="它为什么出现"
        summary={
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>
            {clampText(os.marketProblem, 140)}
          </p>
        }
        detail={
          <div>
            {os.foundingContext && (
              <div style={{ marginBottom: 18 }}>
                <div style={fieldLabel}>创立背景</div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>{os.foundingContext}</p>
              </div>
            )}
            {os.firstVersion && (
              <div style={{ marginBottom: 18 }}>
                <div style={fieldLabel}>第一个版本</div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>{os.firstVersion}</p>
              </div>
            )}
            {os.nonConsensusInsight && (
              <div>
                <div style={fieldLabel}>非共识洞察</div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>{os.nonConsensusInsight}</p>
              </div>
            )}
          </div>
        }
      />
    ) : null

  /* Story 2 — what was novel */
  const topInnovations = summarizeList(innovations, 2)
  const story2Summary = innovations.length > 0
    ? topInnovations.map((inv) => inv.insight).filter(Boolean).join('；')
    : ''
  const story2 = (
    <ExpandableSection
      title="一开始新在哪里"
      summary={
        innovations.length > 0 ? (
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>
            {clampText(story2Summary, 160)}
          </p>
        ) : (
          <p style={{ fontSize: 14, color: T.muted, fontStyle: 'italic' }}>暂无信息</p>
        )
      }
      detail={
        <div>
          {innovations.map((inv, i) => (
            <div key={i} style={{ marginBottom: i < innovations.length - 1 ? 18 : 0 }}>
              <div style={{ ...fieldLabel, color: T.accent }}>{inv.type}</div>
              <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75, marginBottom: 4 }}>
                {inv.insight}
              </p>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{inv.evidence}</p>
            </div>
          ))}
        </div>
      }
    />
  )

  /* Story 3 — when it broke out */
  const story3 =
    bmo ? (
      <ExpandableSection
        title="什么时候开始被看见"
        summary={
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>
            <span style={{ fontWeight: 600, color: T.accent }}>{bmo.period}</span>
            {bmo.trigger ? ` — ${clampText(bmo.trigger, 120)}` : ''}
          </p>
        }
        detail={
          <div>
            {bmo.whyNow && (
              <div style={{ marginBottom: 18 }}>
                <div style={fieldLabel}>为什么是现在</div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>{bmo.whyNow}</p>
              </div>
            )}
            {bmo.growthFlywheel && (
              <div>
                <div style={fieldLabel}>增长飞轮</div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.75 }}>{bmo.growthFlywheel}</p>
              </div>
            )}
          </div>
        }
      />
    ) : null

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>这件事的主线</h2>
      {story1}
      {story2}
      {story3}
    </div>
  )
}

// ── SECTION: Impact ────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const label = level === 'high' ? '高置信' : level === 'medium' ? '中等置信' : '低置信'
  const bg = level === 'high' ? T.greenSoft : T.surfaceSoft
  const clr = level === 'high' ? T.green : level === 'medium' ? T.muted : T.faint
  return (
    <span
      style={{
        ...sans,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: 100,
        background: bg,
        color: clr,
      }}
    >
      {label}
    </span>
  )
}

function DataBadge({ level }: { level: 'public_data' | 'partial_data' | 'no_reliable_data' }) {
  const label =
    level === 'public_data'
      ? '公开数据'
      : level === 'partial_data'
        ? '部分数据'
        : '暂无可靠公开数据'
  const bg =
    level === 'no_reliable_data' ? T.surfaceSoft : level === 'public_data' ? T.accentSoft : T.surfaceSoft
  const clr =
    level === 'no_reliable_data' ? T.faint : level === 'public_data' ? T.accent : T.muted
  return (
    <span
      style={{
        ...sans,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: 100,
        background: bg,
        color: clr,
      }}
    >
      {label}
    </span>
  )
}

function Impact({ report }: { report: ResearchReport }) {
  const ci = (report.customerImpact || []).slice(0, 3)
  const ei = (report.ecosystemImpact || []).slice(0, 3)

  if (ci.length === 0 && ei.length === 0) return null

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>它改变了什么</h2>

      {ci.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={subTitle}>对客户</h3>
          {ci.map((item, i) => (
            <div key={i} style={{ ...cardSheet, marginBottom: 12, borderRadius: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{item.area}</span>
                <ConfidenceBadge level={item.confidence} />
              </div>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>
                {clampText(item.impact, READING_LIMITS.cardBody)}
              </p>
              {item.evidence && (
                <ExpandableSection
                  title="证据"
                  summary={
                    <span style={{ fontSize: 13, color: T.faint, fontStyle: 'italic' }}>点击展开</span>
                  }
                  detail={
                    <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{item.evidence}</p>
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}

      {ei.length > 0 && (
        <div>
          <h3 style={subTitle}>对生态</h3>
          {ei.map((item, i) => (
            <div key={i} style={{ ...cardSheet, marginBottom: 12, borderRadius: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{item.area}</span>
                <DataBadge level={item.dataAvailability} />
              </div>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>
                {clampText(item.impact, READING_LIMITS.cardBody)}
              </p>
              {item.evidence && (
                <ExpandableSection
                  title="证据"
                  summary={
                    <span style={{ fontSize: 13, color: T.faint, fontStyle: 'italic' }}>点击展开</span>
                  }
                  detail={
                    <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{item.evidence}</p>
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── SECTION: Business ──────────────────────────────────────────────

function Business({ report }: { report: ResearchReport }) {
  const bm = report.businessModel
  if (!bm) return null

  const rows: { label: string; value: string }[] = [
    { label: '谁付钱', value: bm.customers },
    { label: '为什么付钱', value: bm.revenue },
    { label: '复购在哪里', value: bm.repeatPurchase },
    { label: '渠道依赖', value: bm.channels },
    { label: '能否规模化', value: bm.scalability },
  ].filter((r) => r.value)

  if (rows.length === 0) return null

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>它怎么赚钱</h2>
      <div style={{ maxWidth: 680 }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              padding: '10px 0',
              borderBottom: i < rows.length - 1 ? `1px solid ${T.line}` : 'none',
            }}
          >
            <span
              style={{
                width: 120,
                flexShrink: 0,
                fontSize: 14,
                fontWeight: 600,
                color: T.faint,
                ...sans,
              }}
            >
              {row.label}
            </span>
            <span style={{ fontSize: 15, color: T.text, lineHeight: 1.7 }}>
              {clampText(row.value, READING_LIMITS.cardBody)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SECTION: Lessons ───────────────────────────────────────────────

function Lessons({ report }: { report: ResearchReport }) {
  const items = summarizeList(report.lessonsForBuilders || [], READING_LIMITS.maxCardsPerSection)

  if (items.length === 0) return null

  return (
    <div style={sectionGap}>
      <h2 style={sectionTitle}>我能学什么</h2>
      {items.map((l, i) => (
        <div key={i} style={{ ...cardSheet, marginBottom: 12, borderRadius: 14 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: T.text,
              lineHeight: 1.6,
              marginBottom: 10,
            }}
          >
            {l.lesson}
          </p>
          <p
            style={{
              fontSize: 14,
              color: T.accent,
              lineHeight: 1.6,
              marginBottom: l.caution ? 8 : 0,
            }}
          >
            {clampText(l.application, READING_LIMITS.cardBody)}
          </p>
          {l.caution && (
            <ExpandableSection
              title="注意"
              summary={
                <span style={{ fontSize: 13, color: T.faint, fontStyle: 'italic' }}>点击展开</span>
              }
              detail={
                <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{l.caution}</p>
              }
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── SECTION: Deep Reading [DEEP only] ──────────────────────────────

function DeepReading({ report }: { report: ResearchReport }) {
  const competitors = report.competitiveLandscape || []
  const worked = report.whatWorked || []
  const risks = report.risks || []
  const sources = report.sources || []

  const detail = (
    <div>
      {/* Competitive Landscape */}
      {competitors.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={subTitle}>竞争格局</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            {summarizeList(competitors, 3).map((c, i) => (
              <div key={i} style={{ ...cardSheet, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 8 }}>
                  {c.competitor}
                </div>
                <div style={{ ...sans, fontSize: 13, color: T.faint, marginBottom: 8 }}>
                  {c.position}
                </div>
                <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, marginBottom: 6 }}>
                  <span style={{ fontWeight: 500, color: T.green }}>优势：</span>
                  {clampText(c.strength, READING_LIMITS.cardBody)}
                </p>
                <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 500, color: T.red }}>劣势：</span>
                  {clampText(c.weakness, READING_LIMITS.cardBody)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What Worked */}
      {worked.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={subTitle}>做对了什么</h3>
          {summarizeList(worked, 3).map((ww, i) => (
            <div key={i} style={{ ...cardSheet, marginBottom: 12, borderRadius: 14 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.text,
                  lineHeight: 1.6,
                  marginBottom: 4,
                }}
              >
                {ww.insight}
              </p>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 6 }}>
                {clampText(ww.whyItMatters, READING_LIMITS.cardBody)}
              </p>
              <ExpandableSection
                title="证据"
                summary={
                  <span style={{ fontSize: 13, color: T.faint, fontStyle: 'italic' }}>点击展开</span>
                }
                detail={
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{ww.evidence}</p>
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={subTitle}>风险在哪里</h3>
          {summarizeList(risks, 3).map((r, i) => (
            <div
              key={i}
              style={{
                ...cardSheet,
                marginBottom: 12,
                borderRadius: 14,
                borderLeft: `2px solid ${T.red}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.risk}</span>
                <span
                  style={{
                    ...sans,
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 100,
                    background: T.redSoft,
                    color: T.red,
                  }}
                >
                  {getSeverityLabel(r.severity)}
                </span>
              </div>
              <ExpandableSection
                title="证据"
                summary={
                  <span style={{ fontSize: 13, color: T.faint, fontStyle: 'italic' }}>点击展开</span>
                }
                detail={
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{r.evidence}</p>
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Sources */}
      <div>
        <h3 style={subTitle}>来源</h3>
        {sources.length > 0 ? (
          <ol
            style={{ listStyle: 'decimal', paddingLeft: 24, fontSize: 14, color: T.text, lineHeight: 1.8 }}
          >
            {sources.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: 'break-all', color: T.accent }}
                >
                  {s.title}
                </a>
                {(s.publisher || s.date) && (
                  <span style={{ marginLeft: 6, fontSize: 12, color: T.faint }}>
                    {[s.publisher, s.date].filter(Boolean).join(' · ')}
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ fontSize: 14, color: T.muted, fontStyle: 'italic' }}>
            当前为 mock 示例报告，不能作为事实研究使用。
          </p>
        )}
      </div>
    </div>
  )

  const hasContent =
    competitors.length > 0 || worked.length > 0 || risks.length > 0

  return (
    <div style={sectionGap}>
      <ExpandableSection
        title="深度阅读"
        summary={
          hasContent ? (
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
              展开阅读竞争格局、成功之道、风险与来源。
            </p>
          ) : (
            <p style={{ fontSize: 14, color: T.muted, fontStyle: 'italic' }}>暂无更多深度内容。</p>
          )
        }
        detail={detail}
      />
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────

export function ReportPage({ report, onBack }: Props) {
  const [readingMode, setReadingMode] = useState<'brief' | 'deep'>('brief')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  return (
    <div
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}
    >
      <ReadingTopBar
        report={report}
        readingMode={readingMode}
        onToggleMode={() => setReadingMode((m) => (m === 'brief' ? 'deep' : 'brief'))}
        onBack={onBack}
      />

      <ReportCover report={report} />
      <ReadingSummary report={report} />
      <KeyNumbers report={report} />
      <MainStory report={report} />
      <Impact report={report} />
      <Business report={report} />
      <Lessons report={report} />

      {readingMode === 'deep' && <DeepReading report={report} />}
    </div>
  )
}
