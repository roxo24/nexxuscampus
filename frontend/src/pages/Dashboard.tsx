import { Icon } from '../components/Icon';
import { Button, Avatar } from '../components/ui';
import { ventures, talent } from '../data/mock';
import type { Screen } from '../types';

export function Dashboard({ go }: { go: (screen: Screen) => void }) {
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
        <div className="demo-search"><small><Icon name="spark" size={14}/> ¿Qué estás buscando?</small><div><Icon name="search" size={18}/><span>Desarrollar la aplicación web y ayudar con el producto</span><b onClick={() => go('talent')} style={{ cursor: 'pointer' }}>Buscar talento</b></div></div>
        {[['Ana Sofía','Ingeniería de Software',['React','UI/UX','TypeScript'],'94%','coral'],['Mateo Ríos','Ciencia de Datos',['Python','Base de datos','APIs'],'89%','mint'],['Valentina Cruz','Comunicación',['Marketing','Investigación','Contenido'],'84%','amber']].map(person => <article className="demo-person" key={person[0] as string}><Avatar label={person[0] as string} color={person[4] as string}/><div><h3>{person[0]}</h3><p>{person[1]}</p><span>{(person[2] as string[]).map(skill => <i key={skill}>{skill}</i>)}</span></div><strong>{person[3]}<small>MATCH</small></strong></article>)}
      </div>
    </section>

    <section className="home-project-demo">
      <div className="home-section-copy"><div className="eyebrow">LIDERA UNA IDEA</div><h2>¿Tienes una idea? Encuentra a tu equipo.</h2><p>Publica tu proyecto, define las habilidades que necesitas y conecta con estudiantes que quieren construirlo contigo.</p><span className="home-fake-cta" onClick={() => go('publish')} style={{ cursor: 'pointer' }}>Publicar mi proyecto <Icon name="plus" size={18}/></span></div>
      <div className="fake-project-form"><header><span><small>Nuevo proyecto</small><b>Cuéntanos sobre tu idea</b></span><em>Borrador</em></header><div className="fake-field wide"><small>NOMBRE DEL PROYECTO</small><b>Mi proyecto universitario</b></div><div className="fake-form-grid"><div className="fake-field"><small>SECTOR</small><b>Tecnología</b></div><div className="fake-field"><small>NIVEL DE MADUREZ</small><b>Idea inicial</b></div></div><div className="fake-field wide"><small>HABILIDADES QUE NECESITAS</small><span><i>Desarrollo Web</i><i>Diseño UX</i><i>+ Añadir</i></span></div><div className="fake-optional">Carrera requerida <span>Opcional</span></div></div>
    </section>

    <section className="home-flow">
      <div className="home-centered-heading"><div className="eyebrow">DEL MATCH A LA ACCIÓN</div><h2>Una conexión se convierte en un equipo.</h2><p>Proyecto, vacante, invitación y aceptación: un flujo claro para empezar a colaborar.</p></div>
      <div className="home-flow-grid"><article><small>PROYECTO</small><h3>Campus Green</h3><p>Vacante: Desarrollo Web</p><div><span>React</span><span>APIs</span></div></article><i><Icon name="chevronRight"/></i><article className="flow-person"><Avatar label="Ana Sofía" color="violet"/><span><h3>Ana Sofía</h3><p>Desarrollo Web · React</p></span><b>Invitar al proyecto</b></article><i><Icon name="chevronRight"/></i><article className="flow-success"><span><Icon name="check"/></span><h3>Invitación aceptada</h3><p>Ana ya forma parte del equipo.</p><div><Avatar label="Lucía Morales" small/><Avatar label="Mateo Ríos" color="mint" small/><Avatar label="Ana Sofía" color="violet" small/></div></article></div>
    </section>
  </div>;
}
