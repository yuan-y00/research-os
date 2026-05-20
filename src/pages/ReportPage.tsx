import { ResearchReport } from '../types/report'
import { formatDate } from '../utils/formatDate'
import { getTypeLabel } from '../utils/filters'
import './../styles/report.css'

interface ReportPageProps {
  report: ResearchReport
  onBack: () => void
}

const confidenceLabel: Record<string, string> = {
  high: '高置信',
  medium: '中等置信',
  low: '低置信',
}

const dataLabel: Record<string, string> = {
  public_data: '公开数据',
  partial_data: '部分数据',
  no_reliable_data: '无可靠数据',
}

const severityLabel: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

const fixabilityLabel: Record<string, string> = {
  easy: '易修复',
  hard: '难修复',
  unclear: '不确定',
}

export function ReportPage({ report, onBack }: ReportPageProps) {
  const sections = [
    { id: 'hero', label: '概览' },
    { id: 'origin', label: '起源故事' },
    { id: 'innovation', label: '初始创新' },
    { id: 'breakout', label: '爆发时刻' },
    { id: 'customer', label: '用户影响' },
    { id: 'ecosystem', label: '生态影响' },
    { id: 'bizmodel', label: '商业模式' },
    { id: 'competitive', label: '竞争格局' },
    { id: 'worked', label: '成功之道' },
    { id: 'risks', label: '风险' },
    { id: 'lessons', label: '建造者启示' },
    { id: 'judgment', label: '最终判断' },
    { id: 'sources', label: '来源' },
  ]

  return (
    <div className="report-page">
      {/* Back button */}
      <div className="report-back" onClick={onBack}>
        &larr; Back to Reports
      </div>

      {/* Sticky section nav */}
      <nav className="section-nav">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>{s.label}</a>
        ))}
      </nav>

      {/* ===== 1. Hero ===== */}
      <section id="hero" className="section">
        <div className="report-hero">
          <span className={`type-pill ${report.type}`}>{getTypeLabel(report.type)}</span>
          <h1>{report.title}</h1>
          {report.subtitle && <p className="subtitle">{report.subtitle}</p>}
          {report.verdict && <p className="verdict">{report.verdict}</p>}
          <div className="meta">
            {formatDate(report.createdAt)}
            {report.country && ` · ${report.country}`}
            {report.subject && ` · ${report.subject}`}
          </div>
        </div>

        {/* KPI strip */}
        {report.kpis && report.kpis.length > 0 && (
          <div className="kpi-strip">
            {report.kpis.map((kpi, i) => (
              <div key={i} className="kpi-cell">
                <div className="kpi-value">{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
                {kpi.note && <div className="kpi-note">{kpi.note}</div>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== 2. Origin Story ===== */}
      <section id="origin" className="section">
        <h2 className="section-title">Origin Story</h2>
        <div className="origin-card">
          <div className="origin-grid">
            <div className="origin-field full">
              <label>Title</label>
              <div className="value">{report.originStory.title}</div>
            </div>
            <div className="origin-field">
              <label>Market Problem</label>
              <div className="value">{report.originStory.marketProblem}</div>
            </div>
            <div className="origin-field">
              <label>Founding Context</label>
              <div className="value">{report.originStory.foundingContext}</div>
            </div>
            <div className="origin-field">
              <label>First Version</label>
              <div className="value">{report.originStory.firstVersion}</div>
            </div>
            <div className="origin-field">
              <label>Non-Consensus Insight</label>
              <div className="value">{report.originStory.nonConsensusInsight}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. Initial Innovation ===== */}
      {report.initialInnovation && report.initialInnovation.length > 0 && (
        <section id="innovation" className="section">
          <h2 className="section-title">Initial Innovation</h2>
          <div className="innovation-grid">
            {report.initialInnovation.map((inv, i) => (
              <div key={i} className="innovation-card">
                <div className="innovation-type">{inv.type}</div>
                <div className="innovation-insight">{inv.insight}</div>
                <div className="innovation-evidence">{inv.evidence}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 4. Breakout Moment ===== */}
      <section id="breakout" className="section">
        <h2 className="section-title">Breakout Moment</h2>
        <div className="breakout-card">
          <div className="breakout-period">{report.breakoutMoment.period}</div>
          <div className="breakout-field">
            <label>Trigger</label>
            <div className="value">{report.breakoutMoment.trigger}</div>
          </div>
          <div className="breakout-field">
            <label>Why Now</label>
            <div className="value">{report.breakoutMoment.whyNow}</div>
          </div>
          <div className="breakout-field">
            <label>Growth Flywheel</label>
            <div className="value">{report.breakoutMoment.growthFlywheel}</div>
          </div>
        </div>
      </section>

      {/* ===== 5. Customer Impact ===== */}
      {report.customerImpact && report.customerImpact.length > 0 && (
        <section id="customer" className="section">
          <h2 className="section-title">Customer Impact</h2>
          {report.customerImpact.map((ci, i) => (
            <div key={i} className="impact-card">
              <div className="impact-header">
                <span className="impact-area">{ci.area}</span>
                <span className={`confidence-badge ${ci.confidence}`}>
                  {confidenceLabel[ci.confidence]}
                </span>
              </div>
              <div className="impact-text">{ci.impact}</div>
              <div className="impact-evidence">{ci.evidence}</div>
            </div>
          ))}
        </section>
      )}

      {/* ===== 6. Ecosystem Impact ===== */}
      {report.ecosystemImpact && report.ecosystemImpact.length > 0 && (
        <section id="ecosystem" className="section">
          <h2 className="section-title">Ecosystem Impact</h2>
          {report.ecosystemImpact.map((ei, i) => (
            <div key={i} className="impact-card">
              <div className="impact-header">
                <span className="impact-area">{ei.area}</span>
                <span className={`data-badge ${ei.dataAvailability}`}>
                  {dataLabel[ei.dataAvailability]}
                </span>
              </div>
              <div className="impact-text">{ei.impact}</div>
              <div className="impact-evidence">{ei.evidence}</div>
            </div>
          ))}
        </section>
      )}

      {/* ===== 7. Business Model ===== */}
      <section id="bizmodel" className="section">
        <h2 className="section-title">Business Model</h2>
        <div className="bizmodel-grid">
          <div className="bizmodel-cell">
            <label>Customers</label>
            <div className="value">{report.businessModel.customers}</div>
          </div>
          <div className="bizmodel-cell">
            <label>Revenue</label>
            <div className="value">{report.businessModel.revenue}</div>
          </div>
          <div className="bizmodel-cell">
            <label>Margin Logic</label>
            <div className="value">{report.businessModel.marginLogic}</div>
          </div>
          <div className="bizmodel-cell">
            <label>Repeat Purchase</label>
            <div className="value">{report.businessModel.repeatPurchase}</div>
          </div>
          <div className="bizmodel-cell">
            <label>Channels</label>
            <div className="value">{report.businessModel.channels}</div>
          </div>
          <div className="bizmodel-cell">
            <label>Scalability</label>
            <div className="value">{report.businessModel.scalability}</div>
          </div>
        </div>
      </section>

      {/* ===== 8. Competitive Landscape ===== */}
      {report.competitiveLandscape && report.competitiveLandscape.length > 0 && (
        <section id="competitive" className="section">
          <h2 className="section-title">Competitive Landscape</h2>
          <table className="competitor-table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Position</th>
                <th>Strength</th>
                <th>Weakness</th>
              </tr>
            </thead>
            <tbody>
              {report.competitiveLandscape.map((c, i) => (
                <tr key={i}>
                  <td className="competitor-name">{c.competitor}</td>
                  <td>{c.position}</td>
                  <td>{c.strength}</td>
                  <td>{c.weakness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ===== 9. What Worked ===== */}
      {report.whatWorked && report.whatWorked.length > 0 && (
        <section id="worked" className="section">
          <h2 className="section-title">What Worked</h2>
          {report.whatWorked.map((ww, i) => (
            <div key={i} className="success-card">
              <div className="success-insight">{ww.insight}</div>
              <div className="success-evidence">{ww.evidence}</div>
              <div className="success-why">{ww.whyItMatters}</div>
            </div>
          ))}
        </section>
      )}

      {/* ===== 10. Risks ===== */}
      {report.risks && report.risks.length > 0 && (
        <section id="risks" className="section">
          <h2 className="section-title">Risks</h2>
          {report.risks.map((r, i) => (
            <div key={i} className="risk-card">
              <div className="risk-header">
                <span className="risk-name">{r.risk}</span>
                <div className="risk-badges">
                  <span className={`severity-badge ${r.severity}`}>
                    Severity: {severityLabel[r.severity]}
                  </span>
                  <span className={`fixability-badge ${r.fixability}`}>
                    Fix: {fixabilityLabel[r.fixability]}
                  </span>
                </div>
              </div>
              <div className="risk-evidence">{r.evidence}</div>
            </div>
          ))}
        </section>
      )}

      {/* ===== 11. Lessons for Builders ===== */}
      {report.lessonsForBuilders && report.lessonsForBuilders.length > 0 && (
        <section id="lessons" className="section">
          <h2 className="section-title">Lessons for Builders</h2>
          {report.lessonsForBuilders.map((l, i) => (
            <div key={i} className="lesson-card">
              <div className="lesson-title">{l.lesson}</div>
              <div className="lesson-app">Apply: {l.application}</div>
              <div className="lesson-caution">Caution: {l.caution}</div>
            </div>
          ))}
        </section>
      )}

      {/* ===== 12. Final Judgment ===== */}
      <section id="judgment" className="section">
        <h2 className="section-title">Final Judgment</h2>
        <div className="judgment-card">
          <div className="judgment-grid">
            <div className="judgment-item">
              <label>Learnable</label>
              <div className="value">{report.finalJudgment.learnable}</div>
            </div>
            <div className="judgment-item">
              <label>Copyable</label>
              <div className="value">{report.finalJudgment.copyable}</div>
            </div>
            <div className="judgment-item">
              <label>Investable</label>
              <div className="value">{report.finalJudgment.investable}</div>
            </div>
          </div>
          <div className="judgment-extended">
            <div className="field">
              <label>3-Year View</label>
              <div className="value">{report.finalJudgment.threeYearView}</div>
            </div>
            <div className="field">
              <label>Biggest Opportunity</label>
              <div className="value">{report.finalJudgment.biggestOpportunity}</div>
            </div>
            <div className="field">
              <label>Biggest Risk</label>
              <div className="value">{report.finalJudgment.biggestRisk}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 13. Sources ===== */}
      {report.sources && report.sources.length > 0 && (
        <section id="sources" className="section">
          <h2 className="section-title">Sources</h2>
          <ol className="sources-list">
            {report.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                {s.publisher && <span className="source-publisher">{s.publisher}</span>}
                {s.date && <span className="source-date">{s.date}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
