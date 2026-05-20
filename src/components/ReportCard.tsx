import { ResearchReport } from '../types/report'
import { estimateReadingTimeCN } from '../utils/readingTime'
import { getTypeLabel } from '../utils/filters'

interface ReportCardProps {
  report: ResearchReport
  isUnread: boolean
  onClick: () => void
}

export function ReportCard({ report, isUnread, onClick }: ReportCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: '20px 24px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 200,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'
      }}
    >
      {/* Top row: type pill + unread dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="pill">{getTypeLabel(report.type)}</span>
        {isUnread && <span className="new-badge">未读</span>}
      </div>

      {/* Title — serif, 18-20px, max 2 lines */}
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text)',
          fontFamily: 'ui-serif, "Noto Serif SC", "Source Han Serif SC", Georgia, serif',
          lineHeight: 1.35,
          margin: '0 0 8px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {report.title}
      </h3>

      {/* Subtitle — 1 line, muted */}
      {report.subtitle && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--muted)',
            margin: '0 0 6px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {report.subtitle}
        </p>
      )}

      {/* Verdict — 1 line, very muted, italic */}
      {report.verdict && (
        <p
          style={{
            fontSize: '0.76rem',
            color: 'var(--faint)',
            fontStyle: 'italic',
            margin: '0 0 6px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {report.verdict}
        </p>
      )}

      {/* Spacer — pushes bottom row down for uniform height */}
      <div style={{ flex: 1 }} />

      {/* Bottom row: 2-3 tags + reading time */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {report.tags && report.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill" style={{ fontSize: '0.62rem', padding: '1px 8px' }}>
              {tag}
            </span>
          ))}
        </div>
        <span className="sans" style={{ fontSize: '0.68rem', color: 'var(--faint)', whiteSpace: 'nowrap' }}>
          {estimateReadingTimeCN(report.summary + report.verdict + report.originStory?.marketProblem || '')}
        </span>
      </div>
    </div>
  )
}
