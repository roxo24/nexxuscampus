import { Icon } from './Icon';
import { skillIcons, skillDescriptions } from '../data/mock';

export function SkillCard({ label, active, onClick, compact = false }: { label: string; active: boolean; onClick: () => void; compact?: boolean }) {
  return <button
    type="button"
    className={`skill-card ${compact ? 'compact' : ''} ${active ? 'selected' : ''}`}
    aria-pressed={active}
    onClick={onClick}
    onPointerMove={event => {
      if (event.pointerType === 'touch') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      event.currentTarget.style.setProperty('--skill-rotate-x', `${(0.5 - y) * 8}deg`);
      event.currentTarget.style.setProperty('--skill-rotate-y', `${(x - 0.5) * 10}deg`);
      event.currentTarget.style.setProperty('--skill-glow-x', `${x * 100}%`);
      event.currentTarget.style.setProperty('--skill-glow-y', `${y * 100}%`);
    }}
    onPointerLeave={event => {
      event.currentTarget.style.setProperty('--skill-rotate-x', '0deg');
      event.currentTarget.style.setProperty('--skill-rotate-y', '0deg');
      event.currentTarget.style.setProperty('--skill-glow-x', '50%');
      event.currentTarget.style.setProperty('--skill-glow-y', '50%');
    }}
  >
    <span className="skill-card-icon"><Icon name={skillIcons[label] || 'spark'} size={compact ? 17 : 20}/></span>
    <span className="skill-card-copy"><b>{label}</b><small>{active ? 'Habilidad seleccionada' : compact ? skillDescriptions[label] || 'Habilidad técnica' : 'Seleccionar habilidad'}</small></span>
    <span className="skill-card-check"><Icon name="check" size={compact ? 11 : 15}/></span>
  </button>;
}

export function SkillCounter({ count, minimum }: { count: number; minimum: number }) {
  const complete = count >= minimum;
  return <span className={`skill-counter ${complete ? 'complete' : ''}`}>
    <span className="counter-dot"><Icon name={complete ? 'check' : 'plus'} size={12}/></span>
    <span><strong key={count}>{count}</strong>/{minimum}</span>
    <small>{complete ? 'Listo' : `Mínimo ${minimum}`}</small>
  </span>;
}

export function SituationCard({ number, title, description, selected, onSelect }: { number: string; title: string; description: string; selected: boolean; onSelect: () => void }) {
  return <button
    type="button"
    className={`choice-card situation-card ${selected ? 'selected' : ''}`}
    aria-pressed={selected}
    onClick={onSelect}
    onPointerMove={event => {
      if (event.pointerType === 'touch') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      event.currentTarget.style.setProperty('--situation-rotate-x', `${(0.5 - y) * 5}deg`);
      event.currentTarget.style.setProperty('--situation-rotate-y', `${(x - 0.5) * 7}deg`);
      event.currentTarget.style.setProperty('--situation-glow-x', `${x * 100}%`);
      event.currentTarget.style.setProperty('--situation-glow-y', `${y * 100}%`);
    }}
    onPointerLeave={event => {
      event.currentTarget.style.setProperty('--situation-rotate-x', '0deg');
      event.currentTarget.style.setProperty('--situation-rotate-y', '0deg');
      event.currentTarget.style.setProperty('--situation-glow-x', '50%');
      event.currentTarget.style.setProperty('--situation-glow-y', '50%');
    }}
  >
    <span className="choice-icon">{number}</span>
    <span className="situation-copy"><b>{title}</b><small>{description}</small></span>
    <i className="situation-check"><Icon name="check" size={15}/></i>
  </button>;
}
