import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SkillCard, SkillCounter, SituationCard } from '../components/OnboardingParts';
import { Button, Field, Logo, Stepper } from '../components/ui';
import { hardSkills, softSkills, talent } from '../data/mock';
import type { OnboardingStep } from '../types';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
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
