import React from 'react';

export function LaneABanner({ pillText = '2 of 6 written', text = 'Commentary is still being written. Costs and deltas are final, so you can review them now.' }) {
  return (
    <div className="lane-a-banner" role="status" aria-live="polite">
      <span className="lane-a-banner-dot" />
      <span className="lane-a-banner-pill-text">{pillText}</span>
      <span className="lane-a-banner-text">{text}</span>
    </div>
  );
}
