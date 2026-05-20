import React from 'react';

interface Section {
  id: string;
  label: string;
}

interface ReadingNavProps {
  sections: Section[];
  activeSection: string;
}

export function ReadingNav({ sections, activeSection }: ReadingNavProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(245,245,247,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 0',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '0 16px',
          scrollbarWidth: 'none',
        }}
        className="reading-nav-scroll"
      >
        {sections.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.82rem)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#1d1d1f' : '#6e6e73',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #1d1d1f' : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
                flexShrink: 0,
              }}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
