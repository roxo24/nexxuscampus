import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SkillCard } from '../components/OnboardingParts';
import { Button, Avatar, Stars } from '../components/ui';
import { hardSkills, softSkills } from '../data/mock';

export function Profile() {
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
