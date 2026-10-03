import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Chip, Field, Stepper } from '../components/ui';

export function Publish() {
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
