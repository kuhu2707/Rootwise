import { Check } from 'lucide-react';

const steps = ['Choose angle', 'Set up', 'Run agents', 'Review results'];

export function ProgressSteps({ activeIndex }) {
  return (
    <div className="journey-steps" aria-label="Comparison progress">
      {steps.map((label, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return <div className={`journey-step ${done ? 'step-done' : ''} ${active ? 'step-active' : ''}`} key={label}>
          <span className="step-marker">{done ? <Check size={12} /> : `0${index + 1}`}</span>
          <span>{label}</span>
          {index < steps.length - 1 && <span className="step-line" />}
        </div>;
      })}
    </div>
  );
}
