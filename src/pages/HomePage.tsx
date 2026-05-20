import { useState } from 'react'
import { ResearchReport } from '../types/report'
import { ReportCard } from '../components/ReportCard'
import { estimateReadingTimeCN } from '../utils/readingTime'

interface HomePageProps {
  reports: ResearchReport[]
  readIds: string[]
  onNavigate: (id: string) => void
  onPageChange: (page: string) => void
}

type FilterKey = 'all' | 'unread' | 'brand' | 'product' | 'founder' | 'company' | 'crowdfunding' | 'industry_event'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'brand', label: '品牌' },
  { key: 'product', label: '产品' },
  { key: 'company', label: '公司' },
  { key: 'founder', label: '创始人' },
  { key: 'crowdfunding', label: '众筹' },
]

export function HomePage({ reports, readIds, onNavigate, onPageChange }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [showToast, setShowToast] = useState(false)

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filteredReports = sortedReports.filter((r) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !readIds.includes(r.id)
    return r.type === activeFilter
  })

  const mostRecent = sortedReports[0] || null
  const isRecentUnread = mostRecent ? !readIds.includes(mostRecent.id) : false

  const handleSubmitClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 6000)
  }

  // Gather data for "Quiet Notes" section (bottom of page)
  const recentInsights = sortedReports
    .flatMap(r => (r.whatWorked || []).slice(0, 1).map(w => w.insight))
    .slice(0, 3)

  const recentRisks = sortedReports
    .flatMap(r => (r.risks || []).slice(0, 1).map(rk => rk.risk))
    .slice(0, 3)

  const hasNotes = recentInsights.length > 0 || recentRisks.length > 0

  return (
    <div>
      {/* ===== Quiet Hero ===== */}
      <section
        style={{
          paddingTop: 80,
          paddingBottom: 56,
          textAlign: 'center',
          background: 'var(--bg)',
          maxHeight: 420,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 400,
              fontFamily: 'ui-serif, "Noto Serif SC", "Source Han Serif SC", Georgia, serif',
              color: 'var(--text)',
              marginBottom: 12,
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            Research OS
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--muted)',
              marginBottom: 8,
              lineHeight: 1.6,
            }}
          >
            每天留下一份安静的产品研究笔记。
          </p>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--faint)',
              lineHeight: 1.6,
              maxWidth: 400,
              margin: '0 auto 32px',
            }}
          >
            不追热点，不写营销稿，只记录值得长期观察的品牌、产品和商业变化。
          </p>

          {/* Tiny submit link */}
          <button
            onClick={handleSubmitClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--faint)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            提交研究主题 &rarr;
          </button>

          {/* Toast */}
          {showToast && (
            <div
              style={{
                marginTop: 14,
                padding: '8px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                fontSize: '0.78rem',
                color: 'var(--muted)',
                display: 'inline-block',
              }}
            >
              当前请通过 GitHub Actions 的 manual-research 工作流提交研究主题。
            </div>
          )}
        </div>
      </section>

      {/* ===== 今天先读这个 ===== */}
      {mostRecent && (
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 16,
              fontFamily: 'ui-serif, "Noto Serif SC", "Source Han Serif SC", Georgia, serif',
            }}
          >
            今天先读这个
          </h2>

          <div
            onClick={() => onNavigate(mostRecent.id)}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '24px 28px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            {/* Unread indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {isRecentUnread && <span className="new-badge">未读</span>}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: '0 0 8px',
                fontFamily: 'ui-serif, "Noto Serif SC", "Source Han Serif SC", Georgia, serif',
                lineHeight: 1.35,
              }}
            >
              {mostRecent.title}
            </h3>

            {/* Verdict — one line, clamped */}
            {mostRecent.verdict && (
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--faint)',
                  fontStyle: 'italic',
                  margin: '0 0 12px',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {mostRecent.verdict}
              </p>
            )}

            {/* 3 mini KPIs */}
            {mostRecent.kpis && mostRecent.kpis.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 28,
                  marginBottom: 14,
                  padding: '12px 0',
                  borderTop: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {mostRecent.kpis.slice(0, 3).map((kpi, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {kpi.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6rem',
                        color: 'var(--faint)',
                        marginTop: 2,
                      }}
                    >
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reading time + CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.74rem', color: 'var(--faint)' }}>
                {estimateReadingTimeCN(mostRecent.summary + mostRecent.verdict + (mostRecent.originStory as any)?.marketProblem || '')}
              </span>
              <span className="sans" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                开始阅读 &rarr;
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ===== 研究书架 ===== */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 16,
            fontFamily: 'ui-serif, "Noto Serif SC", "Source Han Serif SC", Georgia, serif',
          }}
        >
          研究书架
        </h2>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`filter-pill${activeFilter === f.key ? ' filter-pill--active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredReports.length === 0 ? (
          <p style={{ color: 'var(--faint)', textAlign: 'center', padding: 48 }}>
            暂无匹配的报告。
          </p>
        ) : (
          <div className="grid-2">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isUnread={!readIds.includes(report.id)}
                onClick={() => onNavigate(report.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== Quiet Notes ===== */}
      {hasNotes && (
        <section style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
              paddingTop: 24,
              borderTop: '1px solid var(--line)',
            }}
          >
            {recentInsights.length > 0 && (
              <div>
                <h4
                  className="sans"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'var(--faint)',
                    marginBottom: 10,
                    letterSpacing: '0.05em',
                  }}
                >
                  最近记录
                </h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {recentInsights.map((insight, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--faint)',
                        lineHeight: 1.5,
                        marginBottom: 6,
                        paddingLeft: 10,
                        borderLeft: '2px solid var(--line)',
                      }}
                    >
                      {insight.length > 80 ? insight.slice(0, 80) + '...' : insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recentRisks.length > 0 && (
              <div>
                <h4
                  className="sans"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'var(--faint)',
                    marginBottom: 10,
                    letterSpacing: '0.05em',
                  }}
                >
                  最近的问题
                </h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {recentRisks.map((risk, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--faint)',
                        lineHeight: 1.5,
                        marginBottom: 6,
                        paddingLeft: 10,
                        borderLeft: '2px solid var(--line)',
                      }}
                    >
                      {risk.length > 80 ? risk.slice(0, 80) + '...' : risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
