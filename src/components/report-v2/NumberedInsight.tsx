import React from 'react';

interface Props {
  number: number;
  title: string;
  kpi?: string;
  explanation: string;
  comparison?: string;
  variant: 'right' | 'wrong';
  sources?: string[];
}

export function NumberedInsight({
  number,
  title,
  kpi,
  explanation,
  comparison,
  variant,
  sources,
}: Props): React.ReactElement {
  const variantClass = variant === 'right' ? 'right' : 'wrong';
  const numStr = String(number).padStart(2, '0');

  return (
    <div className={`insight-card ${variantClass}`}>
      <div className="insight-num">{numStr}</div>
      <h4>{title}</h4>
      {kpi && <div className="insight-kpi">{kpi}</div>}
      <p>{explanation}</p>
      {comparison && (
        <div className="insight-vs">
          <span>vs.</span> {comparison}
        </div>
      )}
      {sources && sources.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 10.5, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
          {sources.map((src, i) => (
            <div key={i}>&#8226; {src}</div>
          ))}
        </div>
      )}
    </div>
  );
}
