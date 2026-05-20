import { useState } from 'react'
import { ResearchReport } from '../types/report'
import { ReportCard } from '../components/ReportCard'

interface HomePageProps {
  reports: ResearchReport[]
  readIds: string[]
  onNavigate: (id: string) => void
  onPageChange: (page: string) => void
}

type FilterKey = 'all' | 'brand' | 'founder' | 'product' | 'company' | 'crowdfunding' | 'industry_event' | 'unread'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'brand', label: 'Brand' },
  { key: 'founder', label: 'Founder' },
  { key: 'product', label: 'Product' },
  { key: 'company', label: 'Company' },
  { key: 'crowdfunding', label: 'Crowdfunding' },
  { key: 'industry_event', label: 'Industry Event' },
  { key: 'unread', label: 'Unread' },
]

export function HomePage({ reports, readIds, onNavigate, onPageChange }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [showGenerateInfo, setShowGenerateInfo] = useState(false)

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filteredReports = sortedReports.filter((r) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !readIds.includes(r.id)
    return r.type === activeFilter
  })

  const mostRecent = sortedReports[0] || null

  const handleGenerateClick = () => {
    setShowGenerateInfo(true)
    setTimeout(() => setShowGenerateInfo(false), 8000)
  }

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="page-section" style={{ paddingTop: 80, paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-heading" style={{ marginBottom: 16 }}>
            Research before the market notices.
          </h1>
          <p className="text-lede" style={{ marginBottom: 48 }}>
            每天自动研究一个品牌、创始人、产品或行业事件，帮助你发现非共识机会。
          </p>

          {/* Search / Generate */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              maxWidth: 560,
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <input
              type="text"
              placeholder="输入品牌、人物、产品或行业事件..."
              style={{
                flex: 1,
                height: 52,
                padding: '0 20px',
                fontSize: '1rem',
                color: 'var(--ink)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={handleGenerateClick}
              style={{
                height: 52,
                padding: '0 28px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#fff',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)' }}
            >
              Generate Research
            </button>
          </div>

          {/* Info message */}
          {showGenerateInfo && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 20px',
                background: 'rgba(0,113,227,0.06)',
                border: '1px solid rgba(0,113,227,0.15)',
                borderRadius: 12,
                fontSize: '0.88rem',
                color: 'var(--accent)',
                lineHeight: 1.5,
                animation: 'fadeInDown 0.3s ease',
              }}
            >
              当前版本请通过 GitHub Actions 的 manual-research 工作流生成报告。后续可接入一键生成。
            </div>
          )}
        </div>
      </section>

      {/* ===== Today's Research ===== */}
      {mostRecent && (
        <section style={{ marginBottom: 64 }}>
          <h2 className="section-heading" style={{ marginBottom: 24 }}>今日研究</h2>
          <ReportCard
            report={mostRecent}
            isUnread={!readIds.includes(mostRecent.id)}
            onClick={() => onNavigate(mostRecent.id)}
          />
        </section>
      )}

      {/* ===== Latest Reports ===== */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-heading" style={{ marginBottom: 0 }}>最新报告</h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', cursor: 'pointer' }} onClick={() => onPageChange('signals')}>
            View all &rarr;
          </span>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: activeFilter === f.key ? 'var(--ink)' : 'var(--ink-secondary)',
                background: activeFilter === f.key ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
                border: 'none',
                borderRadius: 100,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredReports.length === 0 ? (
          <p style={{ color: 'var(--ink-tertiary)', textAlign: 'center', padding: 48 }}>
            No reports match this filter.
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

      {/* ===== Unread Section ===== */}
      {(() => {
        const unread = sortedReports.filter((r) => !readIds.includes(r.id))
        if (unread.length === 0) return null
        return (
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>未读报告</h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                {unread.length}
              </span>
            </div>
            <div className="grid-2">
              {unread.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  isUnread={true}
                  onClick={() => onNavigate(report.id)}
                />
              ))}
            </div>
          </section>
        )
      })()}
    </div>
  )
}
