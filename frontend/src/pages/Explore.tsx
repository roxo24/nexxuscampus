import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Chip, Avatar } from '../components/ui';
import { ventures as initialVentures, talent as initialTalent } from '../data/mock';
import { getTalento, getProyectos } from '../services/api';

export function Explore({ onInvite, onOpenProject }: { onInvite: (person?: typeof initialTalent[number]) => void; onOpenProject: (project: typeof initialVentures[number]) => void }) {
  const [tab, setTab] = useState('ai');
  const [resultVersion, setResultVersion] = useState(0);
  const [selected, setSelected] = useState(['Finanzas', 'Diseño UX']);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [activeMatch, setActiveMatch] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<'next' | 'previous'>('next');
  const [ventureIndex, setVentureIndex] = useState(0);
  const [talentos, setTalentos] = useState(initialTalent);
  const [proyectos, setProyectos] = useState(initialVentures);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [talentoData, proyectosData] = await Promise.allSettled([
          getTalento(),
          getProyectos()
        ]);
        if (talentoData.status === 'fulfilled' && talentoData.value.length > 0) {
          setTalentos(talentoData.value);
        }
        if (proyectosData.status === 'fulfilled' && proyectosData.value.length > 0) {
          setProyectos(proyectosData.value);
        }
      } catch (err) {
        console.log('Explore: usando datos locales');
      }
    }
    cargarDatos();
  }, []);
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
    return talentos.filter(person => {
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
      <div className="section-heading"><div><div className="eyebrow">IDEAS EN MOVIMIENTO</div><h2>Emprendimientos que buscan talento</h2><p>Descubre proyectos activos y encuentra dónde puede generar mayor impacto tu experiencia.</p></div><div className="carousel-controls"><button aria-label="Proyecto anterior" onClick={() => setVentureIndex(current => (current - 1 + proyectos.length) % proyectos.length)}><Icon name="chevronLeft" size={20}/></button><button aria-label="Siguiente proyecto" onClick={() => setVentureIndex(current => (current + 1) % proyectos.length)}><Icon name="chevronRight" size={20}/></button></div></div>
      <div className="discover-venture-viewport">
        <div className={`discover-venture-track venture-index-${ventureIndex}`}>
          {proyectos.map((venture, index) => <article className={`discover-venture-card ${index === ventureIndex ? 'active' : ''}`} key={venture.name}>
            <img src={venture.image} alt={`Equipo de ${venture.name}`}/><div className="discover-venture-overlay"/>
            <div className="discover-venture-content"><div><span>{venture.category}</span>{index === 0 && <em>Destacado</em>}</div><h3>{venture.name}</h3><p>{venture.copy}</p><footer><small>{venture.progress}</small><button onClick={() => onOpenProject(venture)}>Conocer proyecto <Icon name="arrow" size={15}/></button></footer></div>
          </article>)}
        </div>
      </div>
      <div className="discover-venture-dots">{proyectos.map((venture, index) => <button key={venture.name} className={index === ventureIndex ? 'active' : ''} aria-label={`Ver ${venture.name}`} onClick={() => setVentureIndex(index)}/>)}</div>
    </section>
  </div>;
}
