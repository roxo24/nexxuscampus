import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Chip, Avatar } from '../components/ui';
import { ventures as initialVentures, talent as initialTalent } from '../data/mock';
import { getTalento, getProyectos, buscarTalentoPorIA } from '../services/api';

export function Explore({ onInvite, onOpenProject }: { onInvite: (person?: any) => void; onOpenProject: (project: any) => void }) {
  const [tab, setTab] = useState<'ai' | 'skill' | 'career'>('ai');
  const [resultVersion, setResultVersion] = useState(0);
  const [selected, setSelected] = useState(['Finanzas', 'Diseño UX']);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [activeMatch, setActiveMatch] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<'next' | 'previous'>('next');
  const [ventureIndex, setVentureIndex] = useState(0);

  const [talentos, setTalentos] = useState<any[]>(initialTalent);
  const [proyectos, setProyectos] = useState<any[]>(initialVentures);
  const [aiTalento, setAiTalento] = useState<any[] | null>(null);
  const [aiSkillsDetectadas, setAiSkillsDetectadas] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [talentoData, proyectosData] = await Promise.allSettled([
          getTalento(),
          getProyectos()
        ]);
        if (talentoData.status === 'fulfilled' && talentoData.value && talentoData.value.length > 0) {
          setTalentos(talentoData.value);
        }
        if (proyectosData.status === 'fulfilled' && proyectosData.value && proyectosData.value.length > 0) {
          setProyectos(proyectosData.value);
        }
      } catch (err) {
        console.log('Explore: usando datos locales de fallback');
      }
    }
    cargarDatos();
  }, []);

  const skillAliases: Record<string, string[]> = {
    'Desarrollo web': ['react', 'python', 'frontend', 'typescript', 'apis'],
    'Diseño UX': ['ux research', 'figma', 'branding', 'ui/ux'],
    Finanzas: ['finanzas', 'excel avanzado', 'pitch', 'costos'],
    Marketing: ['storytelling', 'oratoria', 'contenido', 'marketing', 'investigación'],
    Python: ['python', 'analítica', 'ia aplicada', 'base de datos', 'apis'],
  };

  const careerOptions = ['Ingeniería Industrial', 'Ingeniería de Software', 'Diseño Digital', 'Ciencia de Datos', 'Comunicación'];

  const normalizeSearch = (value?: string) => {
    if (!value) return '';
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const handleEjecutarBusqueda = async () => {
    setAppliedQuery(searchQuery);
    setResultVersion(v => v + 1);
    setActiveMatch(0);

    if (tab === 'ai' && searchQuery.trim()) {
      setIsAiLoading(true);
      try {
        const res = await buscarTalentoPorIA(searchQuery.trim());
        if (res && res.talento && res.talento.length > 0) {
          setAiTalento(res.talento);
          setAiSkillsDetectadas(res.habilidades_detectadas || []);
        } else {
          setAiTalento(null);
        }
      } catch (e) {
        console.warn('Búsqueda por IA local fallback');
        setAiTalento(null);
      } finally {
        setIsAiLoading(false);
      }
    } else {
      setAiTalento(null);
      setAiSkillsDetectadas([]);
    }
  };

  const visibleTalent = useMemo(() => {
    if (tab === 'ai' && aiTalento) {
      return aiTalento;
    }

    const query = normalizeSearch(appliedQuery.trim());
    return talentos.filter(person => {
      const career = person?.career || '';
      const skills = Array.isArray(person?.skills) ? person.skills : [];
      const normalizedCareer = normalizeSearch(career);
      const searchable = normalizeSearch(`${career} ${skills.join(' ')}`);
      const queryMatches = !query || searchable.includes(query);

      if (tab === 'skill') {
        const skillsMatch = selected.length === 0 || selected.some(skill => 
          (skillAliases[skill] || [skill]).some(alias => searchable.includes(normalizeSearch(alias)))
        );
        return queryMatches && skillsMatch;
      }
      if (tab === 'career') {
        const careerMatches = selectedCareers.length === 0 || selectedCareers.some(c => normalizedCareer === normalizeSearch(c));
        const careerQueryMatches = !query || normalizedCareer.includes(query);
        return careerMatches && careerQueryMatches;
      }
      return queryMatches;
    });
  }, [appliedQuery, selected, selectedCareers, tab, talentos, aiTalento]);

  const activeTalent = visibleTalent[activeMatch];

  const matchReasons: Record<number, string> = {
    1: 'Su experiencia en finanzas y presentación estratégica complementa exactamente las necesidades de tu proyecto.',
    2: 'Su enfoque en investigación y diseño puede convertir los hallazgos del equipo en una experiencia clara y útil.',
    3: 'Su dominio de datos e inteligencia artificial permite validar decisiones y descubrir oportunidades de crecimiento.',
    4: 'Su capacidad para comunicar ideas complejas puede fortalecer la propuesta, el pitch y la llegada a nuevos usuarios.',
    5: 'Su experiencia con React, TypeScript y diseño de interfaces permite transformar rápidamente una idea en un producto.',
    6: 'Su perfil combina análisis de datos, arquitectura de información y APIs para construir soluciones escalables.',
    7: 'Su mirada de marketing e investigación ayuda a entender audiencias y comunicar el valor del proyecto.',
  };

  const getReason = (person: any) => {
    if (!person) return '';
    if (person.ai_reason) return person.ai_reason;
    if (matchReasons[person.id]) return matchReasons[person.id];
    const firstSkill = Array.isArray(person.skills) && person.skills[0] ? person.skills[0] : 'su especialidad';
    return `Su formación en ${person.career || 'su carrera'} y su experiencia en ${firstSkill} aportan un balance técnico y colaborativo ideal para tu equipo.`;
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
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [activeMatch, resultVersion, tab, visibleTalent.length]);

  return <div className="page explore-page">
    <section className="explore-hero">
      <div>
        <div className="eyebrow">MATCHING INTELIGENTE CON IA</div>
        <h1>Encuentra a la persona que tu idea necesita.</h1>
        <p>Describe el reto con tus propias palabras o busca por habilidades complementarias. Analizamos perfiles multidisciplinarios para formar equipos de alto impacto.</p>
      </div>
      <div className="explore-orbit">
        <span><Avatar label="Valeria S" color="coral"/></span>
        <span><Avatar label="Diego R" color="violet"/></span>
        <span><Avatar label="Lucía M" color="mint"/></span>
        <i><Icon name="spark"/></i>
      </div>
    </section>

    <section className="talent-finder">
      <div className="finder-tabs">
        {[
          ['ai','Asistente con IA'],
          ['skill','Por habilidades'],
          ['career','Por carrera']
        ].map(t => (
          <button 
            className={tab === t[0] ? 'active' : ''} 
            onClick={() => { 
              setTab(t[0] as any); 
              setAppliedQuery(''); 
              setSearchQuery(''); 
              setAiTalento(null);
              setAiSkillsDetectadas([]);
              setActiveMatch(0);
            }} 
            key={t[0]}
          >
            {t[1]}{t[0] === 'ai' && <small>INTELIGENTE</small>}
          </button>
        ))}
      </div>

      <div className="finder-search">
        <Icon name={tab === 'ai' ? 'spark' : 'search'}/>
        <input 
          aria-label="Buscar talento" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          onKeyDown={e => { if (e.key === 'Enter') handleEjecutarBusqueda(); }} 
          placeholder={
            tab === 'skill' ? 'Ej. UX Research, Python, finanzas o diseño' : 
            tab === 'career' ? 'Ej. Ingeniería Industrial o Ciencia de Datos' : 
            'Ej. Necesito validar costos y convertir los datos en un pitch convincente'
          }
        />
        <Button onClick={handleEjecutarBusqueda} disabled={isAiLoading}>
          {isAiLoading ? 'Analizando con IA…' : 'Buscar talento'}
        </Button>
      </div>

      {tab === 'ai' && aiSkillsDetectadas.length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6557dc' }}>✨ Habilidades detectadas por IA:</span>
          {aiSkillsDetectadas.map(sk => (
            <span key={sk} style={{ fontSize: '10px', background: '#eeecff', color: '#4e42b8', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              {sk}
            </span>
          ))}
        </div>
      )}

      {tab === 'skill' && (
        <>
          <div className="skill-discovery">
            <span>Explora por habilidad</span>
            {['Todos','Desarrollo web','Diseño UX','Finanzas','Marketing','Python'].map(skill => (
              <Chip 
                key={skill} 
                active={skill === 'Todos' ? selected.length === 0 : selected.includes(skill)} 
                onClick={() => { 
                  setSelected(skill === 'Todos' ? [] : selected.includes(skill) ? selected.filter(item => item !== skill) : [...selected, skill]); 
                  setActiveMatch(0);
                }}
              >
                {skill}
              </Chip>
            ))}
          </div>
          <div className="skill-search-status">
            <span><b>{visibleTalent.length}</b> perfil{visibleTalent.length === 1 ? '' : 'es'} compatible{visibleTalent.length === 1 ? '' : 's'}</span>
            {(selected.length > 0 || appliedQuery) && (
              <button onClick={() => { setSelected([]); setSearchQuery(''); setAppliedQuery(''); setActiveMatch(0); }}>
                Limpiar filtros
              </button>
            )}
          </div>
        </>
      )}

      {tab === 'career' && (
        <>
          <div className="skill-discovery career-discovery">
            <span>Explora por carrera</span>
            <Chip active={selectedCareers.length === 0} onClick={() => { setSelectedCareers([]); setActiveMatch(0); }}>
              Todas
            </Chip>
            {careerOptions.map(career => (
              <Chip 
                key={career} 
                active={selectedCareers.includes(career)} 
                onClick={() => { 
                  setSelectedCareers(selectedCareers.includes(career) ? selectedCareers.filter(item => item !== career) : [...selectedCareers, career]); 
                  setActiveMatch(0);
                }}
              >
                {career}
              </Chip>
            ))}
          </div>
          <div className="skill-search-status career-search-status">
            <span><b>{visibleTalent.length}</b> perfil{visibleTalent.length === 1 ? '' : 'es'}</span>
            {(selectedCareers.length > 0 || appliedQuery) && (
              <button onClick={() => { setSelectedCareers([]); setSearchQuery(''); setAppliedQuery(''); setActiveMatch(0); }}>
                Limpiar carreras
              </button>
            )}
          </div>
        </>
      )}
    </section>

    {(tab === 'skill' || tab === 'career' || (tab === 'ai' && aiTalento)) && visibleTalent.length > 0 && (
      <section className="match-people-preview">
        <div>
          <span>COINCIDENCIAS ENCONTRADAS</span>
          <small>Selecciona un perfil para ver su compatibilidad</small>
        </div>
        <div className="match-people-row">
          {visibleTalent.slice(0, 4).map((person, index) => (
            <button 
              key={person.id || index} 
              className={activeMatch === index ? 'active' : ''} 
              onClick={() => { 
                setCarouselDirection(index > activeMatch ? 'next' : 'previous'); 
                setActiveMatch(index); 
              }}
            >
              <span className="match-circle">
                <Avatar label={person.name || person.nombres || 'NC'} color={person.color || 'violet'}/>
                <i>{person.match || 90}%</i>
              </span>
              <b>{person.name || person.nombres || 'Estudiante'}</b>
              <small>{person.career || 'Universidad'}</small>
              <em>{(Array.isArray(person.skills) ? person.skills : []).slice(0, 2).join(' · ')}</em>
            </button>
          ))}
        </div>
      </section>
    )}

    {activeTalent ? (
      <section className="featured-match ai-match-carousel result-reveal">
        <div className="ai-carousel-track">
          <div className="featured-match-copy">
            <span className="match">{activeTalent.match || 92}% COMPATIBLE</span>
            <h2>Un match que vale la pena conocer</h2>
            <p>{getReason(activeTalent)}</p>
            <div className="mini-chips">
              {(Array.isArray(activeTalent.skills) ? activeTalent.skills : []).map((skill: string) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <Button icon="arrow" onClick={() => onInvite(activeTalent)}>
              Conectar con este perfil
            </Button>
          </div>
          <div className="featured-person-viewport">
            <div key={`${tab}-${resultVersion}-${activeTalent.id}`} className={`featured-person purple-profile-slide slide-${carouselDirection}`}>
              <Avatar label={activeTalent.name || activeTalent.nombres || 'NC'} color={activeTalent.color || 'coral'}/>
              <span>
                <b>{activeTalent.career || 'Carrera Universitaria'}</b>
                <small>{activeTalent.cycle || '7.º ciclo'} · {activeTalent.rating || 4.8} de reputación</small>
              </span>
              <div className="match-bars">
                {[1,2,3,4,5].map(bar => (
                  <i key={bar} className={bar > Math.round(Number(activeTalent.rating) || 5) ? 'muted' : ''}/>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className="ai-carousel-arrow previous" aria-label="Perfil anterior" onClick={() => moveCarousel('previous')}>
          <Icon name="chevronLeft" size={21}/>
        </button>
        <button className="ai-carousel-arrow next" aria-label="Siguiente perfil" onClick={() => moveCarousel('next')}>
          <Icon name="chevronRight" size={21}/>
        </button>
        <div className="ai-carousel-dots" aria-label="Perfiles sugeridos">
          {visibleTalent.map((person, index) => (
            <button 
              key={person.id || index} 
              className={index === activeMatch ? 'active' : ''} 
              aria-label={`Ver perfil ${index + 1}`} 
              onClick={() => { 
                setCarouselDirection(index > activeMatch ? 'next' : 'previous'); 
                setActiveMatch(index); 
              }}
            />
          ))}
        </div>
        <span className="ai-carousel-count">0{activeMatch + 1} / 0{visibleTalent.length}</span>
      </section>
    ) : (
      <section className="talent-search-empty">
        <span><Icon name="search" size={25}/></span>
        <h2>No encontramos perfiles con esos filtros</h2>
        <p>Prueba retirando una habilidad o utiliza una descripción más amplia.</p>
        <Button variant="secondary" onClick={() => { setSelected([]); setSearchQuery(''); setAppliedQuery(''); setAiTalento(null); }}>
          Mostrar todos los perfiles
        </Button>
      </section>
    )}

    <section className="discover-ventures">
      <div className="section-heading">
        <div>
          <div className="eyebrow">IDEAS EN MOVIMIENTO</div>
          <h2>Emprendimientos que buscan talento</h2>
          <p>Descubre proyectos activos y encuentra dónde puede generar mayor impacto tu experiencia.</p>
        </div>
        <div className="carousel-controls">
          <button aria-label="Proyecto anterior" onClick={() => setVentureIndex(current => (current - 1 + proyectos.length) % proyectos.length)}>
            <Icon name="chevronLeft" size={20}/>
          </button>
          <button aria-label="Siguiente proyecto" onClick={() => setVentureIndex(current => (current + 1) % proyectos.length)}>
            <Icon name="chevronRight" size={20}/>
          </button>
        </div>
      </div>
      <div className="discover-venture-viewport">
        <div className={`discover-venture-track venture-index-${ventureIndex}`}>
          {proyectos.map((venture, index) => (
            <article className={`discover-venture-card ${index === ventureIndex ? 'active' : ''}`} key={venture.name || venture.nombre || index}>
              <img src={venture.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'} alt={`Equipo de ${venture.name || venture.nombre}`}/>
              <div className="discover-venture-overlay"/>
              <div className="discover-venture-content">
                <div>
                  <span>{venture.category || venture.sector || 'Innovación'}</span>
                  {index === 0 && <em>Destacado</em>}
                </div>
                <h3>{venture.name || venture.nombre}</h3>
                <p>{venture.copy || venture.descripcion}</p>
                <footer>
                  <small>{venture.progress || '3 de 5 perfiles'}</small>
                  <button onClick={() => onOpenProject(venture)}>
                    Conocer proyecto <Icon name="arrow" size={15}/>
                  </button>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="discover-venture-dots">
        {proyectos.map((venture, index) => (
          <button key={venture.name || venture.nombre || index} className={index === ventureIndex ? 'active' : ''} aria-label={`Ver proyecto ${index + 1}`} onClick={() => setVentureIndex(index)}/>
        ))}
      </div>
    </section>
  </div>;
}
