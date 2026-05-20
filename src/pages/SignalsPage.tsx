import { ResearchReport } from '../types/report'
import { formatDate } from '../utils/formatDate'
import { getTypeLabel } from '../utils/filters'

interface SignalsPageProps {
  reports: ResearchReport[]
  readIds: string[]
  onNavigate: (id: string) => void
}

export function SignalsPage({ reports, readIds, onNavigate }: SignalsPageProps) {
  const sorted = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      {/* Header */}
      <section className="page-section" style={{ paddingTop: 60, paddingBottom: 48 }}>
        <h1 className="hero-heading" style={{ marginBottom: 12 }}>Key Signals</h1>
        <p className="text-lede">
          Track what matters. All research reports in reverse chronological order.
        </p>
      </section>

      {/* Signal list */}
      <section style={{ paddingBottom: 64 }}>
        {sorted.length === 0 ? (
          <p style={{ color: 'var(--ink-tertiary)', textAlign: 'center', padding: 64 }}>
            No research reports yet. Generate your first report to start tracking signals.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map((report) => {
              const unread = !readIds.includes(report.id)
              return (
                <div
                  key={report.id}
                  onClick={() => onNavigate(report.id)}
                  style={{
                    padding: '20px 24px',
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Unread dot */}
                  {unread && (
                    <span
                      style={{
                        flexShrink: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 0 3px rgba(0,113,227,0.15)',
                      }}
                    />
                  )}
                  {!unread && <span style={{ flexShrink: 0, width: 10 }} />}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className={`type-pill ${report.type}`}>
                        {getTypeLabel(report.type)}
                      </span>
                      {unread && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            background: 'rgba(0,113,227,0.08)',
                            padding: '1px 7px',
                            borderRadius: 8,
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: 'var(--ink)',
                        lineHeight: 1.3,
                        marginBottom: 4,
                      }}
                    >
                      {report.title}
                    </h3>
                    {report.verdict && (
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--ink-tertiary)',
                          fontStyle: 'italic',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {report.verdict}
                      </p>
                    )}
                    {/* Tags */}
                    {report.tags && report.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                        {report.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--ink-secondary)',
                              background: 'rgba(0,0,0,0.04)',
                              padding: '2px 8px',
                              borderRadius: 8,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: '0.78rem',
                      color: 'var(--ink-tertiary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDate(report.createdAt)}
                  </span>

                  {/* Arrow */}
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: '1.1rem',
                      color: 'var(--ink-tertiary)',
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
