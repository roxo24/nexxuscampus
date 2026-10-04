import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { SkillCard, SkillCounter, SituationCard } from '../components/OnboardingParts';
import { Button, Field, Logo, Stepper } from '../components/ui';
import { hardSkills, softSkills } from '../data/mock';
import { getEstudiantesUNP, completarOnboarding } from '../services/api';
import type { OnboardingStep } from '../types';

interface EstudianteUNP {
  codigo_estudiante: string;
  nombres: string;
  apellidos: string;
  correo_institucional: string;
  carrera: string;
  ciclo: number;
  estado_matricula?: string;
}

const DEFAULT_ESTUDIANTE: EstudianteUNP = {
  codigo_estudiante: '0202114001',
  nombres: 'Carlos',
  apellidos: 'Mendoza Silva',
  carrera: 'Ingeniería Industrial',
  correo_institucional: 'cmendozas@unp.edu.pe',
  ciclo: 7,
  estado_matricula: 'Regular'
};

export function Onboarding({ onComplete }: { onComplete: (student?: EstudianteUNP) => void }) {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [accepted, setAccepted] = useState(false);
  const [listaUNP, setListaUNP] = useState<EstudianteUNP[]>([]);
  const [estudiante, setEstudiante] = useState<EstudianteUNP>(DEFAULT_ESTUDIANTE);
  const [hard, setHard] = useState<string[]>(['UX Research', 'React']);
  const [soft, setSoft] = useState<string[]>(['Comunicación']);
  const [objective, setObjective] = useState<'team' | 'project'>('team');
  const [project, setProject] = useState({ name: '', sector: 'Tecnología', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarEstudiantes() {
      try {
        const data = await getEstudiantesUNP();
        if (data && data.length > 0) {
          setListaUNP(data);
          setEstudiante(data[0]);
        }
      } catch (err) {
        console.log('Modo local: usando estudiante predeterminado de la UNP');
      }
    }
    cargarEstudiantes();
  }, []);

  const handleSeleccionarEstudiante = (codigo: string) => {
    const encontrado = listaUNP.find(e => e.codigo_estudiante === codigo);
    if (encontrado) {
      setEstudiante(encontrado);
    }
  };

  const skillsReady = hard.length >= 2 && soft.length >= 1;
  const toggle = (item: string, list: string[], setter: (x: string[]) => void) => 
    setter(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);

  const finish = async () => {
    setLoading(true);
    try {
      await completarOnboarding({
        codigo_estudiante: estudiante.codigo_estudiante,
        correo_institucional: estudiante.correo_institucional,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        carrera: estudiante.carrera,
        ciclo: estudiante.ciclo,
        terminos_y_condiciones: accepted,
        hard_skills: hard,
        soft_skills: soft,
        situacion_actual: objective === 'project' ? 'Tengo un proyecto' : 'Busco equipo',
        proyecto: objective === 'project' ? {
          nombre: project.name,
          sector: project.sector,
          descripcion: project.description
        } : undefined
      });
    } catch (e) {
      console.warn('Onboarding guardado en sesión local:', e);
    } finally {
      setLoading(false);
      onComplete(estudiante);
    }
  };

  return <main className="onboarding-shell">
    <header className="onboarding-header"><Logo/><Stepper step={step}/><span className="secure">Padrón Oficial UNP</span></header>
    <section className="onboarding-card">
      <div className="eyebrow">PASO {step} DE 3</div>
      {step === 1 && <>
        <h1>Confirma tu identidad académica</h1>
        <p className="lead">Validamos tu acceso con el registro oficial de la Universidad Nacional de Piura. Tu institución permanece protegida durante el matching ciego.</p>
        
        {listaUNP.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <Field label="Seleccionar estudiante del padrón UNP (Demo)">
              <select 
                value={estudiante.codigo_estudiante} 
                onChange={e => handleSeleccionarEstudiante(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                {listaUNP.map(e => (
                  <option key={e.codigo_estudiante} value={e.codigo_estudiante}>
                    {e.nombres} {e.apellidos} — {e.carrera} ({e.codigo_estudiante})
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        <div className="form-grid">
          <Field label="Nombres"><input value={estudiante.nombres} readOnly/></Field>
          <Field label="Apellidos"><input value={estudiante.apellidos} readOnly/></Field>
          <Field label="Carrera"><input value={estudiante.carrera} readOnly/></Field>
          <Field label="Correo universitario"><input value={estudiante.correo_institucional} readOnly/></Field>
        </div>
        <label className="check-row">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}/>
          <span>
            <b>Acepto los Términos y Condiciones</b>
            <small>Incluye nuestras reglas de convivencia universitaria y protección de datos.</small>
          </span>
        </label>
        <Button className="wide" disabled={!accepted} icon="arrow" onClick={() => setStep(2)}>Confirmar identidad</Button>
      </>}
      {step === 2 && <>
        <div className="skill-step-heading">
          <span><Icon name="spark"/></span>
          <div>
            <h1>Cuéntanos qué aportas al equipo</h1>
            <p>Construye tu identidad de talento seleccionando las fortalezas que mejor te representan.</p>
          </div>
        </div>
        <section className="skill-group">
          <div className="skill-group-heading">
            <div>
              <span>01</span>
              <div>
                <h2>Hard skills</h2>
                <p>Conocimientos técnicos que puedes aplicar desde el primer día.</p>
              </div>
            </div>
            <SkillCounter count={hard.length} minimum={2}/>
          </div>
          <div className="skill-card-grid soft">
            {hardSkills.map(x => <SkillCard key={x} label={x} active={hard.includes(x)} onClick={() => toggle(x, hard, setHard)}/>)}
          </div>
        </section>
        <section className="skill-group">
          <div className="skill-group-heading">
            <div>
              <span>02</span>
              <div>
                <h2>Soft skills</h2>
                <p>La forma en que colaboras, comunicas y haces avanzar al equipo.</p>
              </div>
            </div>
            <SkillCounter count={soft.length} minimum={1}/>
          </div>
          <div className="skill-card-grid soft">
            {softSkills.map(x => <SkillCard key={x} label={x} active={soft.includes(x)} onClick={() => toggle(x, soft, setSoft)}/>)}
          </div>
        </section>
        <div className="talent-tip">
          <Icon name="spark"/>
          <span><b>Un perfil claro genera mejores conexiones</b>Selecciona habilidades que puedas demostrar en un proyecto real.</span>
        </div>
        <div className="button-row skill-actions">
          <Button variant="ghost" onClick={() => setStep(1)}>Volver</Button>
          <Button className={skillsReady ? 'ready-pulse' : ''} disabled={!skillsReady} icon="arrow" onClick={() => setStep(3)}>Continuar a mi objetivo</Button>
        </div>
      </>}
      {step === 3 && <>
        <h1>¿Cuál es tu situación actual en el campus?</h1>
        <p className="lead">Elige lo que quieres lograr primero. Podrás cambiarlo más adelante.</p>
        <div className="choice-grid">
          <SituationCard number="01" title="Busco un equipo" description="Quiero sumarme a una idea y aportar mis habilidades." selected={objective === 'team'} onSelect={() => setObjective('team')}/>
          <SituationCard number="02" title="Tengo un proyecto" description="Busco talento para completar mi equipo." selected={objective === 'project'} onSelect={() => setObjective('project')}/>
        </div>
        {objective === 'project' && <div className="project-fields">
          <Field label="Nombre o título del proyecto"><input placeholder="Ej. AgroSmart Piura" value={project.name} onChange={e => setProject({ ...project, name: e.target.value })}/></Field>
          <Field label="Sector">
            <select value={project.sector} onChange={e => setProject({ ...project, sector: e.target.value })}>
              <option value="Agroindustria">Agroindustria</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Fintech">Fintech</option>
              <option value="Educación">Educación</option>
              <option value="Economía circular">Economía circular</option>
              <option value="Salud">Salud</option>
            </select>
          </Field>
          <Field label="Descripción"><textarea rows={4} placeholder="Cuéntanos brevemente qué problema resuelve tu proyecto y cómo imaginas la solución." value={project.description} onChange={e => setProject({ ...project, description: e.target.value })}/></Field>
        </div>}
        <div className="button-row">
          <Button variant="ghost" onClick={() => setStep(2)}>Volver</Button>
          <Button 
            disabled={loading || (objective === 'project' && (!project.name.trim() || !project.description.trim()))} 
            icon={loading ? undefined : 'arrow'} 
            onClick={finish}
          >
            {loading ? 'Guardando en NexusCampus…' : objective === 'team' ? 'Activar mi perfil' : 'Publicar y activar perfil'}
          </Button>
        </div>
      </>}
    </section>
    <p className="onboarding-foot">NexusCampus protege tu identidad institucional durante el matching.</p>
  </main>;
}
