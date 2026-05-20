import React from 'react';

interface Props {
  eyebrow: string;
  title: string;
}

export function SectionHeader({
  eyebrow,
  title,
}: Props): React.ReactElement {
  return (
    <div>
      <div className="section-label">{eyebrow}</div>
      <h1>{title}</h1>
    </div>
  );
}
