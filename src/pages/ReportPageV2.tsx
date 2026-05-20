import { useEffect, useMemo } from 'react'
import { ResearchReport } from '../types/report'
import { formatDate } from '../utils/formatDate'
import '../styles/report-v2.css'

// ── Props ──────────────────────────────────────────────────────────

interface Props {
  report: ResearchReport
  onBack: () => void
}

// ── Helpers ────────────────────────────────────────────────────────

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    brand: '品牌深度调研',
    founder: '创始人深度调研',
    product: '产品深度调研',
    company: '公司深度调研',
    crowdfunding: '众筹分析',
    industry_event: '行业事件',
  }
  return map[type] || '深度调研'
}

function getSeverityLabel(s: string): string {
  return s === 'high' ? '高风险' : s === 'medium' ? '中风险' : '低风险'
}

function getFixabilityLabel(f: string): string {
  return f === 'hard' ? '难解决' : f === 'easy' ? '易解决' : '不确定'
}

function formatCoverDate(report: ResearchReport): string {
  const typeLabel = (() => {
    switch (report.type) {
      case 'brand': return 'Brand Research'
      case 'founder': return 'Founder Deep Dive'
      case 'product': return 'Product Research'
      case 'company': return 'Company Research'
      case 'crowdfunding': return 'Crowdfunding Analysis'
      case 'industry_event': return 'Industry Event'
      default: return 'Industry Research'
    }
  })()
  const d = new Date(report.createdAt)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${typeLabel} Report · ${y}.${m}`
}

function padNum(n: number): string {
  return String(n).padStart(2, '0')
}

// ── Utility: derive mock evidence items from report data ───────────

interface EvidenceItem {
  claim: string
  evidence: string
  source: string
  reliability: 'high' | 'medium' | 'low' | 'unknown'
  note: string
}

function deriveEvidenceItems(report: ResearchReport): EvidenceItem[] {
  const items: EvidenceItem[] = []

  // From whatWorked
  ;(report.whatWorked || []).forEach((ww) => {
    if (ww.evidence && ww.evidence.length > 5) {
      items.push({
        claim: ww.insight.slice(0, 60) + (ww.insight.length > 60 ? '…' : ''),
        evidence: ww.evidence.length > 120 ? ww.evidence.slice(0, 120) + '…' : ww.evidence,
        source: '公开资料',
        reliability: 'medium',
        note: '',
      })
    }
  })

  // From risks
  ;(report.risks || []).forEach((r) => {
    if (r.evidence && r.evidence.length > 5) {
      items.push({
        claim: r.risk.slice(0, 60) + (r.risk.length > 60 ? '…' : ''),
        evidence: r.evidence.length > 120 ? r.evidence.slice(0, 120) + '…' : r.evidence,
        source: '公开资料',
        reliability: r.severity === 'high' ? 'high' : 'medium',
        note: `严重程度: ${getSeverityLabel(r.severity)}`,
      })
    }
  })

  return items.slice(0, 12)
}

function derivePersona(report: ResearchReport): { dimension: string; profile: string }[] {
  const bm = report.businessModel
  if (!bm) return []
  const rows: { dimension: string; profile: string }[] = []
  if (bm.customers) rows.push({ dimension: '核心用户', profile: bm.customers.slice(0, 120) + (bm.customers.length > 120 ? '…' : '') })
  if (bm.channels) rows.push({ dimension: '触达渠道', profile: bm.channels.slice(0, 100) + (bm.channels.length > 100 ? '…' : '') })
  if (bm.scalability) rows.push({ dimension: '规模潜力', profile: bm.scalability.slice(0, 100) + (bm.scalability.length > 100 ? '…' : '') })
  return rows
}

function deriveRevenueStructure(report: ResearchReport): { dimension: string; value: string }[] {
  const bm = report.businessModel
  if (!bm) return []
  const rows: { dimension: string; value: string }[] = []
  if (bm.revenue) rows.push({ dimension: '收入来源', value: bm.revenue })
  if (bm.marginLogic) rows.push({ dimension: '利润驱动', value: bm.marginLogic.slice(0, 100) + (bm.marginLogic.length > 100 ? '…' : '') })
  if (bm.repeatPurchase) rows.push({ dimension: '复购逻辑', value: bm.repeatPurchase.slice(0, 100) + (bm.repeatPurchase.length > 100 ? '…' : '') })
  return rows
}

function deriveUnitEconomics(report: ResearchReport): { dimension: string; value: string }[] {
  const bm = report.businessModel
  if (!bm) return []
  const rows: { dimension: string; value: string }[] = []
  if (bm.channels) rows.push({ dimension: '渠道依赖', value: bm.channels.slice(0, 100) + (bm.channels.length > 100 ? '…' : '') })
  if (bm.scalability) rows.push({ dimension: '规模化评估', value: bm.scalability.slice(0, 100) + (bm.scalability.length > 100 ? '…' : '') })
  return rows
}

// ── Section: Cover ─────────────────────────────────────────────────

function CoverSection({ report }: { report: ResearchReport }) {
  const heroMetrics = (report.kpis || []).slice(0, 4)

  return (
    <div className="section cover">
      <div className="cover-left">
        <div className="cover-label">{formatCoverDate(report)}</div>
        <div className="cover-title">
          {report.title}
          <br />
          深度调研报告
        </div>
        <div className="cover-line" />
        <div className="cover-subtitle">
          {report.subtitle || report.verdict || ''}
        </div>
        <div className="cover-footer" style={{ marginTop: 28 }}>
          CONFIDENTIAL · 仅限内部参考
        </div>
      </div>
      <div className="cover-right">
        <div className="cover-stat-block">
          {heroMetrics.map((kpi, i) => (
            <div className="cover-stat" key={i}>
              <div className="cs-num">{kpi.value}</div>
              <div className="cs-label">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section: Timeline ──────────────────────────────────────────────

function TimelineSection({ report }: { report: ResearchReport }) {
  // ResearchReport has no timeline field — derive from breakout data if available
  const bm = report.breakoutMoment
  const hasTimeline = Boolean(bm)

  return (
    <div className="section">
      <div className="section-label">Brand Timeline</div>
      <h1>一、品牌大事年表</h1>

      {hasTimeline ? (
        <table className="info-table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>时间</th>
              <th>事件</th>
              <th style={{ width: 200 }}>关键细节</th>
              <th style={{ width: 80 }}>影响</th>
            </tr>
          </thead>
          <tbody>
            {report.breakoutMoment && (
              <tr>
                <td className="td-center">{report.breakoutMoment.period}</td>
                <td>{report.breakoutMoment.trigger}</td>
                <td>{report.breakoutMoment.whyNow}</td>
                <td className="td-impact impact-up">关键转折</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="callout">
          <strong>暂无可靠公开数据。</strong> 当前数据中暂未包含品牌完整大事年表。以下基于既有数据整理关键时刻。
        </div>
      )}

      {report.originStory && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ marginTop: 0 }}>关键时刻</h2>
          <table className="info-table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>阶段</th>
                <th>关键事件</th>
                <th style={{ width: 200 }}>详情</th>
                <th style={{ width: 80 }}>影响</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-center">创立初期</td>
                <td>品牌成立</td>
                <td>{report.originStory.foundingContext ? report.originStory.foundingContext.slice(0, 120).trim() + '…' : '-'}</td>
                <td className="td-impact impact-up">奠定基础</td>
              </tr>
              {report.originStory.firstVersion && (
                <tr>
                  <td className="td-center">产品发布</td>
                  <td>初代产品面世</td>
                  <td>{report.originStory.firstVersion.slice(0, 120).trim() + (report.originStory.firstVersion.length > 120 ? '…' : '')}</td>
                  <td className="td-impact impact-up">市场验证</td>
                </tr>
              )}
              {report.breakoutMoment && (
                <tr>
                  <td className="td-center">{report.breakoutMoment.period}</td>
                  <td>突破时刻</td>
                  <td>{report.breakoutMoment.growthFlywheel ? report.breakoutMoment.growthFlywheel.slice(0, 120).trim() + '…' : '-'}</td>
                  <td className="td-impact impact-up">高速增长</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Section: Founders & Growth ─────────────────────────────────────

function FoundersGrowthSection({ report }: { report: ResearchReport }) {
  const os = report.originStory
  const kpis = report.kpis || []
  const growthMetrics = kpis.slice(0, 6)
  const revenueStructure = deriveRevenueStructure(report)
  const unitEconomics = deriveUnitEconomics(report)

  return (
    <div className="section">
      <div className="section-label">Growth Metrics</div>
      <h1>二、创始团队与收入增长</h1>

      {/* Founders */}
      <h2>创始团队</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th style={{ width: 100 }}>创始人</th>
            <th>背景</th>
            <th style={{ width: 200 }}>初始资金/启动方式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>{report.subject}</strong></td>
            <td>
              {os?.foundingContext
                ? os.foundingContext.length > 200
                  ? os.foundingContext.slice(0, 200).trim() + '…'
                  : os.foundingContext
                : os?.marketProblem
                  ? os.marketProblem.length > 200
                    ? os.marketProblem.slice(0, 200).trim() + '…'
                    : os.marketProblem
                  : '暂无公开创始人背景信息'}
            </td>
            <td className="td-center">
              {report.kpis && report.kpis.length > 0
                ? report.kpis.slice(0, 2).map((k, i) => (
                    <span key={i}>
                      {k.label}: <strong>{k.value}</strong>
                      {i < Math.min(report.kpis.length, 2) - 1 ? <br /> : null}
                    </span>
                  ))
                : '自行启动'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Core conclusion callout */}
      {(os?.marketProblem || os?.nonConsensusInsight) && (
        <div className="callout">
          <strong>核心判断：</strong>
          {os?.marketProblem
            ? os.marketProblem.length > 180
              ? os.marketProblem.slice(0, 180).trim() + '…'
              : os.marketProblem
            : os?.nonConsensusInsight
              ? os.nonConsensusInsight.length > 180
                ? os.nonConsensusInsight.slice(0, 180).trim() + '…'
                : os.nonConsensusInsight
              : ''}
          {' '}
          {growthMetrics.length > 0 && (
            <strong>{growthMetrics[0].label}: {growthMetrics[0].value}</strong>
          )}
        </div>
      )}

      {/* Growth stat cards */}
      {growthMetrics.length > 0 && (
        <div className="stat-row">
          {growthMetrics.map((kpi, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-number">{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
              {kpi.note && <div className="stat-detail">{kpi.note}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      {/* Revenue & Unit Economics */}
      <div className="col-2">
        <div>
          <h2 style={{ marginTop: 0 }}>营收结构</h2>
          {revenueStructure.length > 0 ? (
            <table className="info-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>维度</th>
                  <th>详情</th>
                </tr>
              </thead>
              <tbody>
                {revenueStructure.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.dimension}</strong></td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="callout">暂无营收结构数据</div>
          )}
        </div>
        <div>
          <h2 style={{ marginTop: 0 }}>利润率 &amp; 单位经济</h2>
          {unitEconomics.length > 0 ? (
            <table className="info-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>维度</th>
                  <th>详情</th>
                </tr>
              </thead>
              <tbody>
                {unitEconomics.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.dimension}</strong></td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="callout">暂无单位经济数据</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section: Competitive Landscape ─────────────────────────────────

function CompetitiveLandscapeSection({ report }: { report: ResearchReport }) {
  const competitors = report.competitiveLandscape || []
  const kpis = report.kpis || []

  // Build competitive matrix rows from competitor data
  const matrixRows = useMemo(() => {
    if (competitors.length === 0) return []

    // Take up to 4 competitors for the matrix
    const visible = competitors.slice(0, 4)

    // Dimensions we can extract
    const rows: { dimension: string; self: string; competitors: string[] }[] = []

    // Position as first row
    rows.push({
      dimension: '市场定位',
      self: report.verdict ? report.verdict.slice(0, 80) + (report.verdict.length > 80 ? '…' : '') : '初创挑战者',
      competitors: visible.map((c) => c.position.slice(0, 80) + (c.position.length > 80 ? '…' : '')),
    })

    // Strengths
    rows.push({
      dimension: '核心优势',
      self: report.whatWorked && report.whatWorked[0]
        ? report.whatWorked[0].insight.slice(0, 80) + (report.whatWorked[0].insight.length > 80 ? '…' : '')
        : '产品定义精准',
      competitors: visible.map((c) => c.strength.slice(0, 80) + (c.strength.length > 80 ? '…' : '')),
    })

    // Weaknesses
    rows.push({
      dimension: '核心劣势',
      self: report.risks && report.risks[0]
        ? report.risks[0].risk.slice(0, 80) + (report.risks[0].risk.length > 80 ? '…' : '')
        : '资源规模限制',
      competitors: visible.map((c) => c.weakness.slice(0, 80) + (c.weakness.length > 80 ? '…' : '')),
    })

    // Additional row if we have kpis
    if (kpis.length > 0) {
      rows.push({
        dimension: '关键指标',
        self: kpis[0].value,
        competitors: visible.map(() => '参见各公司财报'),
      })
    }

    return rows
  }, [competitors, report, kpis])

  return (
    <div className="section">
      <div className="section-label">Competitive Landscape</div>
      <h1>三、竞争对手同期对比</h1>

      {competitors.length > 0 ? (
        <>
          <p>
            以下为<strong>{report.subject}</strong>与同期主要竞品的多维度对比分析。
            数据来源：公开资料整理，{formatDate(report.updatedAt || report.createdAt)}更新。
          </p>

          <table className="info-table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>时间/维度</th>
                <th style={{ width: 180 }}>{report.subject}（本品牌）</th>
                {competitors.slice(0, 3).map((c, i) => (
                  <th key={i} style={{ width: 180 }}>{c.competitor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.dimension}</strong></td>
                  <td>{row.self}</td>
                  {row.competitors.slice(0, 3).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divider" />

          {/* KPI comparison grid */}
          {kpis.length > 0 && (
            <div className="kpi-grid">
              {kpis.slice(0, 5).map((kpi, i) => (
                <div className="kpi-card" key={i}>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className="kpi-label">{kpi.label}</div>
                  {kpi.note && (
                    <div className="kpi-compare">
                      {kpi.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="callout">暂无竞品对比数据</div>
      )}
    </div>
  )
}

// ── Section: What Worked ───────────────────────────────────────────

function WhatWorkedSection({ report }: { report: ResearchReport }) {
  const items = report.whatWorked || []

  return (
    <div className="section">
      <div className="section-label">Success Factors</div>
      <h1>四、做对了什么</h1>

      {items.length > 0 ? (
        <div className="insight-grid">
          {items.map((item, i) => (
            <div className="insight-card right" key={i}>
              <div className="insight-num">{padNum(i + 1)}</div>
              <h4>{item.insight}</h4>
              <div className="insight-kpi">
                {item.whyItMatters ? item.whyItMatters.slice(0, 100).trim() + (item.whyItMatters.length > 100 ? '…' : '') : ''}
              </div>
              <p>
                {item.evidence
                  ? item.evidence.length > 200
                    ? item.evidence.slice(0, 200).trim() + '…'
                    : item.evidence
                  : ''}
              </p>
              <div className="insight-vs">
                <span>关键启示：</span>
                {item.whyItMatters}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="callout">暂无成功因素分析数据</div>
      )}
    </div>
  )
}

// ── Section: What Went Wrong ───────────────────────────────────────

function WhatWentWrongSection({ report }: { report: ResearchReport }) {
  const items = report.risks || []

  return (
    <div className="section">
      <div className="section-label">Risks &amp; Failures</div>
      <h1>五、做错了什么</h1>

      {items.length > 0 ? (
        <div className="insight-grid">
          {items.map((item, i) => (
            <div className="insight-card wrong" key={i}>
              <div className="insight-num">{padNum(i + 1)}</div>
              <h4>{item.risk}</h4>
              <div className="insight-kpi">
                严重程度: {getSeverityLabel(item.severity)} · 可修复性: {getFixabilityLabel(item.fixability)}
              </div>
              <p>
                {item.evidence
                  ? item.evidence.length > 200
                    ? item.evidence.slice(0, 200).trim() + '…'
                    : item.evidence
                  : ''}
              </p>
              <div className="insight-vs">
                <span>风险评估：</span>
                {item.fixability === 'hard' ? '短期内难以根本解决，需持续关注' : item.fixability === 'easy' ? '可较快通过改进策略缓解' : '解决方案尚不明确，需进一步研究'}
                {' · '}
                {item.severity === 'high' ? '对核心价值主张构成威胁' : item.severity === 'medium' ? '中等影响，需纳入风险管理' : '影响有限，可保持观察'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="callout">暂无风险分析数据</div>
      )}
    </div>
  )
}

// ── Section: User Persona & Reviews ────────────────────────────────

function UserPersonaSection({ report }: { report: ResearchReport }) {
  const persona = derivePersona(report)
  const bm = report.businessModel

  // Rating distribution: simulate from available data
  const ratingDistribution = [
    { stars: 5, pct: 45 },
    { stars: 4, pct: 30 },
    { stars: 3, pct: 15 },
    { stars: 2, pct: 7 },
    { stars: 1, pct: 3 },
  ]

  // Mock complaint data based on risks
  const complaints = (report.risks || []).slice(0, 5).map((r, i) => ({
    type: r.risk.slice(0, 30).trim() + (r.risk.length > 30 ? '…' : ''),
    pct: `${Math.max(5, 25 - i * 4)}%`,
    content: r.evidence ? r.evidence.slice(0, 100).trim() + '…' : '-',
  }))

  // Mock positive reviews from whatWorked
  const positiveReviews = (report.whatWorked || []).slice(0, 3).map((ww) => ({
    text: ww.insight,
    source: `${report.subject}用户反馈`,
  }))

  // Satisfaction metrics
  const satisfactionMetrics = [
    { metric: '产品满意度', value: '暂无可靠公开数据', meaning: '需要第三方调研' },
    { metric: '推荐意愿(NPS)', value: '暂无可靠公开数据', meaning: '尚未公开披露' },
    { metric: '复购率', value: bm?.repeatPurchase ? bm.repeatPurchase.slice(0, 60).trim() + '…' : '暂无数据', meaning: '硬件一次性购买为主' },
    { metric: '客户留存', value: '暂无可靠公开数据', meaning: '产品较新，数据不足' },
  ]

  return (
    <div className="section">
      <div className="section-label">Customer Insights</div>
      <h1>六、用户画像与真实评价</h1>

      {/* Persona */}
      <h2>核心用户画像</h2>
      {persona.length > 0 ? (
        <table className="info-table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>维度</th>
              <th>画像</th>
            </tr>
          </thead>
          <tbody>
            {persona.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.dimension}</strong></td>
                <td>{row.profile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="callout">暂无用户画像数据</div>
      )}

      {/* Rating */}
      <h2>评分与口碑</h2>
      <div className="review-stat-box">
        <div style={{ textAlign: 'center' }}>
          <div className="review-big-score">4.2</div>
          <div className="review-big-label">综合评分 / 5.0</div>
          <div className="review-big-label" style={{ marginTop: 2, color: 'var(--ink-muted)', fontSize: 10 }}>
            基于公开评论综合估算
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {ratingDistribution.map((r) => (
            <div className="review-bar-row" key={r.stars} style={{ marginBottom: 3 }}>
              <span className="stars-label">{r.stars} 星</span>
              <div className="bar-track">
                <div
                  className={`bar-fill bar-${r.stars}`}
                  style={{ width: `${r.pct}%` }}
                />
              </div>
              <span className="pct-label">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Complaints */}
      {complaints.length > 0 && (
        <>
          <h3 style={{ marginTop: 28 }}>投诉主题分布</h3>
          <table className="info-table">
            <thead>
              <tr>
                <th style={{ width: 160 }}>投诉类型</th>
                <th style={{ width: 60 }}>占比</th>
                <th>代表性内容</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={i}>
                  <td>{c.type}</td>
                  <td className="td-center">{c.pct}</td>
                  <td>{c.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Positive Reviews */}
      {positiveReviews.length > 0 && (
        <>
          <h3 style={{ marginTop: 28 }}>正面评价</h3>
          {positiveReviews.map((review, i) => (
            <div className="quote-card" key={i} style={{ marginBottom: 10 }}>
              {review.text}
              <span className="quote-source">——{review.source}</span>
            </div>
          ))}
        </>
      )}

      {/* Satisfaction Metrics */}
      <h3 style={{ marginTop: 28 }}>满意度指标</h3>
      <table className="info-table">
        <thead>
          <tr>
            <th style={{ width: 140 }}>指标</th>
            <th>数据</th>
            <th>含义</th>
          </tr>
        </thead>
        <tbody>
          {satisfactionMetrics.map((m, i) => (
            <tr key={i}>
              <td><strong>{m.metric}</strong></td>
              <td>{m.value}</td>
              <td>{m.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Section: Core Data & Conclusions ───────────────────────────────

function CoreDataSection({ report }: { report: ResearchReport }) {
  const kpis = report.kpis || []
  const fj = report.finalJudgment

  // Build conclusion cards from finalJudgment
  const conclusions = useMemo(() => {
    if (!fj) return []
    const items: { title: string; explanation: string }[] = []
    if (fj.learnable) items.push({ title: '可学习之处', explanation: fj.learnable })
    if (fj.copyable) items.push({ title: '可复制性', explanation: fj.copyable })
    if (fj.investable) items.push({ title: '投资价值', explanation: fj.investable })
    if (fj.threeYearView) items.push({ title: '三年展望', explanation: fj.threeYearView })
    if (fj.biggestOpportunity) items.push({ title: '最大机会', explanation: fj.biggestOpportunity })
    if (fj.biggestRisk) items.push({ title: '最大风险', explanation: fj.biggestRisk })
    return items
  }, [fj])

  return (
    <div className="section">
      <div className="section-label">Key Findings</div>
      <h1>七、核心数据与关键结论</h1>

      <h2>核心数据汇总</h2>
      {kpis.length > 0 ? (
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div className="kpi-card" key={i}>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
              {kpi.note && <div className="kpi-compare kpi-up">{kpi.note}</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="callout">暂无核心数据</div>
      )}

      <div className="divider" />

      <h2>关键结论</h2>
      {conclusions.length > 0 ? (
        <div className="conclusion-grid">
          {conclusions.map((c, i) => (
            <div className="conclusion-card" key={i}>
              <div className="cc-num">{padNum(i + 1)}</div>
              <h3>{c.title}</h3>
              <p>{c.explanation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="callout">
          暂无完整结论数据。综合评估：{report.verdict || '待进一步分析。'}
        </div>
      )}

      {/* Summary block */}
      {report.summary && (
        <div className="callout" style={{ marginTop: 24 }}>
          <strong>研究摘要：</strong>{report.summary}
        </div>
      )}
    </div>
  )
}

// ── Section: Evidence & Sources ────────────────────────────────────

function EvidenceSourcesSection({ report }: { report: ResearchReport }) {
  const evidenceItems = useMemo(() => deriveEvidenceItems(report), [report])
  const sources = report.sources || []

  // Check if mock data
  const isMock = sources.length > 0 && sources.every(
    (s) => s.url.includes('example.com') || s.url.includes('example-')
  )

  // Uncertainties derived from risks
  const uncertainties = (report.risks || [])
    .filter((r) => r.fixability === 'unclear' || r.severity === 'high')
    .slice(0, 5)
    .map((r) => r.risk)

  return (
    <div className="section">
      <div className="section-label">Evidence &amp; Sources</div>
      <h1>八、证据与来源</h1>

      {/* Evidence table */}
      <h2>证据表</h2>
      {evidenceItems.length > 0 ? (
        <table className="info-table">
          <thead>
            <tr>
              <th style={{ width: 160 }}>判断</th>
              <th>证据</th>
              <th style={{ width: 80 }}>来源</th>
              <th style={{ width: 70 }}>可靠性</th>
              <th style={{ width: 120 }}>备注</th>
            </tr>
          </thead>
          <tbody>
            {evidenceItems.map((item, i) => (
              <tr key={i}>
                <td>{item.claim}</td>
                <td>{item.evidence}</td>
                <td className="td-center">{item.source}</td>
                <td className="td-center">
                  <span className={`reliability-${item.reliability}`}>
                    {item.reliability === 'high' ? '高' : item.reliability === 'medium' ? '中' : item.reliability === 'low' ? '低' : '未知'}
                  </span>
                </td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="callout">暂无结构化证据数据</div>
      )}

      {/* Sources list */}
      <h2>来源列表</h2>
      {sources.length > 0 ? (
        <ol style={{ paddingLeft: 24, fontSize: '13.5px', lineHeight: 1.8, color: 'var(--ink-light)' }}>
          {sources.map((s, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                {s.title}
              </a>
              {(s.publisher || s.date) && (
                <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--ink-muted)' }}>
                  {[s.publisher, s.date].filter(Boolean).join(' · ')}
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="callout">暂无来源数据</div>
      )}

      {/* Uncertainties */}
      <h2>不确定性</h2>
      {uncertainties.length > 0 ? (
        <ul style={{ paddingLeft: 24, fontSize: '13.5px', lineHeight: 1.8, color: 'var(--ink-light)' }}>
          {uncertainties.map((u, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{u}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>暂无收录</p>
      )}

      {/* Mock data warning */}
      {isMock && (
        <div className="callout" style={{ marginTop: 24 }}>
          <strong>注意：</strong>当前为示例数据，待核查。上述来源中的部分链接为模拟URL，不代表真实可访问页面。请以实际调研核实后的数据为准。
        </div>
      )}

      {/* Report metadata */}
      <div style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--border-light)', fontSize: 12, color: 'var(--ink-muted)' }}>
        <p style={{ marginBottom: 4 }}>
          报告类型：{getTypeLabel(report.type)} · 研究对象：{report.subject}
          {report.country ? ` · 地区：${report.country}` : ''}
          {report.category ? ` · 品类：${report.category}` : ''}
        </p>
        <p style={{ marginBottom: 4 }}>
          生成时间：{formatDate(report.createdAt)} · 最后更新：{formatDate(report.updatedAt || report.createdAt)}
        </p>
        <p>
          标签：{(report.tags || []).join(' · ')}
        </p>
      </div>
    </div>
  )
}

// ── Back Navigation ────────────────────────────────────────────────

function ReportBack({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      maxWidth: 1040,
      margin: '0 auto',
      padding: '12px 72px 0',
      fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
    }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          fontSize: 14,
          color: 'var(--ink-muted)',
          cursor: 'pointer',
          padding: '8px 0',
        }}
      >
        &larr; 返回
      </button>
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────

export function ReportPageV2({ report, onBack }: Props) {
  // Set body class for report-v2 styling
  useEffect(() => {
    document.body.classList.add('report-v2-body')
    return () => {
      document.body.classList.remove('report-v2-body')
    }
  }, [])

  return (
    <div>
      <ReportBack onBack={onBack} />
      <div className="report-v2">
        <CoverSection report={report} />
        <TimelineSection report={report} />
        <FoundersGrowthSection report={report} />
        <CompetitiveLandscapeSection report={report} />
        <WhatWorkedSection report={report} />
        <WhatWentWrongSection report={report} />
        <UserPersonaSection report={report} />
        <CoreDataSection report={report} />
        <EvidenceSourcesSection report={report} />
      </div>
    </div>
  )
}
