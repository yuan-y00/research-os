import { ResearchReport, WatchlistItem } from '../types/report'
import { getTypeLabel } from '../utils/filters'
import { formatDate } from '../utils/formatDate'

interface WatchlistPageProps {
  watchlist: WatchlistItem[]
  reports: ResearchReport[]
  onNavigate: (id: string) => void
}

function findMatchingReport(item: WatchlistItem, reports: ResearchReport[]): ResearchReport | undefined {
  return reports.find(
    (r) =>
      r.subject?.toLowerCase() === item.name.toLowerCase() ||
      r.title?.toLowerCase().includes(item.name.toLowerCase()) ||
      item.keywords?.some((kw) => r.title?.toLowerCase().includes(kw.toLowerCase()))
  )
}

export function WatchlistPage({ watchlist, reports, onNavigate }: WatchlistPageProps) {
  const researched = watchlist.filter((w) => !!findMatchingReport(w, reports))
  const notResearched = watchlist.filter((w) => !findMatchingReport(w, reports))

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <section className="page-section" style={{ paddingTop: 60, paddingBottom: 48 }}>
        <h1 className="hero-heading" style={{ marginBottom: 12 }}>Research Watchlist</h1>
        <p className="text-lede">
          Track subjects you want researched. The system automatically picks from this list daily.
        </p>
      </section>

      {/* Researched items */}
      {researched.length > 0 && (
        <section style={{ marginBottom: 64 }}>
          <h2 className="section-heading" style={{ marginBottom: 24 }}>
            Researched ({researched.length})
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {researched.map((item) => {
              const report = findMatchingReport(item, reports)!
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '24px',
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {/* Type + Priority */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`type-pill ${item.type}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {Array.from({ length: item.priority }, (_, i) => (
                        <span
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            opacity: 1 - i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      lineHeight: 1.25,
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Keywords */}
                  {item.keywords && item.keywords.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.keywords.map((kw) => (
                        <span
                          key={kw}
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--ink-secondary)',
                            background: 'rgba(0,0,0,0.04)',
                            padding: '2px 8px',
                            borderRadius: 8,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Research angles */}
                  {item.researchAngles && item.researchAngles.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--ink-tertiary)',
                          marginBottom: 6,
                        }}
                      >
                        Research Angles
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.researchAngles.map((angle, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--ink-secondary)',
                              paddingLeft: 12,
                              borderLeft: '2px solid var(--border)',
                              lineHeight: 1.4,
                            }}
                          >
                            {angle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Last researched */}
                  {item.lastResearchedAt && (
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--ink-tertiary)',
                      }}
                    >
                      Last researched: {formatDate(item.lastResearchedAt)}
                    </div>
                  )}

                  {/* View report CTA */}
                  <button
                    onClick={() => onNavigate(report.id)}
                    style={{
                      marginTop: 'auto',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#fff',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)' }}
                  >
                    View Report &rarr;
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Not yet researched */}
      {notResearched.length > 0 && (
        <section style={{ paddingBottom: 64 }}>
          <h2
            className="section-heading"
            style={{
              marginBottom: 24,
              color: 'var(--ink-tertiary)',
            }}
          >
            Not Yet Researched ({notResearched.length})
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {notResearched.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '24px',
                  background: 'rgba(0,0,0,0.01)',
                  border: '1px dashed var(--border)',
                  borderRadius: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  opacity: 0.7,
                }}
              >
                {/* Type + Priority */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`type-pill ${item.type}`}>
                    {getTypeLabel(item.type)}
                  </span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: item.priority }, (_, i) => (
                      <span
                        key={i}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: 'var(--ink-tertiary)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    lineHeight: 1.25,
                  }}
                >
                  {item.name}
                </h3>

                {/* Keywords */}
                {item.keywords && item.keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {item.keywords.map((kw) => (
                      <span
                        key={kw}
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--ink-secondary)',
                          background: 'rgba(0,0,0,0.04)',
                          padding: '2px 8px',
                          borderRadius: 8,
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Research angles */}
                {item.researchAngles && item.researchAngles.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--ink-tertiary)',
                        marginBottom: 6,
                      }}
                    >
                      Research Angles
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.researchAngles.map((angle, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--ink-secondary)',
                            paddingLeft: 12,
                            borderLeft: '2px solid var(--border)',
                            lineHeight: 1.4,
                          }}
                        >
                          {angle}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pending badge */}
                <div
                  style={{
                    marginTop: 'auto',
                    padding: '10px 16px',
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: 'var(--ink-tertiary)',
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: 12,
                  }}
                >
                  Awaiting Research
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <p style={{ color: 'var(--ink-tertiary)', fontSize: '1.05rem' }}>
            Your watchlist is empty.
          </p>
          <p style={{ color: 'var(--ink-tertiary)', fontSize: '0.9rem', marginTop: 8 }}>
            Add subjects to watchlist.json to track brands, founders, products, and market events.
          </p>
        </div>
      )}
    </div>
  )
}
