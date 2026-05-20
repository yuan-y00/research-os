import { ResearchReport } from '../types/report'
import { formatDate } from '../utils/formatDate'
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
        position: 'relative',
        padding: '24px 28px',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)'
      }}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#0071e3',
              boxShadow: '0 0 0 3px rgba(0,113,227,0.2)',
            }}
          />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#0071e3',
              background: 'rgba(0,113,227,0.08)',
              padding: '2px 8px',
              borderRadius: 10,
              letterSpacing: '0.02em',
            }}
          >
            NEW
          </span>
        </div>
      )}

      {/* Type pill */}
      <div>
        <span className={`type-pill ${report.type}`}>{getTypeLabel(report.type)}</span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          color: '#1d1d1f',
          margin: 0,
        }}
      >
        {report.title}
      </h3>

      {/* Subtitle */}
      {report.subtitle && (
        <p
          style={{
            fontSize: '0.88rem',
            color: '#6e6e73',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {report.subtitle}
        </p>
      )}

      {/* Verdict */}
      {report.verdict && (
        <p
          style={{
            fontSize: '0.84rem',
            color: '#aeaeb2',
            lineHeight: 1.4,
            margin: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontStyle: 'italic',
          }}
        >
          {report.verdict}
        </p>
      )}

      {/* KPI mini grid */}
      {report.kpis && report.kpis.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(report.kpis.length, 4)}, 1fr)`,
            gap: 8,
          }}
        >
          {report.kpis.slice(0, 4).map((kpi, i) => (
            <div
              key={i}
              style={{
                padding: '10px 8px',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: 10,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#1d1d1f',
                  lineHeight: 1.1,
                }}
              >
                {kpi.value}
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  color: '#aeaeb2',
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 500,
                }}
              >
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {report.tags && report.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {report.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.7rem',
                color: '#6e6e73',
                background: 'rgba(0,0,0,0.04)',
                padding: '2px 10px',
                borderRadius: 10,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 8,
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#aeaeb2' }}>
          {formatDate(report.createdAt)}
        </span>
        <span
          style={{
            fontSize: '0.84rem',
            fontWeight: 500,
            color: '#0071e3',
          }}
        >
          View Research &rarr;
        </span>
      </div>
    </div>
  )
}
