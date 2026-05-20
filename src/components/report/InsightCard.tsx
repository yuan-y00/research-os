import { useState } from 'react'

interface Props {
  title: string
  variant?: 'positive' | 'negative' | 'neutral'
  badge?: { label: string; color?: string }
  children: React.ReactNode
  detail?: React.ReactNode
  defaultExpanded?: boolean
}

export function InsightCard({
  title,
  variant = 'neutral',
  badge,
  children,
  detail,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const borderColor =
    variant === 'positive'
      ? 'var(--green)'
      : variant === 'negative'
        ? 'var(--red)'
        : 'var(--line)'

  return (
    <div style={{ ...cardStyle, borderLeft: `3px solid ${borderColor}` }}>
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        {badge && (
          <span
            style={{
              ...badgeStyle,
              background: badge.color ? `${badge.color}18` : 'var(--surface-soft)',
              color: badge.color || 'var(--muted)',
            }}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div style={contentStyle}>{children}</div>
      {detail && expanded && <div style={detailStyle}>{detail}</div>}
      {detail && (
        <button style={toggleBtnStyle} onClick={() => setExpanded(!expanded)}>
          {expanded ? '收起详情 ▲' : '展开详情 ▼'}
        </button>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 16,
  padding: '20px 24px',
  marginBottom: 14,
  border: '1px solid var(--line)',
  borderLeft: '3px solid var(--line)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  marginBottom: 10,
}

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--text)',
  lineHeight: 1.5,
}

const badgeStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  padding: '3px 10px',
  borderRadius: 10,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const contentStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--muted)',
  lineHeight: 1.7,
}

const detailStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text)',
  lineHeight: 1.75,
  marginTop: 14,
  paddingTop: 14,
  borderTop: '1px solid var(--line)',
}

const toggleBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--muted)',
  fontSize: 13,
  cursor: 'pointer',
  padding: '8px 0 0',
  display: 'block',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
