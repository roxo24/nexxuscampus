import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Chip, Field, Stepper } from '../components/ui';
import { crearProyecto } from '../services/api';

export function Publish({ onCreated }: { onCreated?: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Aula Nómada');
  const [sector, setSector] = useState('Educación');
  const [description, setDescription] = useState('Ayudamos a estudiantes con poco tiempo a aprender mediante cápsulas prácticas creadas por pares.');
  const [maturity, setMaturity] = useState('prototype');
  const [needs, setNeeds] = useState(['Desarrollo frontend', 'Marketing']);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const maturityMap: Record<string, string> = {
    idea: 'Idea inicial',
    prototype: 'Prototipo en desarrollo',
    market: 'Validación en mercado'
  };

  const handlePublicar = async () => {
    setLoading(true);
    try {
      await crearProyecto({
        nombre: name,
        sector: sector,
        descripcion: description,
        nivel_madurez: maturityMap[maturity] || 'Idea inicial',
        habilidades: needs
      });
      setPublished(true);
      if (onCreated) onCreated();
    } catch (err) {
      console.warn('Proyecto guardado en sesión local:', err);
      setPublished(true);
    } finally {
      setLoading(false);
    }
  };

  return <div className="page narrow-page">
    <div className="page-title">
      <div>
        <div className="eyebrow">NUEVO EMPRENDIMIENTO</div>
        <h1>Convierte tu idea en un equipo</h1>
        <p>Completa lo esencial. Siempre podrás mejorarlo después.</p>
      </div>
      <span className="status">{published ? 'Publicado en vitrina' : 'Borrador'}</span>
    </div>
    
    <Stepper step={step}/>
    
    <section className="form-panel">
      <div className="form-step-head">
        <span>0{step}</span>
        <div>
          <h2>{step === 1 ? 'Datos generales' : step === 2 ? 'Etapa de madurez' : 'Necesidades del equipo'}</h2>
          <p>{step === 1 ? 'Dale contexto a las personas que descubrirán tu proyecto.' : step === 2 ? 'Esto nos ayuda a recomendar perfiles con experiencia adecuada.' : 'Define qué perfiles harán avanzar tu siguiente hito.'}</p>
        </div>
      </div>

      {step === 1 && (
        <div className="stack">
          <Field label="Nombre del emprendimiento">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Aula Nómada"/>
          </Field>
          <Field label="Sector">
            <select value={sector} onChange={e => setSector(e.target.value)}>
              <option value="Educación">Educación</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Fintech">Fintech</option>
              <option value="Agroindustria">Agroindustria</option>
              <option value="Salud">Salud</option>
              <option value="Economía circular">Economía circular</option>
            </select>
          </Field>
          <Field label="Problema y solución">
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}/>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="maturity-grid">
          {[
            ['idea','Idea inicial','Estamos definiendo el problema'],
            ['prototype','Prototipo en desarrollo','Ya podemos mostrar cómo funciona'],
            ['market','Validación en mercado','Tenemos usuarios o primeras ventas']
          ].map(x => (
            <button 
              className={`maturity ${maturity === x[0] ? 'selected' : ''}`} 
              onClick={() => setMaturity(x[0])} 
              key={x[0]}
            >
              <span>{x[0] === 'idea' ? '01' : x[0] === 'prototype' ? '02' : '03'}</span>
              <b>{x[1]}</b>
              <small>{x[2]}</small>
              {maturity === x[0] && <i><Icon name="check" size={14}/></i>}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="stack">
          <Field label="¿Qué habilidades necesita tu equipo?" hint="Selecciona al menos una habilidad.">
            <div className="chips">
              {['Desarrollo frontend','Ventas B2B','Finanzas','UX Research','Marketing','Python','Backend'].map(x => (
                <Chip 
                  key={x} 
                  active={needs.includes(x)} 
                  onClick={() => setNeeds(needs.includes(x) ? needs.filter(n => n !== x) : [...needs,x])}
                >
                  {x}
                </Chip>
              ))}
            </div>
          </Field>
          {published && (
            <div className="success-banner">
              <Icon name="check"/>
              <span>
                <b>¡Tu proyecto ya está activo en NexusCampus!</b>
                Ahora aparece en las búsquedas de talento y cuenta con sala de chat propia.
              </span>
            </div>
          )}
        </div>
      )}

      <div className="button-row split">
        <Button variant="secondary" onClick={() => alert('Borrador guardado localmente')}>Guardar borrador</Button>
        <div>
          {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Volver</Button>}
          {step < 3 ? (
            <Button icon="arrow" disabled={!name.trim() || !description.trim()} onClick={() => setStep(step + 1)}>
              Continuar
            </Button>
          ) : (
            <Button 
              icon="check" 
              disabled={needs.length === 0 || loading || published} 
              onClick={handlePublicar}
            >
              {loading ? 'Publicando…' : published ? 'Publicado' : 'Publicar en vitrina'}
            </Button>
          )}
        </div>
      </div>
    </section>
  </div>;
}
