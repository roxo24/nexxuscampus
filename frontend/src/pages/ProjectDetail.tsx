import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Avatar } from '../components/ui';

export function ProjectDetail({ project, onBack, onDiscover }: { project: any; onBack: () => void; onDiscover: () => void }) {
  const [applied, setApplied] = useState(false);

  // Normalización segura para soportar tanto mock.ts como la API SQLite
  const p = project || {};
  const nombre = p.nombre || p.name || 'Proyecto Universitario';
  const sector = p.sector || p.category || 'Tecnología e Innovación';
  const etapa = p.nivel_madurez || p.stage || 'Prototipo en desarrollo';
  const descripcion = p.descripcion || p.copy || 'Proyecto universitario colaborativo enfocado en resolver retos del campus.';
  const imagen = p.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400';
  const progreso = p.progress || '3 de 5 perfiles';
  const reto = p.challenge || 'Diseñar y validar una solución sostenible que responda a necesidades reales del entorno universitario.';
  const solucion = p.solution || descripcion;
  const impacto = p.impact || '92%';
  const impactoLabel = p.impactLabel || 'de validación positiva';
  const roles = Array.isArray(p.needs) && p.needs.length > 0 ? p.needs : ['Desarrollo frontend', 'Finanzas y Pitch', 'Diseño UX'];

  return <div className="project-detail-page">
    <section className="project-detail-cover">
      <img src={imagen} alt={`Equipo desarrollando ${nombre}`}/>
      <div className="project-detail-shade"/>
      <button className="project-back" onClick={onBack}>← Volver a ideas</button>
      <div className="project-cover-copy">
        <div>
          <span>{sector}</span>
          <span>{etapa}</span>
        </div>
        <h1>{nombre}</h1>
        <p>{descripcion}</p>
        <div className="project-cover-actions">
          <Button icon="send" onClick={() => setApplied(true)}>
            {applied ? 'Solicitud enviada' : 'Quiero ser parte'}
          </Button>
          <Button variant="secondary" onClick={onDiscover}>Ver perfiles similares</Button>
        </div>
      </div>
      <aside className="project-need-card">
        <small>EQUIPO EN FORMACIÓN</small>
        <strong>{progreso}</strong>
        <div className="project-member-stack">
          <Avatar label="Camila Torres" color="coral"/>
          <Avatar label="Diego R" color="violet"/>
          <Avatar label="Lucía M" color="mint"/>
          <span>+2</span>
        </div>
        <p>Buscamos personas curiosas, comprometidas y dispuestas a construir en equipo.</p>
      </aside>
    </section>

    <main className="project-detail-content">
      {applied && (
        <div className="project-application-success">
          <Icon name="check"/>
          <div>
            <b>Tu interés fue enviado al equipo</b>
            <p>La persona responsable revisará tu perfil y recibirás una notificación con la respuesta.</p>
          </div>
        </div>
      )}
      <section className="project-story">
        <article>
          <div className="eyebrow">EL RETO</div>
          <h2>¿Qué problema queremos resolver?</h2>
          <p>{reto}</p>
        </article>
        <article>
          <div className="eyebrow">NUESTRA PROPUESTA</div>
          <h2>Una solución nacida en el campus</h2>
          <p>{solucion}</p>
        </article>
      </section>
      <section className="project-detail-grid">
        <article className="project-impact">
          <div className="eyebrow">IMPACTO TEMPRANO</div>
          <strong>{impacto}</strong>
          <p>{impactoLabel}</p>
          <div className="impact-chart"><i/><i/><i/><i/><i/><i/></div>
        </article>
        <article className="project-roles">
          <div className="eyebrow">PERFILES QUE BUSCAMOS</div>
          <h2>El siguiente gran paso necesita estas habilidades</h2>
          <div>
            {roles.map((need: string, index: number) => (
              <span key={`${need}-${index}`}>
                <i>0{index + 1}</i>
                {need}
                <Icon name="arrow" size={15}/>
              </span>
            ))}
          </div>
        </article>
        <article className="project-roadmap">
          <div className="eyebrow">HOJA DE RUTA</div>
          <h2>De la idea al impacto</h2>
          <ol>
            <li className="done"><i><Icon name="check" size={13}/></i><span><b>Descubrimiento</b><small>Entrevistas y definición del reto</small></span></li>
            <li className="current"><i>2</i><span><b>{etapa}</b><small>Construyendo y aprendiendo con usuarios</small></span></li>
            <li><i>3</i><span><b>Primera comunidad</b><small>Lanzamiento piloto y medición</small></span></li>
          </ol>
        </article>
      </section>
      <section className="project-cta">
        <div>
          <div className="eyebrow">CONSTRUYAMOS JUNTOS</div>
          <h2>Tu experiencia puede cambiar el rumbo de esta idea.</h2>
          <p>No necesitas tener todas las respuestas. Buscamos personas que quieran descubrirlas en equipo.</p>
        </div>
        <Button icon="send" onClick={() => setApplied(true)}>
          {applied ? 'Solicitud enviada' : 'Presentar mi perfil'}
        </Button>
      </section>
    </main>
  </div>;
}
