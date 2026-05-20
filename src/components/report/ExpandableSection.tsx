import { useState } from 'react'

interface Props {
  title: string
  summary: React.ReactNode
  detail: React.ReactNode
  defaultExpanded?: boolean
}

export function ExpandableSection({ title, summary, detail, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h4 style={titleStyle}>{title}</h4>
        <button style={toggleBtnStyle} onClick={() => setExpanded(!expanded)}>
          {expanded ? '收起 ▲' : '展开 ▼'}
        </button>
      </div>
      {!expanded && <div style={summaryStyle}>{summary}</div>}
      {expanded && <div style={detailStyle}>{detail}</div>}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 18,
  padding: 24,
  border: '1px solid var(--line)',
  marginBottom: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}

const titleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: 'var(--text)',
  margin: 0,
}

const toggleBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--muted)',
  fontSize: 14,
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: 6,
  flexShrink: 0,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const summaryStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--text)',
  lineHeight: 1.75,
}

const detailStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--text)',
  lineHeight: 1.75,
  padding: '16px 0 0',
  borderTop: '1px solid var(--line)',
}
