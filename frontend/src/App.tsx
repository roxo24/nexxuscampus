import { ReactNode, useEffect, useMemo, useState } from 'react';

type Screen = 'dashboard' | 'talent' | 'partners' | 'publish' | 'messages' | 'profile' | 'project-detail';
type OnboardingStep = 1 | 2 | 3;

const hardSkills = ['UX Research', 'React', 'Finanzas', 'Marketing', 'Python', 'Diseño de producto', 'Ventas B2B'];
const softSkills = ['Comunicación', 'Liderazgo', 'Pensamiento crítico', 'Organización', 'Empatía'];
const ventures = [
  {
    name: 'Vitrina Circular',
    category: 'Economía circular',
    copy: 'El marketplace universitario que da una segunda vida a materiales, libros y prototipos.',
    image: 'https://images.unsplash.com/photo-1787647561979-da6797612e4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'lime',
    progress: '4 de 6 perfiles',
    stage: 'Prototipo en validación',
    challenge: 'Cada ciclo se descartan miles de materiales, libros y prototipos que todavía tienen valor para otros estudiantes.',
    solution: 'Una vitrina segura para intercambiar, vender o donar recursos dentro de la comunidad universitaria.',
    impact: '1,240 kg',
    impactLabel: 'de materiales recuperados',
    needs: ['Desarrollo frontend', 'Marketing', 'Operaciones'],
  },
  {
    name: 'Aula Nómada',
    category: 'EdTech',
    copy: 'Aprendizaje breve, práctico y creado por estudiantes para estudiantes.',
    image: 'https://images.unsplash.com/photo-1758873272414-c0bf30332738?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'violet',
    progress: '3 de 5 perfiles',
    stage: 'MVP en construcción',
    challenge: 'Los estudiantes con alta carga académica abandonan cursos largos aunque necesiten aprender habilidades concretas.',
    solution: 'Cápsulas de aprendizaje creadas por pares, con retos breves y resultados aplicables desde el primer día.',
    impact: '320',
    impactLabel: 'estudiantes en lista de espera',
    needs: ['Diseño UX', 'Creación de contenido', 'React'],
  },
  {
    name: 'Nexo Salud',
    category: 'HealthTech',
    copy: 'Una red de acompañamiento preventivo para comunidades universitarias.',
    image: 'https://images.unsplash.com/photo-1758873267964-66a045a75e25?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'coral',
    progress: '5 de 7 perfiles',
    stage: 'Validación con usuarios',
    challenge: 'Muchas señales tempranas de estrés y agotamiento pasan desapercibidas hasta convertirse en una crisis.',
    solution: 'Una red preventiva de orientación, seguimiento y acceso temprano a recursos de bienestar universitario.',
    impact: '87%',
    impactLabel: 'reporta mayor sensación de apoyo',
    needs: ['Psicología', 'Data Analytics', 'Alianzas'],
  },
];

