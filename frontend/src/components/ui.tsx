import { ReactNode, useState } from 'react';
import { Icon } from './Icon';

export function Button({ children, variant = 'primary', icon, disabled, onClick, type = 'button', className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} disabled={disabled} onClick={onClick}>{children}{icon && <Icon name={icon} size={18}/>}</button>;
}

export function Chip({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={`chip ${active ? 'active' : ''}`} aria-pressed={active} onClick={onClick}>{active && <Icon name="check" size={14}/>} {children}</button>;
}

export function Field({ label, children, hint, error }: { label: string; children: ReactNode; hint?: string; error?: string }) {
  return <label className={`field ${error ? 'has-error' : ''}`}><span>{label}</span>{children}{(error || hint) && <small>{error || hint}</small>}</label>;
}

export function Avatar({ label, color = 'violet', small = false }: { label: string; color?: string; small?: boolean }) {
  return <span className={`avatar avatar-${color} ${small ? 'avatar-small' : ''}`} aria-label={label}>{label.split(' ').map(x => x[0]).slice(0, 2).join('')}</span>;
}

export function Logo() {
  return <div className="logo"><span className="logo-mark"><span>N</span></span><span>Nexus<b>Campus</b></span></div>;
}

export function Stepper({ step, total = 3 }: { step: number; total?: number }) {
  return <div className="stepper" aria-label={`Paso ${step} de ${total}`}>{Array.from({ length: total }).map((_, i) => <span key={i} className={i < step ? 'complete' : ''}/>)}</div>;
}

export function Stars({ value, editable = false }: { value: number; editable?: boolean }) {
  const [rating, setRating] = useState(Math.round(value));
  return <span className="stars" aria-label={`${rating} de 5 estrellas`}>{[1,2,3,4,5].map(n => <button disabled={!editable} aria-label={`${n} estrellas`} key={n} onClick={() => setRating(n)} className={n <= rating ? 'filled' : ''}>★</button>)}</span>;
}