const talent = [
  { id: 1, name: 'Valeria S.', career: 'Ingeniería Industrial', cycle: '8.º ciclo', skills: ['Finanzas', 'Excel avanzado', 'Pitch'], availability: 'Mar y jue · 18:00–21:00', rating: 4.9, match: 96, color: 'coral' },
  { id: 2, name: 'Diego R.', career: 'Diseño Digital', cycle: '7.º ciclo', skills: ['UX Research', 'Figma', 'Branding'], availability: 'Lun, mié y sáb · Tardes', rating: 4.8, match: 91, color: 'violet' },
  { id: 3, name: 'Lucía M.', career: 'Ciencia de Datos', cycle: '9.º ciclo', skills: ['Python', 'Analítica', 'IA aplicada'], availability: 'Vie y sáb · 09:00–14:00', rating: 4.7, match: 88, color: 'mint' },
  { id: 4, name: 'Mateo C.', career: 'Comunicación', cycle: '6.º ciclo', skills: ['Storytelling', 'Oratoria', 'Contenido'], availability: 'Lun a jue · Noches', rating: 4.9, match: 84, color: 'amber' },
  { id: 5, name: 'Ana Sofía R.', career: 'Ingeniería de Software', cycle: '7.º ciclo', skills: ['React', 'UI/UX', 'TypeScript'], availability: 'Lun, mié y vie · Tardes', rating: 4.8, match: 94, color: 'coral' },
  { id: 6, name: 'Mateo R.', career: 'Ciencia de Datos', cycle: '8.º ciclo', skills: ['Python', 'Base de datos', 'APIs'], availability: 'Mar y jue · Noches', rating: 4.6, match: 89, color: 'violet' },
  { id: 7, name: 'Valentina C.', career: 'Comunicación', cycle: '7.º ciclo', skills: ['Marketing', 'Investigación', 'Contenido'], availability: 'Lun a vie · Tardes', rating: 4.7, match: 86, color: 'amber' },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6m4-6v6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    x: <path d="m6 6 12 12M18 6 6 18"/>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-3-9-2 12"/>,
    layers: <><path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    brain: <><path d="M9.5 4A3.5 3.5 0 0 0 6 7.5v.7A3.5 3.5 0 0 0 4 14.5 3.5 3.5 0 0 0 7.5 18H9"/><path d="M14.5 4A3.5 3.5 0 0 1 18 7.5v.7a3.5 3.5 0 0 1 2 6.3 3.5 3.5 0 0 1-3.5 3.5H15M9 4v16m6-16v16M9 9H7m8 3h3M9 15H7"/></>,
    checklist: <><path d="m4 6 2 2 4-4M4 12l2 2 4-4M4 18l2 2 4-4M13 7h7M13 13h7M13 19h7"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>,
    atom: <><circle cx="12" cy="12" r="1.5"/><path d="M19.4 15c1.2-2.1-1-5.6-4.9-7.9S6.6 4.8 5.4 7s1 5.6 4.9 7.9 7.9 2.3 9.1.1z"/><path d="M19.4 9c-1.2-2.1-5.2-2.1-9.1.1S4.2 14.9 5.4 17s5.2 2.1 9.1-.1 6.1-5.8 4.9-7.9z"/></>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({ children, variant = 'primary', icon, disabled, onClick, type = 'button', className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} disabled={disabled} onClick={onClick}>{children}{icon && <Icon name={icon} size={18}/>}</button>;
}

function Chip({ children, active = false, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return <button type="button" className={`chip ${active ? 'active' : ''}`} aria-pressed={active} onClick={onClick}>{active && <Icon name="check" size={14}/>} {children}</button>;
}

const skillIcons: Record<string, string> = {
  'UX Research': 'search',
  React: 'atom',
  Finanzas: 'spark',
  Marketing: 'send',
  Python: 'code',
  'Diseño de producto': 'layers',
  'Ventas B2B': 'users',
  Comunicación: 'chat',
  Liderazgo: 'users',
  'Pensamiento crítico': 'brain',
  Organización: 'checklist',
  Empatía: 'heart',
};

const skillDescriptions: Record<string, string> = {
  'UX Research': 'Diseño de experiencia',
  React: 'Desarrollo frontend',
  Finanzas: 'Gestión financiera',
  Marketing: 'Estrategia de crecimiento',
  Python: 'Desarrollo y datos',
  'Diseño de producto': 'Producto digital',
  'Ventas B2B': 'Desarrollo comercial',
};

function SkillCard({ label, active, onClick, compact = false }: { label: string; active: boolean; onClick: () => void; compact?: boolean }) {
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

function SkillCounter({ count, minimum }: { count: number; minimum: number }) {
  const complete = count >= minimum;
  return <span className={`skill-counter ${complete ? 'complete' : ''}`}>
    <span className="counter-dot"><Icon name={complete ? 'check' : 'plus'} size={12}/></span>
    <span><strong key={count}>{count}</strong>/{minimum}</span>
    <small>{complete ? 'Listo' : `Mínimo ${minimum}`}</small>
  </span>;
}

function SituationCard({ number, title, description, selected, onSelect }: { number: string; title: string; description: string; selected: boolean; onSelect: () => void }) {
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

function Field({ label, children, hint, error }: { label: string; children: ReactNode; hint?: string; error?: string }) {
  return <label className={`field ${error ? 'has-error' : ''}`}><span>{label}</span>{children}{(error || hint) && <small>{error || hint}</small>}</label>;
}

function Avatar({ label, color = 'violet', small = false }: { label: string; color?: string; small?: boolean }) {
  return <span className={`avatar avatar-${color} ${small ? 'avatar-small' : ''}`} aria-label={label}>{label.split(' ').map(x => x[0]).slice(0, 2).join('')}</span>;
}

function Logo() {
  return <div className="logo"><span className="logo-mark"><span>N</span></span><span>Nexus<b>Campus</b></span></div>;
}

function Stepper({ step, total = 3 }: { step: number; total?: number }) {
  return <div className="stepper" aria-label={`Paso ${step} de ${total}`}>{Array.from({ length: total }).map((_, i) => <span key={i} className={i < step ? 'complete' : ''}/>)}</div>;
}

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [accepted, setAccepted] = useState(false);
  const [hard, setHard] = useState<string[]>(['UX Research', 'React']);
  const [soft, setSoft] = useState<string[]>(['Comunicación']);
  const [objective, setObjective] = useState<'team' | 'project'>('team');
  const [project, setProject] = useState({ name: '', sector: '', description: '' });
  const [loading, setLoading] = useState(false);
  const skillsReady = hard.length >= 2 && soft.length >= 1;
  const toggle = (item: string, list: string[], setter: (x: string[]) => void) => setter(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  const finish = () => {
    setLoading(true);
    window.setTimeout(() => { setLoading(false); onComplete(); }, 900);
  };
  return <main className="onboarding-shell">
    <header className="onboarding-header"><Logo/><Stepper step={step}/><span className="secure">Perfil verificado</span></header>
    <section className="onboarding-card">
      <div className="eyebrow">PASO {step} DE 3</div>
      {step === 1 && <>
        <h1>Confirma tu identidad académica</h1>
        <p className="lead">Usamos estos datos únicamente para validar tu acceso. Tu universidad nunca se mostrará en tu perfil público.</p>
        <div className="form-grid">
          <Field label="Nombres"><input value="Camila" readOnly/></Field>
          <Field label="Apellidos"><input value="Torres Salazar" readOnly/></Field>
          <Field label="Carrera"><input value="Ingeniería Empresarial" readOnly/></Field>
          <Field label="Correo universitario"><input value="camila.torres@universidad.edu.pe" readOnly/></Field>
        </div>
        <label className="check-row"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}/><span><b>Acepto los Términos y Condiciones</b><small>Incluye nuestras reglas de convivencia y privacidad.</small></span></label>
        <Button className="wide" disabled={!accepted} icon="arrow" onClick={() => setStep(2)}>Confirmar</Button>
      </>}
      {step === 2 && <>
        <div className="skill-step-heading"><span><Icon name="spark"/></span><div><h1>Cuéntanos qué aportas al equipo</h1><p>Construye tu identidad de talento seleccionando las fortalezas que mejor te representan.</p></div></div>
        <section className="skill-group">
          <div className="skill-group-heading"><div><span>01</span><div><h2>Hard skills</h2><p>Conocimientos técnicos que puedes aplicar desde el primer día.</p></div></div><SkillCounter count={hard.length} minimum={2}/></div>
          <div className="skill-card-grid soft">{hardSkills.map(x => <SkillCard key={x} label={x} active={hard.includes(x)} onClick={() => toggle(x, hard, setHard)}/>)}</div>
        </section>
        <section className="skill-group">
          <div className="skill-group-heading"><div><span>02</span><div><h2>Soft skills</h2><p>La forma en que colaboras, comunicas y haces avanzar al equipo.</p></div></div><SkillCounter count={soft.length} minimum={1}/></div>
          <div className="skill-card-grid soft">{softSkills.map(x => <SkillCard key={x} label={x} active={soft.includes(x)} onClick={() => toggle(x, soft, setSoft)}/>)}</div>
        </section>
        <div className="talent-tip"><Icon name="spark"/><span><b>Un perfil claro genera mejores conexiones</b>Selecciona habilidades que puedas demostrar en un proyecto real.</span></div>
        <div className="button-row skill-actions"><Button variant="ghost" onClick={() => setStep(1)}>Volver</Button><Button className={skillsReady ? 'ready-pulse' : ''} disabled={!skillsReady} icon="arrow" onClick={() => setStep(3)}>Continuar a mi objetivo</Button></div>
      </>}
      {step === 3 && <>
        <h1>¿Cuál es tu situación actual en el campus?</h1>
        <p className="lead">Elige lo que quieres lograr primero. Podrás cambiarlo más adelante.</p>
        <div className="choice-grid">
          <SituationCard number="01" title="Busco un equipo" description="Quiero sumarme a una idea y aportar mis habilidades." selected={objective === 'team'} onSelect={() => setObjective('team')}/>
          <SituationCard number="02" title="Tengo un proyecto" description="Busco talento para completar mi equipo." selected={objective === 'project'} onSelect={() => setObjective('project')}/>
        </div>
        {objective === 'project' && <div className="project-fields">
          <Field label="Nombre o título provisional"><input placeholder="Ej. Mercado Circular" value={project.name} onChange={e => setProject({ ...project, name: e.target.value })}/></Field>
          <Field label="Sector"><input placeholder="Ej. Educación, Fintech o Sostenibilidad" value={project.sector} onChange={e => setProject({ ...project, sector: e.target.value })}/></Field>
          <Field label="Descripción"><textarea rows={4} placeholder="Cuéntanos brevemente qué problema resuelve tu proyecto y cómo imaginas la solución." value={project.description} onChange={e => setProject({ ...project, description: e.target.value })}/></Field>
        </div>}
        <div className="button-row"><Button variant="ghost" onClick={() => setStep(2)}>Volver</Button><Button disabled={loading || (objective === 'project' && Object.values(project).some(x => !x))} icon={loading ? undefined : 'arrow'} onClick={finish}>{loading ? 'Activando tu perfil…' : objective === 'team' ? 'Activar mi perfil' : 'Activar perfil'}</Button></div>
      </>}
    </section>
    <p className="onboarding-foot">NexusCampus protege tu identidad institucional durante el matching.</p>
  </main>;
}

function Stars({ value, editable = false }: { value: number; editable?: boolean }) {
  const [rating, setRating] = useState(Math.round(value));
  return <span className="stars" aria-label={`${rating} de 5 estrellas`}>{[1,2,3,4,5].map(n => <button disabled={!editable} aria-label={`${n} estrellas`} key={n} onClick={() => setRating(n)} className={n <= rating ? 'filled' : ''}>★</button>)}</span>;
}

function TalentCard({ person, onInvite }: { person: typeof talent[number]; onInvite: () => void }) {
  return <article className="talent-card">
    <div className="talent-top"><Avatar label={person.name} color={person.color}/><span className="match">{person.match}% match</span></div>
    <div><h3>{person.name}</h3><p>{person.career} · {person.cycle}</p></div>
    <div className="mini-chips">{person.skills.map(x => <span key={x}>{x}</span>)}</div>
    <div className="talent-proof"><span><Icon name="spark" size={15}/> Responde rápido</span><span>3 proyectos</span></div>
    <div className="talent-bottom"><span><Stars value={person.rating}/> <b>{person.rating}</b></span><Button variant="secondary" onClick={onInvite}>Invitar</Button></div>
  </article>;
}

function Dashboard({ go }: { go: (screen: Screen) => void }) {
  return <div className="page dashboard-page">
    <section className="dashboard-hero">
      <div className="hero-copy"><div className="eyebrow">TU CAMPUS DE IDEAS</div><h1>Las grandes ideas no nacen solas.</h1><p>Descubre proyectos que están buscando una mente como la tuya o encuentra el talento que llevará tu idea más lejos.</p><div><Button icon="search" onClick={() => go('talent')}>Explorar talento</Button><Button variant="secondary" icon="plus" onClick={() => go('publish')}>Crear un proyecto</Button></div></div>
      <div className="hero-collage"><img src={ventures[0].image} alt="Equipo universitario colaborando en un proyecto"/><div className="hero-float"><span><Icon name="spark" size={16}/></span><div><b>Match encontrado</b><small>Campus Green</small></div><i/></div><div className="hero-stat"><strong>94%</strong><span>compatibilidad</span></div><div className="hero-project-card"><small>PROYECTO <em>Buscando equipo</em></small><b>Campus Green</b><div><span>React</span><span>UX/UI</span></div></div></div>
    </section>

    <section className="home-story">
      <div className="home-story-visual">
        <article className="story-profile"><Avatar label="Lucía Morales" color="violet"/><h3>Lucía Morales</h3><p>Diseño de producto</p><div><span>UI/UX</span><span>Figma</span></div></article>
        <span className="story-match-icon"><Icon name="spark"/></span>
        <article className="story-project"><small>PROYECTO</small><h3>Campus Green</h3><p>Busca talento para crear una experiencia más sostenible.</p><b><Icon name="check" size={14}/> Match por habilidades</b></article>
      </div>
      <div className="home-section-copy"><div className="eyebrow">HECHO PARA COLABORAR</div><h2>Las buenas ideas necesitan el equipo adecuado.</h2><p>Encontrar compañeros con habilidades complementarias puede ser difícil. NexusCampus conecta a quienes tienen una idea con estudiantes que buscan una oportunidad para participar.</p></div>
    </section>

    <section className="home-how">
      <div className="home-centered-heading"><div className="eyebrow">SIMPLE Y DIRECTO</div><h2>¿Cómo funciona NexusCampus?</h2><p>De tu perfil a un equipo listo para construir, en cuatro pasos.</p></div>
      <div className="home-step-grid">
        {[
          ['user','Crea tu perfil','Indica tu carrera, tus habilidades y si tienes un proyecto o buscas formar parte de uno.'],
          ['search','Descubre','Explora estudiantes y proyectos que coinciden con tus intereses y necesidades.'],
          ['send','Conecta','Encuentra personas compatibles y envía una invitación para colaborar.'],
          ['users','Forma tu equipo','Al aceptar la invitación, se crea un espacio de comunicación para comenzar.'],
        ].map((step, index) => <article className="home-step" key={step[1]}><span><Icon name={step[0]}/></span><em>0{index + 1}</em><h3>{step[1]}</h3><p>{step[2]}</p></article>)}
      </div>
    </section>

    <section className="home-smart">
      <div className="home-section-copy"><div className="eyebrow">SMART MATCHING</div><h2>Encuentra las habilidades que tu proyecto necesita.</h2><p>Describe qué necesitas. NexusCampus prioriza las habilidades, las necesidades de tu proyecto y la carrera cuando es relevante.</p><div className="home-tag-cloud"><span>+ React</span><span>+ UI/UX</span><span>+ Python</span><span>+ Marketing</span></div></div>
      <div className="home-match-demo">
        <div className="demo-search"><small><Icon name="spark" size={14}/> ¿Qué estás buscando?</small><div><Icon name="search" size={18}/><span>Desarrollar la aplicación web y ayudar con el producto</span><b>Buscar talento</b></div></div>
        {[['Ana Sofía','Ingeniería de Software',['React','UI/UX','TypeScript'],'94%','coral'],['Mateo Ríos','Ciencia de Datos',['Python','Base de datos','APIs'],'89%','mint'],['Valentina Cruz','Comunicación',['Marketing','Investigación','Contenido'],'84%','amber']].map(person => <article className="demo-person" key={person[0] as string}><Avatar label={person[0] as string} color={person[4] as string}/><div><h3>{person[0]}</h3><p>{person[1]}</p><span>{(person[2] as string[]).map(skill => <i key={skill}>{skill}</i>)}</span></div><strong>{person[3]}<small>MATCH</small></strong></article>)}
      </div>
    </section>

    <section className="home-project-demo">
      <div className="home-section-copy"><div className="eyebrow">LIDERA UNA IDEA</div><h2>¿Tienes una idea? Encuentra a tu equipo.</h2><p>Publica tu proyecto, define las habilidades que necesitas y conecta con estudiantes que quieren construirlo contigo.</p><span className="home-fake-cta">Publicar mi proyecto <Icon name="plus" size={18}/></span></div>
      <div className="fake-project-form"><header><span><small>Nuevo proyecto</small><b>Cuéntanos sobre tu idea</b></span><em>Borrador</em></header><div className="fake-field wide"><small>NOMBRE DEL PROYECTO</small><b>Mi proyecto universitario</b></div><div className="fake-form-grid"><div className="fake-field"><small>SECTOR</small><b>Tecnología</b></div><div className="fake-field"><small>NIVEL DE MADUREZ</small><b>Idea inicial</b></div></div><div className="fake-field wide"><small>HABILIDADES QUE NECESITAS</small><span><i>Desarrollo Web</i><i>Diseño UX</i><i>+ Añadir</i></span></div><div className="fake-optional">Carrera requerida <span>Opcional</span></div></div>
    </section>

    <section className="home-flow">
      <div className="home-centered-heading"><div className="eyebrow">DEL MATCH A LA ACCIÓN</div><h2>Una conexión se convierte en un equipo.</h2><p>Proyecto, vacante, invitación y aceptación: un flujo claro para empezar a colaborar.</p></div>
      <div className="home-flow-grid"><article><small>PROYECTO</small><h3>Campus Green</h3><p>Vacante: Desarrollo Web</p><div><span>React</span><span>APIs</span></div></article><i><Icon name="chevronRight"/></i><article className="flow-person"><Avatar label="Ana Sofía" color="violet"/><span><h3>Ana Sofía</h3><p>Desarrollo Web · React</p></span><b>Invitar al proyecto</b></article><i><Icon name="chevronRight"/></i><article className="flow-success"><span><Icon name="check"/></span><h3>Invitación aceptada</h3><p>Ana ya forma parte del equipo.</p><div><Avatar label="Lucía Morales" small/><Avatar label="Mateo Ríos" color="mint" small/><Avatar label="Ana Sofía" color="violet" small/></div></article></div>
    </section>
  </div>;
}

function ProjectDetail({ project, onBack, onDiscover }: { project: typeof ventures[number]; onBack: () => void; onDiscover: () => void }) {
  const [applied, setApplied] = useState(false);
  return <div className="project-detail-page">
    <section className="project-detail-cover">
      <img src={project.image} alt={`Equipo desarrollando ${project.name}`}/>
      <div className="project-detail-shade"/>
      <button className="project-back" onClick={onBack}>← Volver a ideas</button>
      <div className="project-cover-copy"><div><span>{project.category}</span><span>{project.stage}</span></div><h1>{project.name}</h1><p>{project.copy}</p><div className="project-cover-actions"><Button icon="send" onClick={() => setApplied(true)}>{applied ? 'Solicitud enviada' : 'Quiero ser parte'}</Button><Button variant="secondary" onClick={onDiscover}>Ver perfiles similares</Button></div></div>
      <aside className="project-need-card"><small>EQUIPO EN FORMACIÓN</small><strong>{project.progress}</strong><div className="project-member-stack"><Avatar label="Camila Torres" color="coral"/><Avatar label="Diego R" color="violet"/><Avatar label="Lucía M" color="mint"/><span>+2</span></div><p>Buscamos personas curiosas, comprometidas y dispuestas a construir en equipo.</p></aside>
    </section>
    <main className="project-detail-content">
      {applied && <div className="project-application-success"><Icon name="check"/><div><b>Tu interés fue enviado al equipo</b><p>La persona responsable revisará tu perfil y recibirás una notificación con la respuesta.</p></div></div>}
      <section className="project-story">
        <article><div className="eyebrow">EL RETO</div><h2>¿Qué problema queremos resolver?</h2><p>{project.challenge}</p></article>
        <article><div className="eyebrow">NUESTRA PROPUESTA</div><h2>Una solución nacida en el campus</h2><p>{project.solution}</p></article>
      </section>
      <section className="project-detail-grid">
        <article className="project-impact"><div className="eyebrow">IMPACTO TEMPRANO</div><strong>{project.impact}</strong><p>{project.impactLabel}</p><div className="impact-chart"><i/><i/><i/><i/><i/><i/></div></article>
        <article className="project-roles"><div className="eyebrow">PERFILES QUE BUSCAMOS</div><h2>El siguiente gran paso necesita estas habilidades</h2><div>{project.needs.map((need, index) => <span key={need}><i>0{index + 1}</i>{need}<Icon name="arrow" size={15}/></span>)}</div></article>
        <article className="project-roadmap"><div className="eyebrow">HOJA DE RUTA</div><h2>De la idea al impacto</h2><ol><li className="done"><i><Icon name="check" size={13}/></i><span><b>Descubrimiento</b><small>Entrevistas y definición del reto</small></span></li><li className="current"><i>2</i><span><b>{project.stage}</b><small>Construyendo y aprendiendo con usuarios</small></span></li><li><i>3</i><span><b>Primera comunidad</b><small>Lanzamiento piloto y medición</small></span></li></ol></article>
      </section>
      <section className="project-cta"><div><div className="eyebrow">CONSTRUYAMOS JUNTOS</div><h2>Tu experiencia puede cambiar el rumbo de esta idea.</h2><p>No necesitas tener todas las respuestas. Buscamos personas que quieran descubrirlas en equipo.</p></div><Button icon="send" onClick={() => setApplied(true)}>{applied ? 'Solicitud enviada' : 'Presentar mi perfil'}</Button></section>
    </main>
  </div>;
}

function Explore({ onInvite, onOpenProject }: { onInvite: (person?: typeof talent[number]) => void; onOpenProject: (project: typeof ventures[number]) => void }) {
  const [tab, setTab] = useState('ai');
  const [resultVersion, setResultVersion] = useState(0);
  const [selected, setSelected] = useState(['Finanzas', 'Diseño UX']);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [activeMatch, setActiveMatch] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<'next' | 'previous'>('next');
  const [ventureIndex, setVentureIndex] = useState(0);
  const skillAliases: Record<string, string[]> = {
    'Desarrollo web': ['react', 'python', 'frontend', 'typescript', 'apis'],
    'Diseño UX': ['ux research', 'figma', 'branding', 'ui/ux'],
    Finanzas: ['finanzas', 'excel avanzado', 'pitch'],
    Marketing: ['storytelling', 'oratoria', 'contenido', 'marketing', 'investigación'],
    Python: ['python', 'analítica', 'ia aplicada', 'base de datos', 'apis'],
  };
  const careerOptions = ['Ingeniería Industrial', 'Ingeniería de Software', 'Diseño Digital', 'Ciencia de Datos', 'Comunicación'];
  const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const visibleTalent = useMemo(() => {
    const query = normalizeSearch(appliedQuery.trim());
    return talent.filter(person => {
      const normalizedCareer = normalizeSearch(person.career);
      const searchable = normalizeSearch(`${person.career} ${person.skills.join(' ')}`);
      const queryMatches = !query || searchable.includes(query);
      if (tab === 'skill') {
        const skillsMatch = selected.length === 0 || selected.some(skill => (skillAliases[skill] || [skill]).some(alias => searchable.includes(normalizeSearch(alias))));
        return queryMatches && skillsMatch;
      }
      if (tab === 'career') {
        const careerMatches = selectedCareers.length === 0 || selectedCareers.some(career => normalizedCareer === normalizeSearch(career));
        const careerQueryMatches = !query || normalizedCareer.includes(query);
        return careerMatches && careerQueryMatches;
      }
      return true;
    });
  }, [appliedQuery, selected, selectedCareers, tab]);
  const activeTalent = visibleTalent[activeMatch];
  const matchReasons: Record<number, string> = {
    1: 'Su experiencia en finanzas y presentación estratégica complementa exactamente las necesidades de Vitrina Circular.',
    2: 'Su enfoque en investigación y diseño puede convertir los hallazgos del equipo en una experiencia clara y útil.',
    3: 'Su dominio de datos e inteligencia artificial permite validar decisiones y descubrir oportunidades de crecimiento.',
    4: 'Su capacidad para comunicar ideas complejas puede fortalecer la propuesta, el pitch y la llegada a nuevos usuarios.',
    5: 'Su experiencia con React, TypeScript y diseño de interfaces permite transformar rápidamente una idea en un producto.',
    6: 'Su perfil combina análisis de datos, arquitectura de información y APIs para construir soluciones escalables.',
    7: 'Su mirada de marketing e investigación ayuda a entender audiencias y comunicar el valor del proyecto.',
  };
  const refreshResults = () => {
    setResultVersion(version => version + 1);
    setActiveMatch(0);
  };
  const moveCarousel = (direction: 'next' | 'previous') => {
    if (!visibleTalent.length) return;
    setCarouselDirection(direction);
    setActiveMatch(current => direction === 'next' ? (current + 1) % visibleTalent.length : (current - 1 + visibleTalent.length) % visibleTalent.length);
  };
  useEffect(() => {
    if (visibleTalent.length <= 1) return;
    const timer = window.setTimeout(() => {
      setCarouselDirection('next');
      setActiveMatch(current => (current + 1) % visibleTalent.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [activeMatch, resultVersion, tab, visibleTalent.length]);
  useEffect(() => {
    const timer = window.setTimeout(() => setVentureIndex(current => (current + 1) % ventures.length), 5000);
    return () => window.clearTimeout(timer);
  }, [ventureIndex]);
  return <div className="page explore-page">
    <section className="explore-hero"><div><div className="eyebrow">MATCHING INTELIGENTE</div><h1>Encuentra a la persona que tu idea necesita.</h1><p>Describe el reto. Nosotros conectamos habilidades, experiencia e intereses para mostrarte perfiles realmente complementarios.</p></div><div className="explore-orbit"><span><Avatar label="Valeria S" color="coral"/></span><span><Avatar label="Diego R" color="violet"/></span><span><Avatar label="Lucía M" color="mint"/></span><i><Icon name="spark"/></i></div></section>
    <section className="talent-finder">
      <div className="finder-tabs">{[['ai','Asistente con IA'],['skill','Por habilidades'],['career','Por carrera']].map(t => <button className={tab === t[0] ? 'active' : ''} onClick={() => { setTab(t[0]); setAppliedQuery(''); setSearchQuery(''); refreshResults(); }} key={t[0]}>{t[1]}{t[0] === 'ai' && <small>NUEVO</small>}</button>)}</div>
      <div className="finder-search"><Icon name={tab === 'ai' ? 'spark' : 'search'}/><input aria-label="Buscar talento" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { setAppliedQuery(searchQuery); refreshResults(); } }} placeholder={tab === 'skill' ? 'Ej. UX Research, Python, finanzas o diseño' : tab === 'career' ? 'Ej. Ingeniería Industrial o Ciencia de Datos' : 'Ej. Necesito validar costos y convertir los datos en un pitch convincente'}/><Button onClick={() => { setAppliedQuery(searchQuery); refreshResults(); }}>Buscar talento</Button></div>
      {tab === 'skill' && <><div className="skill-discovery"><span>Explora por habilidad</span>{['Todos','Desarrollo web','Diseño UX','Finanzas','Marketing','Python'].map(skill => <Chip key={skill} active={skill === 'Todos' ? selected.length === 0 : selected.includes(skill)} onClick={() => { setSelected(skill === 'Todos' ? [] : selected.includes(skill) ? selected.filter(item => item !== skill) : [...selected, skill]); refreshResults(); }}>{skill}</Chip>)}</div><div className="skill-search-status"><span><b>{visibleTalent.length}</b> perfil{visibleTalent.length === 1 ? '' : 'es'} compatible{visibleTalent.length === 1 ? '' : 's'} con tu búsqueda</span>{(selected.length > 0 || appliedQuery) && <button onClick={() => { setSelected([]); setSearchQuery(''); setAppliedQuery(''); refreshResults(); }}>Limpiar filtros</button>}</div></>}
      {tab === 'career' && <><div className="skill-discovery career-discovery"><span>Explora por carrera</span><Chip active={selectedCareers.length === 0} onClick={() => { setSelectedCareers([]); refreshResults(); }}>Todas</Chip>{careerOptions.map(career => <Chip key={career} active={selectedCareers.includes(career)} onClick={() => { setSelectedCareers(selectedCareers.includes(career) ? selectedCareers.filter(item => item !== career) : [...selectedCareers, career]); refreshResults(); }}>{career}</Chip>)}</div><div className="skill-search-status career-search-status"><span><b>{visibleTalent.length}</b> perfil{visibleTalent.length === 1 ? '' : 'es'} de la carrera seleccionada</span>{(selectedCareers.length > 0 || appliedQuery) && <button onClick={() => { setSelectedCareers([]); setSearchQuery(''); setAppliedQuery(''); refreshResults(); }}>Limpiar carreras</button>}</div></>}
    </section>
    {(tab === 'skill' || tab === 'career') && visibleTalent.length > 0 && <section className="match-people-preview"><div><span>COINCIDENCIAS ENCONTRADAS</span><small>Selecciona un perfil para ver sus detalles</small></div><div className="match-people-row">{visibleTalent.slice(0,3).map((person, index) => <button key={person.id} className={activeMatch === index ? 'active' : ''} onClick={() => { setCarouselDirection(index > activeMatch ? 'next' : 'previous'); setActiveMatch(index); }}><span className="match-circle"><Avatar label={person.name} color={person.color}/><i>{person.match}%</i></span><b>{person.name}</b><small>{person.career}</small><em>{person.skills.slice(0,2).join(' · ')}</em></button>)}</div></section>}
    {activeTalent ? <section className="featured-match ai-match-carousel result-reveal">
      <div className="ai-carousel-track">
        <div className="featured-match-copy"><span className="match">{activeTalent.match}% COMPATIBLE</span><h2>Un match que vale la pena conocer</h2><p>{matchReasons[activeTalent.id]}</p><div className="mini-chips">{activeTalent.skills.map(skill => <span key={skill}>{skill}</span>)}</div><Button icon="arrow" onClick={() => onInvite(activeTalent)}>Conectar con este perfil</Button></div>
        <div className="featured-person-viewport"><div key={`${tab}-${resultVersion}-${activeTalent.id}`} className={`featured-person purple-profile-slide slide-${carouselDirection}`}><Avatar label={activeTalent.name} color={activeTalent.color}/><span><b>{activeTalent.career}</b><small>{activeTalent.cycle} · {activeTalent.rating} de reputación</small></span><div className="match-bars">{[1,2,3,4,5].map((bar, index) => <i key={bar} className={index >= Math.round(activeTalent.rating) ? 'muted' : ''}/>)}</div></div></div>
      </div>
      <button className="ai-carousel-arrow previous" aria-label="Perfil anterior" onClick={() => moveCarousel('previous')}><Icon name="chevronLeft" size={21}/></button>
      <button className="ai-carousel-arrow next" aria-label="Siguiente perfil" onClick={() => moveCarousel('next')}><Icon name="chevronRight" size={21}/></button>
      <div className="ai-carousel-dots" aria-label="Perfiles sugeridos">{visibleTalent.map((person, index) => <button key={person.id} className={index === activeMatch ? 'active' : ''} aria-label={`Ver perfil ${index + 1}`} onClick={() => { setCarouselDirection(index > activeMatch ? 'next' : 'previous'); setActiveMatch(index); }}/>)}</div>
      <span className="ai-carousel-count">0{activeMatch + 1} / 0{visibleTalent.length}</span>
    </section> : <section className="talent-search-empty"><span><Icon name="search" size={25}/></span><h2>No encontramos perfiles con esos filtros</h2><p>Prueba retirando una habilidad o utiliza un término más amplio.</p><Button variant="secondary" onClick={() => { setSelected([]); setSearchQuery(''); setAppliedQuery(''); refreshResults(); }}>Mostrar todos los perfiles</Button></section>}
    <section className="discover-ventures">
      <div className="section-heading"><div><div className="eyebrow">IDEAS EN MOVIMIENTO</div><h2>Emprendimientos que buscan talento</h2><p>Descubre proyectos activos y encuentra dónde puede generar mayor impacto tu experiencia.</p></div><div className="carousel-controls"><button aria-label="Proyecto anterior" onClick={() => setVentureIndex(current => (current - 1 + ventures.length) % ventures.length)}><Icon name="chevronLeft" size={20}/></button><button aria-label="Siguiente proyecto" onClick={() => setVentureIndex(current => (current + 1) % ventures.length)}><Icon name="chevronRight" size={20}/></button></div></div>
      <div className="discover-venture-viewport">
        <div className={`discover-venture-track venture-index-${ventureIndex}`}>
          {ventures.map((venture, index) => <article className={`discover-venture-card ${index === ventureIndex ? 'active' : ''}`} key={venture.name}>
            <img src={venture.image} alt={`Equipo de ${venture.name}`}/><div className="discover-venture-overlay"/>
            <div className="discover-venture-content"><div><span>{venture.category}</span>{index === 0 && <em>Destacado</em>}</div><h3>{venture.name}</h3><p>{venture.copy}</p><footer><small>{venture.progress}</small><button onClick={() => onOpenProject(venture)}>Conocer proyecto <Icon name="arrow" size={15}/></button></footer></div>
          </article>)}
        </div>
      </div>
      <div className="discover-venture-dots">{ventures.map((venture, index) => <button key={venture.name} className={index === ventureIndex ? 'active' : ''} aria-label={`Ver ${venture.name}`} onClick={() => setVentureIndex(index)}/>)}</div>
    </section>
  </div>;
}

function Publish() {
  const [step, setStep] = useState(1);
  const [maturity, setMaturity] = useState('prototype');
  const [needs, setNeeds] = useState(['Desarrollo frontend']);
  const [published, setPublished] = useState(false);
  return <div className="page narrow-page">
    <div className="page-title"><div><div className="eyebrow">NUEVO EMPRENDIMIENTO</div><h1>Convierte tu idea en un equipo</h1><p>Completa lo esencial. Siempre podrás mejorarlo después.</p></div><span className="status">Borrador guardado</span></div>
    <Stepper step={step}/>
    <section className="form-panel">
      <div className="form-step-head"><span>0{step}</span><div><h2>{step === 1 ? 'Datos generales' : step === 2 ? 'Etapa de madurez' : 'Necesidades del equipo'}</h2><p>{step === 1 ? 'Dale contexto a las personas que descubrirán tu proyecto.' : step === 2 ? 'Esto nos ayuda a recomendar perfiles con experiencia adecuada.' : 'Define qué perfiles harán avanzar tu siguiente hito.'}</p></div></div>
      {step === 1 && <div className="stack"><Field label="Nombre del emprendimiento"><input defaultValue="Aula Nómada"/></Field><Field label="Sector"><select defaultValue="Educación"><option>Educación</option><option>Fintech</option><option>Salud</option></select></Field><Field label="Problema y solución"><textarea rows={5} defaultValue="Ayudamos a estudiantes con poco tiempo a aprender mediante cápsulas prácticas creadas por pares."/></Field></div>}
      {step === 2 && <div className="maturity-grid">{[['idea','Idea inicial','Estamos definiendo el problema'],['prototype','Prototipo en desarrollo','Ya podemos mostrar cómo funciona'],['market','Validación en mercado','Tenemos usuarios o primeras ventas']].map(x => <button className={`maturity ${maturity === x[0] ? 'selected' : ''}`} onClick={() => setMaturity(x[0])} key={x[0]}><span>{x[0] === 'idea' ? '01' : x[0] === 'prototype' ? '02' : '03'}</span><b>{x[1]}</b><small>{x[2]}</small>{maturity === x[0] && <i><Icon name="check" size={14}/></i>}</button>)}</div>}
      {step === 3 && <div className="stack"><Field label="¿Qué habilidades necesita tu equipo?" hint="Selecciona al menos una habilidad."><div className="chips">{['Desarrollo frontend','Ventas B2B','Finanzas','UX Research','Marketing'].map(x => <Chip key={x} active={needs.includes(x)} onClick={() => setNeeds(needs.includes(x) ? needs.filter(n => n !== x) : [...needs,x])}>{x}</Chip>)}</div></Field>{published && <div className="success-banner"><Icon name="check"/><span><b>Tu proyecto ya está activo</b>Ahora puede aparecer en las búsquedas de talento.</span></div>}</div>}
      <div className="button-row split"><Button variant="secondary">Guardar borrador</Button><div>{step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Volver</Button>}<Button icon={step < 3 ? 'arrow' : 'check'} disabled={step === 3 && needs.length === 0} onClick={() => step < 3 ? setStep(step + 1) : setPublished(true)}>{step < 3 ? 'Continuar' : 'Publicar en vitrina'}</Button></div></div>
    </section>
  </div>;
}

function Messages({ onLeave, initialProject }: { onLeave: () => void; initialProject: string }) {
  const [activeRoom, setActiveRoom] = useState(initialProject);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ own: false, name: 'NexusCampus', text: `¡Conexión confirmada! Ya puedes conversar con ${initialProject} y comenzar a coordinar.`, time: 'Ahora', system: true },{ own: false, name: initialProject, text: '¡Hola! Me alegra que hayamos conectado. Cuéntame más sobre lo que te gustaría construir.', time: 'Ahora' }]);
  useEffect(() => setActiveRoom(initialProject), [initialProject]);
  const send = () => { if (message.trim()) { setMessages([...messages, { own: true, name: 'Tú', text: message, time: 'Ahora' }]); setMessage(''); } };
  const baseRooms = [['Vitrina Circular','Diego: Revisé el brief…','10:28','2'],['Aula Nómada','Nuevo equipo conectado','Ahora','1'],['Comunidad Nexus','Nuevo evento este viernes','Lun','']];
  const rooms = baseRooms.some(room => room[0] === initialProject) ? baseRooms : [[initialProject,'Conexión nueva · Chat disponible','Ahora','1'],...baseRooms];
  const directPerson = talent.find(person => person.name === activeRoom);
  return <div className="chat-layout chat-polished">
    <aside className="rooms"><div className="rooms-head"><h2>Mensajes</h2><button><Icon name="plus"/></button></div><div className="room-search"><Icon name="search" size={16}/><input placeholder="Buscar conversación"/></div>
      {rooms.map(r => <button className={`room ${activeRoom===r[0]?'active':''}`} onClick={() => setActiveRoom(r[0])} key={r[0]}><div className="project-logo">{r[0].split(' ').map(x=>x[0]).join('').slice(0,2)}</div><span><b>{r[0]}</b><small>{r[1]}</small></span><em>{r[2]}{r[3] && <i>{r[3]}</i>}</em></button>)}
    </aside>
    <section className="conversation"><header><div><div className="project-logo">{activeRoom.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><span><h2>{activeRoom}</h2><p><i/> {directPerson ? 'Conexión confirmada · Chat directo' : 'Nuevo chat de equipo · 4 integrantes'}</p></span></div><div className="chat-members">{directPerson ? <><Avatar label={directPerson.name} color={directPerson.color} small/><span className="direct-chat-label"><Icon name="check" size={13}/> Conectados</span></> : <><Avatar label="Diego R" color="violet" small/><Avatar label="Lucía M" color="mint" small/><Avatar label="Camila T" color="coral" small/><Button variant="ghost" onClick={onLeave}><Icon name="logout" size={17}/> Salir del emprendimiento</Button></>}</div></header>
      <div className="messages"><div className="day-divider">HOY</div>{messages.map((m,i) => <div className={`message ${m.own?'own':''} ${m.system?'system':''}`} key={i}>{!m.own && !m.system && <Avatar label={m.name} color="violet" small/>}<div>{m.system && <Icon name="spark"/>}<b>{m.system ? 'Equipo conectado con éxito' : m.name}</b><p>{m.text}</p><small>{m.time}</small></div></div>)}</div>
      <footer><div><button aria-label="Adjuntar"><Icon name="plus"/></button><input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Escribe un mensaje al equipo…"/><button className="send" onClick={send} aria-label="Enviar"><Icon name="send" size={18}/></button></div><small>Diego está escribiendo…</small></footer>
    </section>
  </div>;
}

function Partners({ initialConnected, onChat }: { initialConnected: number[]; onChat: (person: string) => void }) {
  const [connected, setConnected] = useState<number[]>(initialConnected);
  const [notice, setNotice] = useState('');
  const connect = (person: typeof talent[number]) => {
    if (connected.includes(person.id)) return;
    setConnected(current => [...current, person.id]);
    setNotice(`La conexión con ${person.name} ya está lista para conversar.`);
    window.setTimeout(() => setNotice(''), 3000);
  };
  return <div className="page partners-page">
    <section className="partners-hero"><div><div className="eyebrow">SOCIOS RECOMENDADOS</div><h1>Conecta con personas que pueden impulsar tu siguiente idea</h1><p>La IA organizó estas recomendaciones según tus habilidades, intereses y objetivos de colaboración.</p></div><div className="partners-hero-stat"><strong>{talent.length}</strong><span>perfiles compatibles</span><small>Actualizado ahora</small></div></section>
    <div className="partners-toolbar"><div><span><Icon name="spark" size={16}/> Matching inteligente activo</span><small>La institución permanece oculta hasta que ambas partes acepten conectar.</small></div><div className="partner-avatars">{talent.slice(0,4).map(person => <Avatar key={person.id} label={person.name} color={person.color} small/>)}<span>+{talent.length - 4}</span></div></div>
    <section className="partners-grid">{talent.map(person => {
      const isConnected = connected.includes(person.id);
      return <article className={`partner-card ${isConnected ? 'connected' : ''}`} key={person.id}>
        <div className="partner-card-top"><span className="partner-avatar-wrap"><Avatar label={person.name} color={person.color}/><i>{person.match}%</i></span><span className="partner-match"><Icon name="spark" size={13}/> Match recomendado</span></div>
        <div><h2>{person.name}</h2><p>{person.career} · {person.cycle}</p></div>
        <div className="partner-skills">{person.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        <div className="partner-insight"><small>POR QUÉ PODRÍAN CONECTAR</small><p>{person.id % 3 === 0 ? 'Aporta una perspectiva analítica que complementa tus decisiones de producto.' : person.id % 2 === 0 ? 'Sus habilidades creativas pueden fortalecer la experiencia y comunicación de tu idea.' : 'Su perfil combina ejecución, estrategia y una alta afinidad con tus intereses.'}</p></div>
        <button className={isConnected ? 'chat-ready' : ''} onClick={() => isConnected ? onChat(person.name) : connect(person)}>{isConnected ? <Icon name="chat" size={16}/> : null} {isConnected ? 'Chatear' : 'Conectar'}</button>
      </article>;
    })}</section>
    {notice && <div className="connection-toast" role="status"><span><Icon name="check" size={17}/></span><div><b>Conexión confirmada</b><p>{notice}</p></div><button aria-label="Cerrar" onClick={() => setNotice('')}><Icon name="x" size={16}/></button></div>}
  </div>;
}

function Profile() {
  const [skills, setSkills] = useState(['UX Research','React','Comunicación']);
  return <div className="page profile-page">
    <section className="profile-cover"><div className="profile-cover-pattern"/><div className="profile-identity"><Avatar label="Camila Torres" color="coral"/><div><span className="status active">Perfil activo y verificado</span><h1>Camila Torres</h1><p>Ingeniería Empresarial · 8.º ciclo</p><small>Piura, Perú · Buscando equipo</small></div></div><div className="profile-cover-actions"><Button variant="secondary">Vista previa pública</Button><Button icon="check">Guardar cambios</Button></div></section>
    <div className="profile-layout">
      <main className="profile-main">
        <section className="profile-section"><div className="profile-section-head"><div><span>01</span><div><h2>Sobre mí</h2><p>Una introducción breve para futuros equipos.</p></div></div><button>Editar</button></div><p className="profile-bio">Me interesa convertir problemas cotidianos en productos digitales simples y útiles. Disfruto investigar con usuarios, ordenar ideas y colaborar con perfiles técnicos y creativos.</p><div className="profile-meta-grid"><span><small>OBJETIVO ACTUAL</small><b>Sumarme a un equipo</b></span><span><small>ÁREA DE INTERÉS</small><b>Producto y sostenibilidad</b></span><span><small>IDIOMAS</small><b>Español · Inglés B2</b></span></div></section>
        <section className="profile-section"><div className="profile-section-head"><div><span>02</span><div><h2>Identidad de talento</h2><p>Habilidades visibles en tu perfil ciego.</p></div></div><small>{skills.length} seleccionadas</small></div><div className="section-label"><span>Habilidades técnicas y colaborativas</span><small>Selecciona las que mejor te representan</small></div><div className="profile-skill-grid">{[...hardSkills,...softSkills].slice(0,10).map(x => <SkillCard compact key={x} label={x} active={skills.includes(x)} onClick={() => setSkills(skills.includes(x)?skills.filter(s=>s!==x):[...skills,x])}/>)}</div><div className="profile-note"><Icon name="spark"/><span><b>Tu perfil destaca por pensamiento de producto</b>Las habilidades precisas mejoran la calidad de tus recomendaciones.</span></div></section>
        <section className="profile-section"><div className="profile-section-head"><div><span>03</span><div><h2>Experiencia y proyectos</h2><p>Evidencias que generan confianza en otros equipos.</p></div></div><button>+ Añadir</button></div><div className="profile-experience"><article><div className="project-logo">VC</div><div><span className="status active">Proyecto activo</span><h3>Vitrina Circular</h3><p>Investigación de usuarios y definición del flujo de intercambio.</p><small>UX Research · Producto</small></div></article><article><div className="project-logo draft">ID</div><div><span className="status">Caso académico</span><h3>Interfaz de datos urbanos</h3><p>Prototipo para visualizar indicadores de movilidad sostenible.</p><small>Figma · Analítica</small></div></article></div></section>
      </main>
      <aside className="profile-aside">
        <section className="profile-completion"><div><span><Icon name="spark"/></span><div><small>FORTALEZA DEL PERFIL</small><h2>82% completo</h2></div></div><div className="profile-progress"><i/></div><p>Añade una experiencia y una presentación para aumentar la confianza.</p><ul><li className="done"><Icon name="check" size={13}/> Identidad verificada</li><li className="done"><Icon name="check" size={13}/> Habilidades añadidas</li><li><Icon name="plus" size={13}/> Presentación personal</li></ul></section>
        <section className="profile-side-card"><div className="eyebrow">REPUTACIÓN</div><strong>4.9</strong><Stars value={4.9}/><p>Basado en 38 valoraciones de equipos.</p><div><span><b>96%</b><small>Puntualidad</small></span><span><b>94%</b><small>Trato humano</small></span></div></section>
        <section className="profile-side-card privacy"><div className="eyebrow">PRIVACIDAD</div><h3>Matching ciego activo</h3><p>Tu institución permanece oculta hasta que ambas partes acepten conectar.</p><span><Icon name="check" size={14}/> Configuración protegida</span></section>
      </aside>
    </div>
  </div>;
}

function InviteModal({ person, onClose, onSent }: { person: typeof talent[number]; onClose: () => void; onSent: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><Icon name="x"/></button><div className="modal-icon"><Icon name="send"/></div><h2>Invitar a {person.name}</h2><p>Envía una invitación clara y personal. La institución seguirá siendo privada.</p><Field label="Proyecto"><select><option>Vitrina Circular</option><option>Aula Nómada</option></select></Field><Field label="Mensaje introductorio"><textarea rows={4} defaultValue={`Hola, ${person.name}. Tu experiencia en ${person.skills[0]} encaja muy bien con el próximo hito de nuestro proyecto.`}/></Field><div className="button-row"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon="send" onClick={onSent}>Enviar solicitud</Button></div></div></div>;
}

function Notifications({ close, onAccept }: { close: () => void; onAccept: (project: string) => void }) {
  return <><div className="drawer-backdrop" onClick={close}/><aside className="notification-drawer"><header><div><h2>Notificaciones</h2><p>4 nuevas desde tu última visita</p></div><button onClick={close}><Icon name="x"/></button></header><div className="notification-tabs"><button className="active">Todas <span>4</span></button><button>Invitaciones</button><button>Actividad</button></div><div className="notification-list">
    <article className="notification unread"><Avatar label="Aula Nómada" color="coral" small/><div><span className="status pending">Pendiente</span><p>El proyecto <b>Aula Nómada</b> te ha invitado para el rol de <b>UX Research</b>.</p><small>Hace 8 minutos</small><div><Button onClick={() => onAccept('Aula Nómada')}>Aceptar</Button><Button variant="secondary">Rechazar</Button></div></div></article>
    <article className="notification"><Avatar label="Diego R" color="violet" small/><div><span className="status active">Aceptada</span><p><b>Diego R.</b> ha aceptado tu invitación a Vitrina Circular.</p><small>Hace 1 hora</small></div></article>
    <article className="notification"><Avatar label="Proyecto" color="amber" small/><div><span className="status expired">Posición cubierta</span><p>La posición de Backend en Nexo Salud ya fue cubierta por otro estudiante.</p><small>Ayer</small></div></article>
  </div></aside></>;
}

function Offboarding({ close }: { close: () => void }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const reasons = ['Carga académica','Pérdida de interés en la temática','Falta de comunicación interna','Desacuerdo con las decisiones del equipo','Incumplimiento de tareas pactadas'];
  return <div className="modal-backdrop locked"><div className="modal offboarding"><div className="modal-icon danger"><Icon name="logout"/></div><div className="eyebrow">SALIDA DEL EQUIPO · PASO {step} DE 2</div><h2>{step === 1 ? 'Antes de salir, ayúdanos a entender' : 'Reseña constructiva de personas'}</h2><p>{step === 1 ? 'Tu respuesta nos permite mejorar la formación de futuros equipos. Esta información será confidencial.' : 'Tu evaluación será anónima y ayudará a construir equipos más saludables.'}</p>{step === 1 ? <div className="radio-list">{reasons.map(r => <label key={r}><input type="radio" name="reason" checked={reason===r} onChange={() => setReason(r)}/><span>{r}</span></label>)}</div> : <div className="ratings">{['Puntualidad','Aporte técnico','Trato humano'].map(x => <div key={x}><span><b>{x}</b><small>Califica tu experiencia</small></span><Stars value={5} editable/></div>)}</div>}<div className="button-row"><Button variant="secondary" onClick={close}>Permanecer en el equipo</Button><Button variant="danger" disabled={step===1 && !reason} onClick={() => step===1 ? setStep(2) : close()}>{step===1?'Confirmar motivo y continuar':'Finalizar salida'}</Button></div></div></div>;
}

function AiLoadingScreen() {
  return <main className="ai-loading-screen" aria-live="polite" aria-busy="true">
    <div className="ai-loading-brand"><Logo/></div>
    <section className="ai-loading-content">
      <div className="ai-loader" role="status" aria-label="Analizando tu perfil con inteligencia artificial">
        <span><Icon name="spark" size={27}/></span>
      </div>
      <div>
        <div className="eyebrow">MATCHING INTELIGENTE</div>
        <h1>Buscando conexiones para ti</h1>
        <p>La IA está analizando tus habilidades y proyectos compatibles<span className="loading-dots" aria-hidden="true"><i/><i/><i/></span></p>
      </div>
    </section>
    <small className="ai-loading-foot">Preparando tu experiencia en NexusCampus</small>
  </main>;
}

function SuggestedProfiles({ onContinue, onBack }: { onContinue: (connections: number[]) => void; onBack: () => void }) {
  const [connected, setConnected] = useState<number[]>([]);
  const [notice, setNotice] = useState('');
  const sendConnection = (person: typeof talent[number]) => {
    if (connected.includes(person.id)) return;
    setConnected(current => [...current, person.id]);
    setNotice(`${person.name} recibió tu solicitud de conexión.`);
    window.setTimeout(() => setNotice(''), 3200);
  };
  return <main className="suggestions-screen">
    <header className="suggestions-header">
      <Logo/>
      <div className="suggestions-progress"><span><i/></span><small>Perfil activado · Recomendaciones listas</small></div>
      <button onClick={() => onContinue([])}>Omitir</button>
    </header>
    <section className="suggestions-content">
      <div className="suggestions-intro">
        <button className="suggestions-back" aria-label="Volver" onClick={onBack}><Icon name="chevronLeft" size={20}/></button>
        <div className="eyebrow">SELECCIONADOS POR IA</div>
        <h1>Conecta con personas que pueden impulsar tu siguiente idea</h1>
        <p>Encontramos perfiles complementarios a tus habilidades y objetivos. Puedes conectar ahora o descubrirlos más adelante.</p>
      </div>
      <div className="suggestions-list">
        {talent.map(person => {
          const isConnected = connected.includes(person.id);
          return <article className={`suggestion-row ${isConnected ? 'connected' : ''}`} key={person.id}>
            <div className="suggestion-avatar"><Avatar label={person.name} color={person.color}/><span>{person.match}%</span></div>
            <div className="suggestion-person"><h2>{person.name}</h2><p>{person.career} · {person.cycle}</p><div>{person.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
            <div className="suggestion-action">
              <button className={isConnected ? 'is-connected' : ''} disabled={isConnected} onClick={() => sendConnection(person)}>{isConnected && <Icon name="check" size={15}/>} {isConnected ? 'Solicitud enviada' : 'Conectar'}</button>
            </div>
          </article>;
        })}
      </div>
      <div className="suggestions-summary"><span>{connected.length > 0 ? `${connected.length} conexión${connected.length > 1 ? 'es' : ''} seleccionada${connected.length > 1 ? 's' : ''}` : 'Puedes continuar sin conectar todavía'}</span><Button icon="arrow" onClick={() => onContinue(connected)}>Ver detalles</Button></div>
    </section>
    {notice && <div className="connection-toast" role="status"><span><Icon name="check" size={17}/></span><div><b>Notificación enviada</b><p>{notice}</p></div><button aria-label="Cerrar" onClick={() => setNotice('')}><Icon name="x" size={16}/></button></div>}
  </main>;
}

function AppShell({ initialScreen, initialConnections }: { initialScreen: Screen; initialConnections: number[] }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedProject, setSelectedProject] = useState(ventures[0]);
  const [drawer, setDrawer] = useState(false);
  const [chatProject, setChatProject] = useState('Vitrina Circular');
  const [invite, setInvite] = useState<typeof talent[number] | null>(null);
  const [toast, setToast] = useState('');
  const [offboarding, setOffboarding] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const nav = useMemo(() => [
    ['dashboard','grid','Inicio'],['talent','users','Descubrir'],['partners','spark','Socios'],['publish','plus','Emprende'],['messages','chat','Mensajes'],['profile','user','Mi perfil']
  ] as [Screen,string,string][], []);
  const sent = () => { setInvite(null); setToast('Invitación enviada correctamente. Te avisaremos cuando responda.'); window.setTimeout(() => setToast(''), 3500); };
  return <div className={dark ? 'app dark' : 'app'}>
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="sidebar-logo"><Logo/><button onClick={() => setCollapsed(!collapsed)}><Icon name="menu"/></button></div><nav><small>MENÚ PRINCIPAL</small>{nav.map(n => <button className={screen===n[0]?'active':''} onClick={() => setScreen(n[0])} key={n[0]}><Icon name={n[1]}/><span>{n[2]}</span>{n[0]==='messages'&&<em>2</em>}</button>)}</nav><div className="sidebar-card"><Icon name="spark"/><b>Completa tu perfil</b><p>Estás al 82%. Añade tu experiencia para mejores matches.</p><span><i/></span></div></aside>
    <div className="main-shell"><header className="topbar"><div className="top-actions"><button onClick={() => setDark(!dark)} aria-label="Cambiar tema"><Icon name="moon"/></button><button className="notification-button" onClick={() => setDrawer(true)} aria-label="Notificaciones"><Icon name="bell"/><i>4</i></button><div className="top-divider"/><span><b>Modo talento</b><small>Buscando equipo</small></span><Avatar label="Camila Torres" color="coral" small/></div></header>
      <main className={screen === 'messages' ? 'chat-main' : ''}>{screen==='dashboard'&&<Dashboard go={setScreen}/>} {screen==='talent'&&<Explore onInvite={person => setInvite(person ?? null)} onOpenProject={project => { setSelectedProject(project); setScreen('project-detail'); }}/>} {screen==='partners'&&<Partners initialConnected={initialConnections} onChat={person => { setChatProject(person); setScreen('messages'); }}/>} {screen==='publish'&&<Publish/>} {screen==='messages'&&<Messages initialProject={chatProject} onLeave={() => setOffboarding(true)}/>} {screen==='profile'&&<Profile/>} {screen==='project-detail'&&<ProjectDetail project={selectedProject} onBack={() => setScreen('dashboard')} onDiscover={() => setScreen('talent')}/>}</main>
    </div>
    {drawer&&<Notifications close={() => setDrawer(false)} onAccept={project => { setChatProject(project); setDrawer(false); setScreen('messages'); }}/>}
    {invite&&<InviteModal person={invite} onClose={() => setInvite(null)} onSent={sent}/>}
    {offboarding&&<Offboarding close={() => setOffboarding(false)}/>}
    {toast&&<div className="toast"><span><Icon name="check"/></span><div><b>Solicitud enviada</b><p>{toast}</p></div><button onClick={() => setToast('')}><Icon name="x"/></button></div>}
  </div>;
}

export default function App() {
  const [stage, setStage] = useState<'onboarding' | 'loading' | 'suggestions' | 'app'>('onboarding');
  const [entryScreen, setEntryScreen] = useState<Screen>('talent');
  const [initialConnections, setInitialConnections] = useState<number[]>([]);
  const beginMatching = () => {
    setStage('loading');
    window.setTimeout(() => setStage('suggestions'), 2800);
  };
  if (stage === 'loading') return <AiLoadingScreen/>;
  if (stage === 'suggestions') return <SuggestedProfiles onContinue={connections => { setInitialConnections(connections); setEntryScreen(connections.length > 0 ? 'partners' : 'talent'); setStage('app'); }} onBack={() => setStage('onboarding')}/>;
  if (stage === 'app') return <AppShell initialScreen={entryScreen} initialConnections={initialConnections}/>;
  return <Onboarding onComplete={beginMatching}/>;
}
